// "use client"

// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Heart, Shield, Users, Zap } from "lucide-react"

// export default function HomePage() {
//   const { user, userProfile, signInWithGoogle, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (user && userProfile?.role) {
//     // Redirect to appropriate dashboard
//     window.location.href = userProfile.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
//     return null
//   }

//   if (user && !userProfile?.role) {
//     // Redirect to role selection
//     window.location.href = "/auth/role-selection"
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted">
//       {/* Header */}
//       <header className="border-b bg-card/50 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Heart className="h-8 w-8 text-primary" />
//             <h1 className="text-2xl font-bold text-foreground">HealthSync</h1>
//           </div>
//           <Button onClick={signInWithGoogle} size="lg">
//             Sign In with Google
//           </Button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-20 text-center">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
//             Unified Healthcare Records for Everyone
//           </h2>
//           <p className="text-xl text-muted-foreground mb-8 text-pretty">
//             AI-powered healthcare data management system that connects doctors, patients, and government health records
//             in one secure platform.
//           </p>
//           <Button onClick={signInWithGoogle} size="lg" className="text-lg px-8 py-3">
//             Get Started Today
//           </Button>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="container mx-auto px-4 py-16">
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card className="text-center">
//             <CardHeader>
//               <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
//               <CardTitle>Voice Prescriptions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Doctors dictate prescriptions, AI transcribes and generates digital records instantly.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
//               <CardTitle>OCR Digitization</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Upload old prescriptions and medical records - our AI digitizes and stores them securely.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <Users className="h-12 w-12 text-primary mx-auto mb-4" />
//               <CardTitle>ABDM Integration</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Seamlessly connect with government health records through ABDM integration.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
//               <CardTitle>Unified Records</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 All your health data from hospitals, labs, and uploads in one secure location.
//               </CardDescription>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
//         <div className="container mx-auto px-4 py-8 text-center">
//           <p className="text-muted-foreground">© 2024 HealthSync. Secure, AI-powered healthcare data management.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }


"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, Zap, ArrowRight, Sparkles, Activity } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { user, userProfile, signInWithGoogle, loading } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 bg-clip-border"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-full"></div>
          <Heart className="absolute inset-0 m-auto h-8 w-8 text-emerald-500 animate-pulse" />
        </div>
      </div>
    )
  }

  if (user && userProfile?.role) {
    window.location.href = userProfile.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
    return null
  }

  if (user && !userProfile?.role) {
    window.location.href = "/auth/role-selection"
    return null
  }

  const features = [
    {
      icon: Zap,
      title: "Voice Prescriptions",
      description: "Doctors dictate prescriptions, AI transcribes and generates digital records instantly.",
      gradient: "from-blue-500 to-sky-600",
      hoverGradient: "from-blue-400 to-sky-500",
      delay: "0ms",
    },
    {
      icon: Shield,
      title: "OCR Digitization",
      description: "Upload old prescriptions and medical records - our AI digitizes and stores them securely.",
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-400 to-teal-500",
      delay: "150ms",
    },
    {
      icon: Users,
      title: "ABDM Integration",
      description: "Seamlessly connect with government health records through ABDM integration.",
      gradient: "from-sky-500 to-cyan-600",
      hoverGradient: "from-sky-400 to-cyan-500",
      delay: "300ms",
    },
    {
      icon: Heart,
      title: "Unified Records",
      description: "All your health data from hospitals, labs, and uploads in one secure location.",
      gradient: "from-teal-500 to-emerald-600",
      hoverGradient: "from-teal-400 to-emerald-500",
      delay: "450ms",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-200/40 via-sky-200/30 to-teal-200/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            right: "10%",
            bottom: "30%",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-br from-sky-200/30 via-blue-200/20 to-emerald-200/15 rounded-full blur-3xl animate-pulse delay-500"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            left: "60%",
            top: "60%",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-bounce opacity-60"
            style={{
              background: `linear-gradient(45deg, ${["#3b82f6", "#10b981", "#14b8a6", "#0ea5e9"][i % 4]}, ${
                ["#60a5fa", "#34d399", "#2dd4bf", "#38bdf8"][i % 4]
              })`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className={`relative z-10 border-b border-blue-100 bg-white/95 backdrop-blur-xl transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-emerald-500 group-hover:scale-110 transition-all duration-300 filter drop-shadow-md" />
              <div className="absolute inset-0 h-8 w-8 bg-gradient-to-br from-emerald-400/30 to-teal-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              HealthSync
            </h1>
          </div>
          <Button
            onClick={signInWithGoogle}
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 hover:from-blue-500 hover:via-teal-400 hover:to-emerald-400 border-0 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300 group overflow-hidden text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="w-4 h-4 mr-2" />
            Sign In with Google
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="relative mb-6">
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6 leading-tight">
              Unified Healthcare
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 bg-clip-text text-transparent animate-gradient">
                Records for Everyone
              </span>
            </h2>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <p
            className={`text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            AI-powered healthcare data management system that connects doctors, patients, and government health records
            in one{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-semibold">
              secure platform
            </span>
            .
          </p>

          <div
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 hover:from-blue-500 hover:via-teal-400 hover:to-emerald-400 border-0 shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/30 transform hover:scale-110 transition-all duration-500 group relative overflow-hidden text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Activity className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className={`text-center bg-white/95 border-white/60 backdrop-blur-xl hover:bg-white hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 group cursor-pointer relative overflow-hidden ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{
                  animationDelay: feature.delay,
                  transitionDelay: `${800 + index * 150}ms`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.hoverGradient} opacity-0 group-hover:opacity-8 transition-all duration-500 rounded-lg`}
                />

                <CardHeader className="relative z-10">
                  <div
                    className={`relative mx-auto mb-4 w-fit p-4 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}
                  >
                    <Icon className="h-12 w-12 mx-auto text-white filter drop-shadow-lg" />
                  </div>
                  <CardTitle className="text-slate-800 text-lg font-semibold group-hover:text-slate-700 transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-emerald-500/20 blur-sm rounded-lg animate-pulse" />
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t border-blue-100 bg-white/95 backdrop-blur-xl mt-20 transition-all duration-1000 delay-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:bg-clip-text hover:text-transparent transition-all duration-300">
            © 2024 HealthSync. Secure, AI-powered healthcare data management.
          </p>
        </div>
      </footer>
    </div>
  )
}
