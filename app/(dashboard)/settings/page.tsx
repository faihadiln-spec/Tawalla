"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, updateProfile } from "@/lib/supabase/db";
import { Profile } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { User, Lock, ShieldCheck, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { NotificationSettingsCard } from "@/components/settings/NotificationSettingsCard";

export default function SettingsPage() {
  const { user, signOut, updateUserPassword } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const prof = await getProfile(user.id);
        if (prof) {
          setProfile(prof);
          setFullName(prof.full_name || "");
        } else {
          setFullName(user.user_metadata?.full_name || "");
        }
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      showToast({ type: "error", title: "خطأ", message: "يرجى إدخال الاسم كاملاً." });
      return;
    }

    setIsSavingProfile(true);
    try {
      const { data, error } = await updateProfile(user.id, { full_name: fullName.trim() });
      if (error || !data) {
        showToast({ type: "error", title: "تعذر التحديث", message: error || "حدث خطأ غير متوقع." });
      } else {
        setProfile(data);
        showToast({ type: "success", title: "تم الحفظ", message: "تم تحديث بيانات ملفك الشخصي بنجاح." });
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن لا تقل عن ٦ خانات.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await updateUserPassword(newPassword);
      if (error) {
        setPasswordError(error);
      } else {
        setNewPassword("");
        setConfirmPassword("");
        showToast({
          type: "success",
          title: "تم تغيير كلمة المرور",
          message: "تم تحديث كلمة مرور حسابك بأمان.",
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="py-24 flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري تحميل إعدادات الحساب..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-right">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
          <User className="w-6 h-6 text-primary-blue" />
          <span>إعدادات الحساب والملف الشخصي</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          إدارة بياناتك الشخصية، كلمة المرور، وحالة الأمان لحسابك في منصة «تولّى».
        </p>
      </div>

      {/* 1. Profile Information Card */}
      <Card variant="elevated" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-tint-brown/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-tint-blue text-primary-blue flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>البيانات الشخصية</CardTitle>
              <CardDescription>الاسم الظاهر والبريد الإلكتروني المرتبط</CardDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-main">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full h-11 px-3.5 rounded-2xl bg-bg-main border border-tint-brown text-xs text-text-muted cursor-not-allowed"
            />
            <p className="text-[10px] text-text-muted">
              لتغيير البريد الإلكتروني، يرجى التواصل مع فريق الدعم.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={isSavingProfile}>
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Notification & Alert Settings Card */}
      <NotificationSettingsCard
        profile={profile}
        userEmail={user?.email || ""}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* 3. Security & Password Card */}
      <Card variant="elevated" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-tint-brown/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-tint-green text-accent-green flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>كلمة المرور والأمان</CardTitle>
              <CardDescription>تحديث كلمة المرور لحماية حسابك</CardDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordError && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-warm-brown/10 border border-warm-brown/20 text-xs text-warm-brown font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isUpdatingPassword}
              disabled={!newPassword || !confirmPassword}
            >
              تحديث كلمة المرور
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Account Status & Sign Out */}
      <div className="p-5 rounded-2xl bg-tint-brown/30 border border-warm-brown/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-warm-brown text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-text-main">جلسة آمنة ومشفرة</p>
            <p className="text-[11px] text-text-muted">
              حسابك محمي بسياسات الأمان على مستوى الصفوف (RLS) وتشفير Supabase.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-warm-brown" />}
          className="text-xs shrink-0"
        >
          تسجيل الخروج من الحساب
        </Button>
      </div>
    </div>
  );
}
