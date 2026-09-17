"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TawallaLogo } from "@/components/brand/TawallaLogo";
import { Expense, EXPENSE_CATEGORY_LABELS } from "@/types";
import { Sparkles, Copy, Check, TrendingDown, Share2 } from "lucide-react";
import { formatArabicNumber } from "@/lib/utils/formatters";

interface ShareableResultProps {
  isOpen: boolean;
  onClose: () => void;
  activeExpenses: Expense[];
  initialTotal: number;
  currentTotal: number;
}

export const ShareableResult: React.FC<ShareableResultProps> = ({
  isOpen,
  onClose,
  activeExpenses,
  initialTotal,
  currentTotal,
}) => {
  const [copied, setCopied] = useState(false);

  const monthlySavings = Math.max(0, initialTotal - currentTotal);
  const annualSavings = monthlySavings * 12;

  // Aggregate category totals for privacy (general categories only)
  const categoryTotals: Record<string, number> = {};
  activeExpenses.forEach((exp) => {
    const catLabel = EXPENSE_CATEGORY_LABELS[exp.category] || "أخرى";
    categoryTotals[catLabel] = (categoryTotals[catLabel] || 0) + exp.amount;
  });

  const handleCopyText = async () => {
    const shareText = `🎯 تجربتي مع سلة «تولّى»:
💰 تكلفة الاشتراكات الشهرية الحالية: ${formatArabicNumber(currentTotal)} ر.س
✨ الوفر المحقق بعد استبعاد ما لا أحتاجه: ${formatArabicNumber(monthlySavings)} ر.س شهرياً (${formatArabicNumber(annualSavings)} ر.س سنوياً)!
جرّب سلتك وتحكّم في مصروفاتك: ${typeof window !== "undefined" ? window.location.origin : "tawalla.app"}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="بطاقة مشاركة السلة ✨"
      description="بطاقة أنيقة ومبسطة تشارك فيها نتيجة تجربتك دون الكشف عن أي تفاصيل أو بيانات حساسة."
      maxWidth="md"
    >
      <div className="space-y-6 pt-2">
        {/* The Branded Social Card Preview */}
        <div
          id="tawalla-social-card"
          className="relative overflow-hidden rounded-3xl bg-bg-main border-2 border-tint-brown/60 p-6 sm:p-8 text-right space-y-6 shadow-soft"
          style={{ background: "linear-gradient(135deg, #FBFBF3 0%, #F2E9E4 100%)" }}
        >
          {/* Card Top Branding */}
          <div className="flex items-center justify-between border-b border-warm-brown/20 pb-4">
            <TawallaLogo size="sm" showText={true} />
            <span className="text-xs font-bold text-warm-brown bg-surface/80 px-3 py-1 rounded-full border border-warm-brown/20">
              وش في سلتك؟
            </span>
          </div>

          {/* Core Numbers */}
          <div className="space-y-1">
            <p className="text-xs text-text-muted font-medium">تكلفة نمط حياتي الشهرية</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-blue">
              {formatArabicNumber(currentTotal)}{" "}
              <span className="text-sm font-normal text-text-muted">ر.س / شهر</span>
            </p>
          </div>

          {/* Savings Callout */}
          {monthlySavings > 0 && (
            <div className="p-4 rounded-2xl bg-surface/90 border border-accent-green/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-green">
                <Sparkles className="w-4 h-4" />
                <span>وفر محتمل تم استبعاده:</span>
              </div>
              <div className="flex items-baseline justify-between text-text-main">
                <span className="text-sm font-bold text-accent-green">
                  +{formatArabicNumber(monthlySavings)} ر.س شهرياً
                </span>
                <span className="text-xs text-text-muted">
                  يعادل <strong className="text-text-main">+{formatArabicNumber(annualSavings)} ر.س</strong> سنوياً
                </span>
              </div>
            </div>
          )}

          {/* Privacy-Preserving Category Breakdown */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text-muted">توزيع السلة حسب التصنيف العام:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryTotals).map(([catName, sum]) => (
                <div
                  key={catName}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface/80 border border-tint-brown/30 text-xs"
                >
                  <span className="text-text-muted font-medium">{catName}</span>
                  <span className="font-bold text-text-main">{formatArabicNumber(sum)} ر.س</span>
                </div>
              ))}
            </div>
          </div>

          {/* Watermark Footer */}
          <div className="pt-2 text-center text-[10px] text-text-muted/80">
            تم التنظيم عبر مساحة «تولّى» الشخصية • tawalla.app
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-tint-brown/20">
          <Button variant="outline" size="sm" onClick={onClose}>
            إغلاق
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyText}
            leftIcon={copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? "تم نسخ نص المشاركة!" : "نسخ نص المشاركة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
