"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // نتحقق بعد تحميل الـ hook
    if (!user) return;

    if (!isAdmin()) {
      router.push("/login"); // إعادة توجيه أي شخص ليس أدمن
    } else {
      setLoading(false); // تم التحقق والأدمن موجود
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جارٍ التحقق من الحساب...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم الأدمن</h1>
      <p>مرحبًا {user?.email}</p>
    </div>
  );
}
