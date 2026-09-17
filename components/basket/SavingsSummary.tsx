"use client";

import React from "react";
import { Sparkles, RotateCcw, Share2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatArabicNumber, formatExcludedSubscriptions } from "@/lib/utils/formatters";

interface SavingsSummaryProps {
  initialTotal: number;
  currentTotal: number;
  excludedCount: number;
  onResetAll?: () => void;
  onOpenShare?: () => void;
}

export const SavingsSummary: React.FC<SavingsSummaryProps> = ({
  initialTotal,
  currentTotal,
  excludedCount,
  onResetAll,
  onOpenShare,
}) => {
  const monthlySavings = Math.max(0, initialTotal - currentTotal);
  const annualSavings = monthlySavings * 12;

  return (
    <div className="w-full space-y-4">
      {/* Main Totals Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 sm:p-6 rounded-3xl bg-surface border border-tint-brown/30 shadow-soft items-center">
        {/* Current Basket Cost */}
        <div className="md:col-span-4 text-right space-y-1">
          <p className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-primary-blue" />
            التكلفة الشهرية الحالية
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-primary-blue">
            {formatArabicNumber(currentTotal)}{" "}
            <span className="text-xs font-normal text-text-muted">ر.س / شهر</span>
          </p>
          {initialTotal !== currentTotal && (
            <p className="text-[11px] text-text-muted">
              التكلفة الأساسية قبل الاستبعاد:{" "}
              <span className="line-through">{formatArabicNumber(initialTotal)} ر.س</span>
            </p>
          )}
        </div>

        {/* Live Savings (Monthly & Annual) */}
        <div className="md:col-span-5 text-right border-y md:border-y-0 md:border-r border-tint-brown/30 py-3 md:py-0 md:pr-6 space-y-1">
          {monthlySavings > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tint-green text-accent-green">
                  <Sparkles className="w-3 h-3" /> وفر محقق
                </span>
                <span className="text-xs text-text-muted font-medium">
                  ({formatExcludedSubscriptions(excludedCount)})
                </span>
              </div>
              <div className="flex items-baseline gap-4 pt-0.5">
                <div>
                  <p className="text-2xl font-bold text-accent-green">
                    +{formatArabicNumber(monthlySavings)}{" "}
                    <span className="text-xs font-normal text-text-muted">ر.س / شهرياً</span>
                  </p>
                </div>
                <div className="pr-4 border-r border-tint-brown/30">
                  <p className="text-sm font-bold text-accent-green">
                    +{formatArabicNumber(annualSavings)}{" "}
                    <span className="text-[10px] font-normal text-text-muted">ر.س / سنوياً</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-text-muted">
              <p className="text-xs font-medium">سلتك كاملة بدون مستبعدات</p>
              <p className="text-[11px]">
                اسحب أي بطاقة للخارج لتجربة استبعادها وملاحظة الوفر السنوي فوراً.
              </p>
            </div>
          )}
        </div>

        {/* Actions (Share & Reset) */}
        <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2.5 pt-2 md:pt-0">
          {monthlySavings > 0 && onOpenShare && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              className="shadow-xs"
            >
              شارك نتيجتك
            </Button>
          )}

          {monthlySavings > 0 && onResetAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetAll}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              title="إعادة تعيين السلة"
            >
              استعادة الكل
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
