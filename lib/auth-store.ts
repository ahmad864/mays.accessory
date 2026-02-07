"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ضع هنا البريد الخاص بالأدمن
const ADMIN_EMAIL = "ahmadxxcc200@gmail.com";

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && data.user.email === ADMIN_EMAIL) {
        setUser({ email: data.user.email });
      }
    };
    getSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, message: error.message };

    if (data.user?.email !== ADMIN_EMAIL) {
      return { success: false, message: "هذا المستخدم ليس الأدمن" };
    }

    setUser({ email: data.user.email! });
    return { success: true, message: "تم تسجيل الدخول" };
  };

  const isAdmin = () => user?.email === ADMIN_EMAIL;

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout, isAdmin };
}
