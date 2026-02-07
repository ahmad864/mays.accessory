"use client"

import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAIL = "ahmadxxcc200@gmail.com"

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true) // علامة جاري التحقق

  // عند تحميل الصفحة، جلب الجلسة الحالية
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user && data.user.email === ADMIN_EMAIL) {
        setUser({ email: data.user.email })
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    getSession()

    // استماع لتغيير حالة الجلسة
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setUser({ email: session.user.email })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false)
      return { success: false, message: error.message }
    }

    if (data.user?.email !== ADMIN_EMAIL) {
      setUser(null)
      setLoading(false)
      return { success: false, message: "هذا المستخدم ليس الأدمن" }
    }

    setUser({ email: data.user.email })
    setLoading(false)
    return { success: true, message: "تم تسجيل الدخول" }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAdmin = () => user?.email === ADMIN_EMAIL

  return { user, login, logout, isAdmin, loading }
}
