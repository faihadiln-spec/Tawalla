"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const { signIn } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }

    showToast({
      type: "success",
      title: "أهلاً بك مجدداً في تولّى",
      message: "تم تسجيل الدخول بنجاح، جاري تحويلك لمساحتك الشخصية...",
    });

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          تسجيل الدخول
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          أهلاً بك في مساحتك الشخصية. أدخل بياناتك للوصول إلى سلتك ووثائقك.
        </p>
      </div>

      {/* Error Notice if any */}
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

        <div className="space-y-1">
          <Input
            type="password"
            label="كلمة المرور"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            rightIcon={<Lock className="w-4 h-4" />}
          />
          <div className="flex justify-start pt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-primary-blue hover:underline font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isLoading}
            rightIcon={<LogIn className="w-4 h-4" />}
          >
            دخول إلى تولّى
          </Button>
        </div>
      </form>

      {/* Switch to Register */}
      <div className="pt-4 border-t border-tint-brown/20 text-center text-xs text-text-muted">
        <span>ليس لديك حساب بعد؟ </span>
        <Link
          href="/register"
          className="text-primary-blue font-bold hover:underline"
        >
          سجّل الآن في تولّى
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 flex items-center justify-center">
          <CalmSpinner size="md" label="جاري تجهيز صفحة الدخول..." />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
