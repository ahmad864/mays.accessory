"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"
import { Input, Button, Label, Card, CardContent, CardHeader, CardTitle, CardDescription, Alert, AlertDescription } from "@/components/ui"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success"|"error">("success")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    const result = await login(email, password)
    setLoadingLogin(false)

    setMessage(result.message)
    setMessageType(result.success ? "success" : "error")

    if (result.success) {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {message && (
          <Alert className={`mb-6 ${messageType === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <AlertDescription className={messageType === "error" ? "text-red-800" : "text-green-800"}>{message}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>تسجيل دخول </CardTitle>
            <CardDescription>أدخل بريد الالكتروني وكلمة المرور </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loadingLogin} className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a]">
                {loadingLogin ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
