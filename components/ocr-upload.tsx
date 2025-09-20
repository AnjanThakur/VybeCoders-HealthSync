"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scan, Upload, FileText, Download, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase" // adjust import path to your firebase config
import { collection, query, orderBy, where, getDocs } from "firebase/firestore"

interface ExtractedData {
  date: string | null
  doctorInfo: {
    name: string | null
    clinic: string | null
    address: string | null
    phone: string | null
  }
  patientVitals?: {
    weight: string | null
    bloodPressure: string | null
    temperature: string | null
    pulse: string | null
    height: string | null
    bmi: string | null
  } | null
  values?: Record<string, string>   // ✅ dynamic key-value pairs
  prescriptions: Array<{
    medication: string
    dosage: string | null
    timings: string[]
    duration: string | null
  }>
  notes: string | null
}


interface ProcessedDocument {
  id: string
  fileName: string
  fileUrl: string
  extractedData: ExtractedData
  uploadedAt: Date
  status: "processing" | "completed" | "error"
}

interface OCRUploadProps {
  onUploadComplete?: () => void
}

export function OCRUpload({ onUploadComplete }: OCRUploadProps) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // ✅ Fetch documents from Firestore on load
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.uid) return

      try {
        const q = query(
          collection(db, "prescriptions"),
          where("userId", "==", user.uid),
          orderBy("uploadedAt", "desc")
        )
        const querySnapshot = await getDocs(q)

        const docs: ProcessedDocument[] = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            fileName: data.fileName || "Unknown",
            fileUrl: data.fileUrl || "",
            extractedData: data.extractedData || {
              date: null,
              doctorInfo: { name: null, clinic: null, address: null, phone: null },
              patientVitals: null,
              prescriptions: [],
              notes: null,
            },
            uploadedAt: data.uploadedAt?.toDate?.() || new Date(),
            status: data.status || "completed",
          }
        })

        setDocuments(docs)
      } catch (error) {
        console.error("Error fetching documents:", error)
      }
    }

    fetchDocuments()
  }, [user])

  const processDocument = async (file: File) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (user?.uid) {
        formData.append("userId", user.uid)
      }

      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!ocrResponse.ok) {
        throw new Error(`OCR failed with status ${ocrResponse.status}`)
      }

      const { prescription, id } = await ocrResponse.json()

      const newDoc: ProcessedDocument = {
        id: id || Date.now().toString(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        extractedData: prescription.extractedData,
        uploadedAt: new Date(),
        status: "completed",
      }

      // ✅ Add immediately in UI
      setDocuments((prev) => [newDoc, ...prev])

      if (onUploadComplete) onUploadComplete()
    } catch (error) {
      console.error("Processing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => processDocument(file))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Documents</CardTitle>
          <CardDescription>
            Upload prescription images to extract and digitize the information using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              {isProcessing ? (
                <>
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Processing with AI...</p>
                </>
              ) : (
                <>
                  <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload prescription images or PDFs for AI processing
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports JPG, PNG, PDF up to 10MB
                  </p>
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Documents</CardTitle>
            <CardDescription>
              AI-extracted information from your uploaded prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{doc.fileName}</span>
                      <Badge variant="secondary">{doc.status}</Badge>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>

                  {doc.extractedData && (
  <div className="grid gap-3 text-sm">
    {doc.extractedData.date && (
      <div>
        <span className="font-medium">Date:</span> {doc.extractedData.date}
      </div>
    )}

    {(doc.extractedData.doctorInfo.name || doc.extractedData.doctorInfo.clinic) && (
      <div>
        <span className="font-medium">Doctor:</span>{" "}
        {doc.extractedData.doctorInfo.name}
        {doc.extractedData.doctorInfo.clinic &&
          ` - ${doc.extractedData.doctorInfo.clinic}`}
        {doc.extractedData.doctorInfo.phone &&
          ` (${doc.extractedData.doctorInfo.phone})`}
      </div>
    )}

    {/* ✅ Instead of patientVitals, display extracted values */}
    {doc.extractedData.values && Object.keys(doc.extractedData.values).length > 0 && (
      <div>
        <span className="font-medium">Extracted Values:</span>
        <div className="ml-4 text-xs space-y-1">
          {Object.entries(doc.extractedData.values).map(([key, value]) => (
            <div key={key}>
              {key}: {value as string}
            </div>
          ))}
        </div>
      </div>
    )}

    {doc.extractedData.prescriptions.length > 0 && (
      <div>
        <span className="font-medium">Prescriptions:</span>
        <ul className="mt-1 space-y-1 ml-4">
          {doc.extractedData.prescriptions.map((prescription, index) => (
            <li key={index} className="text-xs">
              <span className="font-medium">{prescription.medication}</span>
              {prescription.dosage && ` - ${prescription.dosage}`}
              {prescription.timings.length > 0 &&
                ` (${prescription.timings.join(", ")})`}
              {prescription.duration && ` for ${prescription.duration}`}
            </li>
          ))}
        </ul>
      </div>
    )}

    {doc.extractedData.notes && (
      <div>
        <span className="font-medium">Notes:</span>{" "}
        {doc.extractedData.notes}
      </div>
    )}
  </div>
)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
