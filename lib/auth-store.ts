"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  // التحقق من الجلسة الحالية عند تحميل الصفحة
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser({ email: data.user.email! });
    };
    getSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, message: error.message };
    if (!data.user) return { success: false, message: "فشل تسجيل الدخول" };

    setUser({ email: data.user.email! });
    return { success: true, message: "تم تسجيل الدخول" };
  };

  const isAdmin = () => !!user; // أي مستخدم مسجّل الدخول يعتبر أدمن هنا

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout, isAdmin };
}
