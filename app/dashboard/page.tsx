"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Validate authenticated session
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const sessionToken = localStorage.getItem("sessionToken")
    const loginTime = localStorage.getItem("loginTime")
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

    // Require valid authentication
    if (isLoggedIn !== "true" || !sessionToken || !loginTime) {
      // Clear invalid session data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("sessionToken")
      localStorage.removeItem("loginTime")
      localStorage.removeItem("username")
      localStorage.removeItem("sessionVersion")
      sessionStorage.clear()
      router.push("/login")
      return
    }

    // Optional: Add session timeout (e.g., 24 hours)
    const loginTimeMs = parseInt(loginTime)
    const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
    const now = Date.now()

    if (now - loginTimeMs > sessionDuration) {
      // Session expired
      localStorage.clear()
      sessionStorage.clear()
      router.push("/login")
    }
  }, [router])

  return <Dashboard />
}
