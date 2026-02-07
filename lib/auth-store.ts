"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = "ahmadxxcc200@gmail.com"; // ضع بريد الأدمن هنا

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, message: error.message };

    if (data.user?.email !== ADMIN_EMAIL) {
      return { success: false, message: "هذا المستخدم ليس أدمن" };
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
