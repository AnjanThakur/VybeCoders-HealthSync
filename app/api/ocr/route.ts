import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string | null

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Forward file to Node OCR service (running on port 4000)
    const forwardForm = new FormData()
forwardForm.append("file", file)  // file can be pdf or image

    const ocrResponse = await fetch("http://localhost:4000/upload-report", {
      method: "POST",
      body: forwardForm,
    })

    if (!ocrResponse.ok) {
      throw new Error(`OCR service failed with status ${ocrResponse.status}`)
    }

    const { filename, ocr_text, extracted_entities } = await ocrResponse.json()

// Normalize undefined/null values
const prescriptionToSave = {
  userId: userId || null,
  type: "ocr_prescription",
  extractedData: extracted_entities ?? {},   // fallback to empty object
  rawText: ocr_text ?? "",                   // fallback to empty string
  fileName: filename ?? "",
  uploadedAt: serverTimestamp(),
  createdAt: new Date().toISOString(),
}

    const docRef = await addDoc(collection(db, "prescriptions"), prescriptionToSave)

    return NextResponse.json({
      success: true,
      id: docRef.id,
      prescription: prescriptionToSave,
    })
  } catch (error) {
    console.error("OCR integration error:", error)
    return NextResponse.json({ error: "Failed to process OCR" }, { status: 500 })
  }
}
