"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Validate authenticated session before redirecting
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const sessionToken = localStorage.getItem("sessionToken")

    if (isLoggedIn === "true" && sessionToken) {
      router.push("/publisher/dashboard")
    } else {
      // Clear any invalid session data
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("sessionToken")
      localStorage.removeItem("loginTime")
      localStorage.removeItem("username")
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#1e2a38] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}
