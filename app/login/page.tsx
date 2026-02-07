"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBtn(true);

    const result = await login(email, password);
    setLoadingBtn(false);

    if (result.success) {
      showMessage(result.message, "success");
      router.push("/admin"); // أي تسجيل دخول ناجح للأدمن يفتح لوحة تحكم مباشرة
    } else {
      showMessage(result.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {message && (
          <Alert className={`mb-6 ${messageType === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={messageType === "error" ? "text-red-800" : "text-green-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>تسجيل دخول الأدمن</CardTitle>
            <CardDescription>أدخل بريد الأدمن وكلمة المرور للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="أدخل بريد الأدمن" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loadingBtn} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="أدخل كلمة المرور" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loadingBtn} />
                  <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#7f5c7e] hover:bg-[#6b4c6a]" disabled={loadingBtn}>
                {loadingBtn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
