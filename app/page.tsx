"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Validate authenticated session before redirecting
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const sessionToken = localStorage.getItem("sessionToken")
    const sessionVersion = localStorage.getItem("sessionVersion")
    const globalSessionVersion = localStorage.getItem("globalSessionVersion")

    // Check if session has been invalidated globally (e.g., password changed)
    if (sessionVersion && globalSessionVersion && parseInt(sessionVersion) !== parseInt(globalSessionVersion)) {
      console.log("[v0] Session invalidated - forcing re-login")
      // Force logout - clear all session data
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })
      
      router.push("/login")
      return
    }

    if (isLoggedIn === "true" && sessionToken) {
      router.push("/publisher/dashboard")
    } else {
      // Clear any invalid session data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("sessionToken")
      localStorage.removeItem("loginTime")
      localStorage.removeItem("username")
      localStorage.removeItem("sessionVersion")
      sessionStorage.clear()
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#1e2a38] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}
