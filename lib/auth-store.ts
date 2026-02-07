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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // جلب الجلسة مباشرة من Supabase
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email === ADMIN_EMAIL) {
        setUser({ email: ADMIN_EMAIL });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    init();

    // استماع لتغير حالة الجلسة
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setUser({ email: ADMIN_EMAIL });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }

    if (data.user?.email !== ADMIN_EMAIL) {
      setLoading(false);
      return { success: false, message: "هذا المستخدم ليس الأدمن" };
    }

    setUser({ email: ADMIN_EMAIL });
    setLoading(false);
    return { success: true, message: "تم تسجيل الدخول" };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = () => user?.email === ADMIN_EMAIL;

  return { user, login, logout, isAdmin, loading };
}
