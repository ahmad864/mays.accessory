"use client";

import { createClient, Session, User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = "ahmadxxcc200@gmail.com";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user || null;

      if (sessionUser && sessionUser.email === ADMIN_EMAIL) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setUser(session.user);
      } else {
        setUser(null);
      }
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

    setUser(data.user);
    setLoading(false);
    return { success: true, message: "تم تسجيل الدخول", user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = () => user?.email === ADMIN_EMAIL;

  return { user, login, logout, isAdmin, loading };
}
