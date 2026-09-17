"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updateUserPassword } = useAuth();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب أن تتكون من ٦ خانات على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsLoading(true);

    const { error } = await updateUserPassword(password);

    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
      return;
    }

    showToast({
      type: "success",
      title: "تم تحديث كلمة المرور",
      message: "تم حفظ كلمة مرورك الجديدة بنجاح، جاري تحويلك لمساحتك الشخصية...",
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          أدخل كلمة المرور الجديدة لتأمين حسابك والوصول إلى مساحتك في تولّى.
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
          type="password"
          label="كلمة المرور الجديدة"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          rightIcon={<Lock className="w-4 h-4" />}
          helperText="٦ خانات على الأقل."
        />

        <Input
          type="password"
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          rightIcon={<Lock className="w-4 h-4" />}
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isLoading}
          >
            تأكيد وتحديث كلمة المرور
          </Button>
        </div>
      </form>
    </div>
  );
}
