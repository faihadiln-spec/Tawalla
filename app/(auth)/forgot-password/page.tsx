"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const { error } = await resetPasswordForEmail(email);

    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-tint-green text-accent-green flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-main">
            تم إرسال رابط الاستعادة
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm mx-auto">
            أرسلنا تعليمات استعادة كلمة المرور إلى <strong className="text-text-main">{email}</strong>. يرجى مراجعة بريدك.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="primary" size="md" fullWidth>
              العودة لتسجيل الدخول
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
          استعادة كلمة المرور
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          أدخل بريدك الإلكتروني المسجل في «تولّى»، وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة.
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
          type="email"
          label="البريد الإلكتروني"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          rightIcon={<Mail className="w-4 h-4" />}
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isLoading}
          >
            إرسال رابط الاستعادة
          </Button>
        </div>
      </form>

      {/* Back to Login */}
      <div className="pt-4 border-t border-tint-brown/20 text-center text-xs text-text-muted">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>تذكرت كلمة المرور؟ تسجيل الدخول</span>
        </Link>
      </div>
    </div>
  );
}
