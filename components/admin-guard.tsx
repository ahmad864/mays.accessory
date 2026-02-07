"use client"

import { useAuth } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) return <p className="p-6">جاري التحقق من صلاحية الدخول...</p>
  if (!user) return null

  return <>{children}</>
}
