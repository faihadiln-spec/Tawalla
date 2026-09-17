import React from "react";
import Link from "next/link";
import { TrendingDown, ShieldCheck, FileText } from "lucide-react";
import {
  formatArabicNumber,
  formatWarrantiesCount,
  formatDocumentsCount,
} from "@/lib/utils/formatters";

interface PortalCardsProps {
  monthlyExpensesTotal: number;
  activeExpensesCount: number;
  warrantiesCount: number;
  expiringWarrantiesCount: number;
  documentsCount: number;
  expiringDocumentsCount: number;
}

export const PortalCards: React.FC<PortalCardsProps> = ({
  monthlyExpensesTotal,
  warrantiesCount,
  documentsCount,
}) => {
  const warInfo = formatWarrantiesCount(warrantiesCount);
  const docInfo = formatDocumentsCount(documentsCount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-right">
      {/* 1. Portal: مصروفاتي */}
      <Link
        href="/expenses"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-primary-blue/40 transition-all duration-300 flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tint-blue text-primary-blue flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <TrendingDown className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl font-bold text-text-main group-hover:text-primary-blue transition-colors">
              مصروفاتي
            </h3>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            سلتك الشخصية لإدارة الاشتراكات والتكاليف الشهرية وحساب الوفر اللحظي.
          </p>

          <div className="pt-1">
            <p className="text-[11px] text-text-muted font-medium">إجمالي التكلفة الشهرية</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary-blue">
              {formatArabicNumber(monthlyExpensesTotal)}{" "}
              <span className="text-xs font-normal text-text-muted">ر.س / شهر</span>
            </p>
          </div>
        </div>
      </Link>

      {/* 2. Portal: ضماناتي */}
      <Link
        href="/warranties"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-accent-green/40 transition-all duration-300 flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tint-green text-accent-green flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl font-bold text-text-main group-hover:text-accent-green transition-colors">
              ضماناتي
            </h3>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            أرشفة فواتير الأجهزة وتتبع تواريخ انتهاء الضمان والتنبيهات المسبقة.
          </p>

          <div className="pt-1">
            <p className="text-[11px] text-text-muted font-medium">الضمانات المسجلة</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-green">
              {warInfo.main}{" "}
              {warInfo.suffix && (
                <span className="text-xs font-normal text-text-muted">{warInfo.suffix}</span>
              )}
            </p>
          </div>
        </div>
      </Link>

      {/* 3. Portal: وثائقي */}
      <Link
        href="/documents"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-warm-brown/50 transition-all duration-300 flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tint-brown text-warm-brown flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xl font-bold text-text-main group-hover:text-warm-brown transition-colors">
              وثائقي
            </h3>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            حفظ الهويات والجوازات والرخص والتأمينات في مساحة خاصة وآمنة.
          </p>

          <div className="pt-1">
            <p className="text-[11px] text-text-muted font-medium">الوثائق المؤرشفة</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-warm-brown">
              {docInfo.main}{" "}
              {docInfo.suffix && (
                <span className="text-xs font-normal text-text-muted">{docInfo.suffix}</span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
