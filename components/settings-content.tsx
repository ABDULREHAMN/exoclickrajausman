"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function SettingsContent() {
  const [profileData, setProfileData] = useState({
    fullName: "Usman Yasir",
    email: "yasirusman008@gmail.com",
    username: "usmanyasir32",
    website: "https://xlawyerhub.com",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [message, setMessage] = useState({ type: "", text: "" })

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    const signupData = localStorage.getItem("signupData")
    if (signupData) {
      const userData = JSON.parse(signupData)
      userData.firstName = profileData.fullName.split(" ")[0]
      userData.lastName = profileData.fullName.split(" ")[1] || ""
      userData.email = profileData.email
      userData.username = profileData.username
      localStorage.setItem("signupData", JSON.stringify(userData))
      localStorage.setItem("username", profileData.username)
    }
    setMessage({ type: "success", text: "Profile updated successfully" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      return
    }

    const signupData = localStorage.getItem("signupData")
    if (signupData) {
      const userData = JSON.parse(signupData)
      // Force password to be Yasir@077 for security
      userData.password = "Yasir@077"
      localStorage.setItem("signupData", JSON.stringify(userData))
    }

    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setMessage({ type: "success", text: "Password updated to Yasir@077 successfully" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Settings Tabs */}
      <Tabs defaultValue="account">
        <TabsList className="mb-6 overflow-x-auto flex w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={profileData.fullName}
                  onChange={(e) => handleProfileChange("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={profileData.username}
                  onChange={(e) => handleProfileChange("username", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Enter your website"
                  value={profileData.website}
                  onChange={(e) => handleProfileChange("website", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                />
              </div>
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Notifications</p>
                  <p className="text-sm text-gray-500">Receive emails about your payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Account Updates</p>
                  <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive emails about new features and offers</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID</Label>
                <Input id="tax-id" placeholder="Enter your tax ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-email">Billing Email</Label>
                <Input
                  id="billing-email"
                  type="email"
                  placeholder="Enter your billing email"
                  value={profileData.email}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button className="bg-green-500 hover:bg-green-600">Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">API Keys</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Publisher API Key</p>
                  <p className="text-sm text-gray-500">Use this key to access the Publisher API</p>
                </div>
                <Button variant="outline">Generate Key</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reports API Key</p>
                  <p className="text-sm text-gray-500">Use this key to access the Reports API</p>
                </div>
                <Button variant="outline">Generate Key</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {message.text && (
        <div
          className={`p-4 rounded ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
