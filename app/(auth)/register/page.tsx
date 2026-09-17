"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessConfirmation, setIsSuccessConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب أن لا تقل عن ٦ أحرف أو أرقام.");
      return;
    }

    setIsLoading(true);

    const { error, requiresEmailConfirmation } = await signUp(
      email,
      password,
      fullName
    );

    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }

    if (requiresEmailConfirmation) {
      setIsSuccessConfirmation(true);
      setIsLoading(false);
      return;
    }

    showToast({
      type: "success",
      title: "أهلاً بك في تولّى!",
      message: "تم إنشاء حسابك بنجاح، جاري نقلك لمركز القيادة الشخصي...",
    });

    router.push("/dashboard");
    router.refresh();
  };

  if (isSuccessConfirmation) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-tint-green text-accent-green flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-main">
            تفقد صندوق بريدك الإلكتروني
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm mx-auto">
            أرسلنا رابط تأكيد إلى <strong className="text-text-main">{email}</strong>. انقر على الرابط لتفعيل حسابك والبدء فوراً.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="outline" size="md" fullWidth>
              العودة لصفحة تسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          إنشاء حساب جديد
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          انضم لتولّى وابدأ في حفظ وتنظيم مصاريفك، ضماناتك، ووثائقك.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 text-xs text-red-600 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="الاسم الكامل"
          placeholder="مثال: عبدالعزيز السليمان"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          rightIcon={<User className="w-4 h-4" />}
        />

        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          rightIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          type="password"
          label="كلمة المرور"
          placeholder="٦ أحرف أو أرقام على الأقل"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          rightIcon={<Lock className="w-4 h-4" />}
          helperText="اختر كلمة مرور آمنة يسهل عليك تذكرها."
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isLoading}
            rightIcon={<UserPlus className="w-4 h-4" />}
          >
            إنشاء حساب تولّى
          </Button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-tint-brown/20 text-center text-xs text-text-muted">
        <span>لديك حساب بالفعل؟ </span>
        <Link
          href="/login"
          className="text-primary-blue font-bold hover:underline"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
