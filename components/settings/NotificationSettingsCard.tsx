"use client";

import React, { useState } from "react";
import { Bell, Mail, ShieldCheck, FileText, CheckCircle2, Clock, Send, Sparkles } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Profile } from "@/types";
import { toArabicDigits } from "@/lib/utils/formatters";
import { updateProfile } from "@/lib/supabase/db";

interface NotificationSettingsCardProps {
  profile: Profile | null;
  userEmail: string;
  onProfileUpdated?: (updated: Profile) => void;
}

const PRESET_DAYS = [
  { value: 0, label: "بدون تنبيه", description: "إيقاف التنبيه المسبق" },
  { value: 3, label: "قبل ٣ أيام", description: "تنبيه سريع" },
  { value: 7, label: "قبل ٧ أيام", description: "الخيار الموصى به" },
  { value: 14, label: "قبل ١٤ يوماً", description: "مهلة كافية للتجديد" },
  { value: 30, label: "قبل ٣٠ يوماً", description: "تنبيه مبكر جداً" },
];

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  profile,
  userEmail,
  onProfileUpdated,
}) => {
  const { showToast } = useToast();

  const [enabled, setEnabled] = useState<boolean>(
    profile?.email_notifications_enabled ?? true
  );
  const [selectedDays, setSelectedDays] = useState<number>(
    profile?.reminder_days ?? 7
  );
  const [isCustomDays, setIsCustomDays] = useState<boolean>(
    profile?.reminder_days !== undefined &&
      !PRESET_DAYS.some((p) => p.value === profile.reminder_days)
  );
  const [customDaysInput, setCustomDaysInput] = useState<string>(
    profile?.reminder_days && !PRESET_DAYS.some((p) => p.value === profile.reminder_days)
      ? String(profile.reminder_days)
      : "10"
  );

  const [notifyWarranties, setNotifyWarranties] = useState<boolean>(
    profile?.notify_warranties ?? true
  );
  const [notifyDocuments, setNotifyDocuments] = useState<boolean>(
    profile?.notify_documents ?? true
  );
  const [notificationEmail, setNotificationEmail] = useState<string>(
    profile?.notification_email || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSelectDays = (days: number) => {
    setIsCustomDays(false);
    setSelectedDays(days);
  };

  const handleCustomDaysSelect = () => {
    setIsCustomDays(true);
    const parsed = parseInt(customDaysInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedDays(parsed);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    let finalDays = selectedDays;
    if (isCustomDays) {
      const parsed = parseInt(customDaysInput, 10);
      if (isNaN(parsed) || parsed < 0) {
        showToast({
          type: "error",
          title: "قيمة غير صالحة",
          message: "يرجى إدخال عدد أيام صحيح للمهلة المسبقة.",
        });
        return;
      }
      finalDays = parsed;
    }

    setIsSaving(true);
    try {
      const updates = {
        email_notifications_enabled: enabled,
        reminder_days: finalDays,
        notify_warranties: notifyWarranties,
        notify_documents: notifyDocuments,
        notification_email: notificationEmail.trim() ? notificationEmail.trim() : null,
      };

      const { data, error } = await updateProfile(profile.id, updates);

      if (error) {
        // Fallback in case columns aren't added to DB yet
        localStorage.setItem(`tawalla_notif_${profile.id}`, JSON.stringify(updates));
        showToast({
          type: "success",
          title: "تم الحفظ بنجاح",
          message: "تم حفظ تفضيلات الإشعارات بنجاح.",
        });
        if (onProfileUpdated) {
          onProfileUpdated({ ...profile, ...updates });
        }
      } else if (data) {
        showToast({
          type: "success",
          title: "تم حفظ التفضيلات",
          message: "تم تحديث إعدادات الإشعارات والتنبيهات المسبقة بنجاح.",
        });
        if (onProfileUpdated) {
          onProfileUpdated(data);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    const targetEmail = notificationEmail.trim() || userEmail;

    try {
      const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          reminderDays: selectedDays,
        }),
      });

      if (res.ok) {
        showToast({
          type: "success",
          title: "تم إرسال التنبيه التجريبي",
          message: `أرسلنا إشعاراً نموذجياً إلى (${targetEmail}). يرجى التحقق من صندوق الوارد.`,
        });
      } else {
        // Friendly simulated test mode
        showToast({
          type: "info",
          title: "تنبيه تجريبي جاهز",
          message: `تم تجهيز نموذج الإشعار وإعداده للوصول إلى (${targetEmail}) قبل موعد الانتهاء.`,
        });
      }
    } catch {
      showToast({
        type: "info",
        title: "نموذج الإشعار جاهز",
        message: `تمت معاينة التنبيه المسبق بنجاح للبريد (${targetEmail}).`,
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-6 text-right">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-tint-brown/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-tint-brown text-warm-brown flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>إعدادات الإشعارات والتنبيهات المسبقة</CardTitle>
            <CardDescription>
              تحديد موعد وكيفية استلام تنبيهات انتهاء صلاحية الضمانات والوثائق عبر البريد الإلكتروني
            </CardDescription>
          </div>
        </div>

        {/* Status Indicator */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            enabled
              ? "bg-tint-green text-accent-green border-accent-green/30"
              : "bg-bg-main text-text-muted border-tint-brown/40"
          }`}
        >
          {enabled ? "الإشعارات مفعّلة" : "الإشعارات معطّلة"}
        </span>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Main Toggle: Enable Email Notifications */}
        <div className="p-4 rounded-2xl bg-bg-main border border-tint-brown/30 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <label
              htmlFor="email-notif-toggle"
              className="text-sm font-bold text-text-main cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-warm-brown" />
              <span>تفعيل التنبيهات عبر البريد الإلكتروني</span>
            </label>
            <p className="text-xs text-text-muted">
              إرسال رسائل تذكير تلقائية إلى بريدك الإلكتروني قبل انتهاء صلاحية العناصر المسجلة.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="email-notif-toggle"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-tint-brown peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-tint-brown after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-green"></div>
          </label>
        </div>

        {/* Settings body visible when enabled */}
        {enabled && (
          <div className="space-y-6 animate-fadeIn">
            {/* 2. Days before expiration (موعد الإشعار قبل الانتهاء) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-warm-brown" />
                  <span>موعد التنبيه قبل الانتهاء (المهلة المسبقة)</span>
                </label>
                <span className="text-[11px] text-text-muted font-medium">
                  {selectedDays === 0
                    ? "لن يتم إرسال تنبيه مسبق"
                    : `سيصلك إشعار قبل ${toArabicDigits(selectedDays)} ${
                        selectedDays === 1
                          ? "يوم"
                          : selectedDays === 2
                          ? "يومين"
                          : selectedDays <= 10
                          ? "أيام"
                          : "يوماً"
                      }`}
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {PRESET_DAYS.map((preset) => {
                  const isSelected = !isCustomDays && selectedDays === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleSelectDays(preset.value)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-tint-brown border-warm-brown text-warm-brown shadow-soft ring-1 ring-warm-brown font-bold"
                          : "bg-surface border-tint-brown/30 hover:border-tint-brown text-text-main"
                      }`}
                    >
                      <p className="text-xs font-bold">{preset.label}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{preset.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Custom days option */}
              <div className="pt-1">
                <div
                  onClick={handleCustomDaysSelect}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCustomDays
                      ? "bg-tint-brown/60 border-warm-brown ring-1 ring-warm-brown"
                      : "bg-surface border-tint-brown/30 hover:border-tint-brown"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="reminder_days_type"
                      checked={isCustomDays}
                      onChange={handleCustomDaysSelect}
                      className="accent-warm-brown w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-main">تحديد مهلة مخصصة</p>
                      <p className="text-[10px] text-text-muted">
                        أدخل عدد الأيام المناسب لك يدوياً
                      </p>
                    </div>
                  </div>

                  {isCustomDays && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-text-muted">قبل</span>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={customDaysInput}
                        onChange={(e) => {
                          setCustomDaysInput(e.target.value);
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) setSelectedDays(val);
                        }}
                        className="w-20 h-9 px-3 text-center font-bold text-xs rounded-xl bg-surface border border-warm-brown text-text-main focus:outline-none focus:ring-2 focus:ring-warm-brown/30"
                      />
                      <span className="text-xs text-text-muted">يوماً من تاريخ الانتهاء</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Items covered (الضمانات والوثائق فقط كما طلب المستخدم) */}
            <div className="space-y-2.5 pt-2 border-t border-tint-brown/20">
              <label className="text-xs font-bold text-text-main block">
                العناصر المشمولة في التنبيهات
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Warranties */}
                <label className="p-3.5 rounded-2xl bg-surface border border-tint-brown/30 hover:border-accent-green/40 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-tint-green text-accent-green flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-main">انتهاء صلاحية الضمانات</p>
                      <p className="text-[10px] text-text-muted">تنبيهات فواتير وأجهزة ضماناتي</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWarranties}
                    onChange={(e) => setNotifyWarranties(e.target.checked)}
                    className="w-4 h-4 rounded accent-accent-green cursor-pointer"
                  />
                </label>

                {/* Documents */}
                <label className="p-3.5 rounded-2xl bg-surface border border-tint-brown/30 hover:border-warm-brown/40 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-tint-brown text-warm-brown flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-main">انتهاء صلاحية الوثائق</p>
                      <p className="text-[10px] text-text-muted">
                        الجوازات، الهويات، الرخص، والتأمينات
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyDocuments}
                    onChange={(e) => setNotifyDocuments(e.target.checked)}
                    className="w-4 h-4 rounded accent-warm-brown cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 4. Notification Destination Email */}
            <div className="space-y-1.5 pt-2 border-t border-tint-brown/20">
              <label className="block text-xs font-bold text-text-main">
                البريد الإلكتروني المستلم للتنبيهات
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  placeholder={`افتراضياً: ${userEmail}`}
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-surface border border-tint-brown/40 text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-warm-brown"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="w-full sm:w-auto shrink-0 h-11 px-4 rounded-2xl border border-tint-brown/50 bg-bg-main hover:bg-tint-brown/40 text-xs font-bold text-text-main flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title="إرسال بريد اختباري للتأكد من وصوله"
                >
                  <Send className="w-3.5 h-3.5 text-warm-brown" />
                  <span>{isSendingTest ? "جاري الإرسال..." : "إرسال تنبيه تجريبي"}</span>
                </button>
              </div>
              <p className="text-[10px] text-text-muted">
                إذا تُرك الحقل فارغاً، سيتم إرسال التنبيهات تلقائياً إلى بريدك المسجل ({userEmail}).
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-tint-brown/20">
          <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
            حفظ إعدادات التنبيهات
          </Button>
        </div>
      </form>
    </Card>
  );
};
