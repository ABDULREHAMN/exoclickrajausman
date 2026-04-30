"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Validate authenticated session
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const sessionToken = localStorage.getItem("sessionToken")
    const sessionVersion = localStorage.getItem("sessionVersion")
    const globalSessionVersion = localStorage.getItem("globalSessionVersion")

    // Check if session has been invalidated globally (e.g., password changed)
    if (sessionVersion && globalSessionVersion && parseInt(sessionVersion) !== parseInt(globalSessionVersion)) {
      console.log("[v0] Session invalidated due to password change or security update")
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

    if (isLoggedIn !== "true") {
      localStorage.clear()
      sessionStorage.clear()
      router.push("/login")
    }
  }, [router])

  return <DashboardContent />
}
