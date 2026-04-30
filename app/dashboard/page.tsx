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

    // Require valid authentication
    if (isLoggedIn !== "true" || !sessionToken || !loginTime) {
      // Clear invalid session data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("sessionToken")
      localStorage.removeItem("loginTime")
      localStorage.removeItem("username")
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
      router.push("/login")
    }
  }, [router])

  return <Dashboard />
}
