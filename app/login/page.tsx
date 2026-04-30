"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const CORRECT_USERNAME = "usmanyasir32"
const CORRECT_PASSWORD = "ABR$786@"
const MAX_LOGIN_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [isAccountLocked, setIsAccountLocked] = useState(false)
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0)

  // Check if account is locked on mount
  useEffect(() => {
    const lockoutData = localStorage.getItem("loginLockout")
    if (lockoutData) {
      const lockoutTime = JSON.parse(lockoutData)
      const now = Date.now()
      const timeRemaining = lockoutTime - now

      if (timeRemaining > 0) {
        setIsAccountLocked(true)
        setLockoutTimeRemaining(Math.ceil(timeRemaining / 1000))
      } else {
        // Lockout expired, clear it
        localStorage.removeItem("loginLockout")
        localStorage.removeItem("loginAttempts")
      }
    }
  }, [])

  // Update lockout countdown
  useEffect(() => {
    if (!isAccountLocked) return

    const interval = setInterval(() => {
      setLockoutTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsAccountLocked(false)
          localStorage.removeItem("loginLockout")
          localStorage.removeItem("loginAttempts")
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isAccountLocked])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Check if account is locked
    if (isAccountLocked) {
      setError(`Too many failed attempts. Try again later. (${lockoutTimeRemaining}s remaining)`)
      setIsLoading(false)
      return
    }

    // Validate credentials
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      // Clear login attempt tracking on successful login
      localStorage.removeItem("loginAttempts")
      localStorage.removeItem("loginLockout")

      // Check if account is approved
      const signupData = localStorage.getItem("signupData")
      if (signupData) {
        const userData = JSON.parse(signupData)
        const signupTime = userData.signupTime
        const currentTime = Date.now()
        const hoursPassed = (currentTime - signupTime) / (1000 * 60 * 60)

        if (hoursPassed < 24) {
          setError("Your account is under review. Please wait for approval.")
          setIsLoading(false)
          return
        }
      }

      // Success - clear all old sessions and set new login
      localStorage.clear()
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
      localStorage.setItem("sessionToken", Math.random().toString(36).substring(2))
      localStorage.setItem("loginTime", Date.now().toString())

      setTimeout(() => {
        router.push("/publisher/dashboard")
      }, 500)
    } else {
      // Failed login attempt
      const currentAttempts = parseInt(localStorage.getItem("loginAttempts") || "0") + 1
      localStorage.setItem("loginAttempts", currentAttempts.toString())

      if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
        // Lock account for 15 minutes
        const lockoutTime = Date.now() + LOCKOUT_DURATION
        localStorage.setItem("loginLockout", lockoutTime.toString())
        setIsAccountLocked(true)
        setLockoutTimeRemaining(Math.ceil(LOCKOUT_DURATION / 1000))
        setError("Too many failed attempts. Try again later.")
      } else {
        setError("Invalid username or password")
      }

      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[560px]">
        <div className="text-center mb-12">
          <div className="inline-block">
            <img src="/exoclick-logo.jpg" alt="ExoClick" className="h-16 w-auto object-contain mx-auto" />
          </div>
        </div>

        <div className="w-full">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-[#0088cc] mb-1">Username</div>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#0088cc] focus:outline-none text-gray-700 placeholder:text-gray-400 transition-all"
                  style={{
                    placeholderOpacity: usernameFocused ? 0.2 : 1,
                  }}
                  disabled={isAccountLocked}
                  required
                />
                <div
                  className="absolute left-0 top-2 text-gray-400 pointer-events-none transition-opacity duration-150"
                  style={{
                    opacity: username || usernameFocused ? (usernameFocused ? 0.2 : 0) : 1,
                  }}
                >
                  Username
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-[#0088cc] mb-1">Password</div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full px-0 py-2 pr-10 bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#0088cc] focus:outline-none text-gray-700 placeholder:text-gray-400 transition-all"
                  disabled={isAccountLocked}
                  required
                />
                <div
                  className="absolute left-0 top-2 text-gray-400 pointer-events-none transition-opacity duration-150"
                  style={{
                    opacity: password || passwordFocused ? (passwordFocused ? 0.2 : 0) : 1,
                  }}
                >
                  Password
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isAccountLocked}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <span>⚠</span>
                {error}
              </div>
            )}

            <div className="flex justify-between text-sm">
              <Link href="/verify-email" className="text-[#0088cc] hover:underline">
                Verify your email
              </Link>
              <Link href="/forgot-password" className="text-[#0088cc] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isAccountLocked}
              className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-3 rounded text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm mb-4">Create an Advertiser or Publisher account:</p>
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full border-2 border-[#0088cc] text-[#0088cc] hover:bg-[#0088cc] hover:text-white font-bold py-3 rounded text-sm uppercase tracking-wide bg-transparent"
              >
                SIGN UP
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

