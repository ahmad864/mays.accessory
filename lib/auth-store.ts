"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = "ahmadxxcc200@gmail.com";

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // تحقق من الجلسة عند تحميل الصفحة
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && data.user.email === ADMIN_EMAIL) {
        setUser({ email: data.user.email });
      }
    };
    getSession();

    // استماع لتغيير حالة الجلسة
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setUser({ email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, message: error.message };

    if (data.user?.email !== ADMIN_EMAIL) {
      return { success: false, message: "هذا المستخدم ليس الأدمن" };
    }

    setUser({ email: data.user.email });
    return { success: true, message: "تم تسجيل الدخول", user: data.user };
  };

  const isAdmin = () => user?.email === ADMIN_EMAIL;

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout, isAdmin };
}
