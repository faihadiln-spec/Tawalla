"use client";

import React from "react";
import Link from "next/link";
import { TrendingDown, ShieldCheck, FileText, ArrowLeft, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
  activeExpensesCount,
  warrantiesCount,
  expiringWarrantiesCount,
  documentsCount,
  expiringDocumentsCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-right">
      {/* 1. Portal: مصروفاتي */}
      <Link
        href="/expenses"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-primary-blue/40 transition-all duration-300 flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-tint-blue text-primary-blue flex items-center justify-center transition-transform group-hover:scale-105">
              <TrendingDown className="w-6 h-6" />
            </div>
            <Badge variant="blue" size="sm">
              السلة التفاعلية
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-text-main group-hover:text-primary-blue transition-colors">
              مصروفاتي
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              سلتك الشخصية لإدارة الاشتراكات والتكاليف الشهرية وحساب الوفر اللحظي.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-text-muted font-medium">إجمالي التكلفة الشهرية</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary-blue">
              {monthlyExpensesTotal.toLocaleString()}{" "}
              <span className="text-xs font-normal text-text-muted">ر.س / شهر</span>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {activeExpensesCount} اشتراكات نشطة في السلة
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-tint-brown/20 flex items-center justify-between text-xs font-bold text-primary-blue">
          <span>ادخل مصروفاتك</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </Link>

      {/* 2. Portal: ضماناتي */}
      <Link
        href="/warranties"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-accent-green/40 transition-all duration-300 flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-tint-green text-accent-green flex items-center justify-center transition-transform group-hover:scale-105">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <Badge variant="green" size="sm">
              فواتير وضمانات
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-text-main group-hover:text-accent-green transition-colors">
              ضماناتي
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              أرشفة فواتير الأجهزة وتتبع تواريخ انتهاء الضمان والتنبيهات المسبقة.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-text-muted font-medium">الضمانات المسجلة</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-green">
              {warrantiesCount}{" "}
              <span className="text-xs font-normal text-text-muted">ضمان محفوظ</span>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {expiringWarrantiesCount > 0 ? (
                <span className="text-warm-brown font-semibold">
                  {expiringWarrantiesCount} ضمانات تنتهي قريباً
                </span>
              ) : (
                "كافة الضمانات سارية ومستقرة"
              )}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-tint-brown/20 flex items-center justify-between text-xs font-bold text-accent-green">
          <span>استعرض ضماناتك</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </Link>

      {/* 3. Portal: وثائقي */}
      <Link
        href="/documents"
        className="group relative rounded-3xl bg-surface border border-tint-brown/40 p-6 sm:p-7 shadow-soft hover:shadow-float hover:border-warm-brown/50 transition-all duration-300 flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-tint-brown text-warm-brown flex items-center justify-center transition-transform group-hover:scale-105">
              <FileText className="w-6 h-6" />
            </div>
            <Badge variant="brown" size="sm">
              أرشيف مشفر
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-text-main group-hover:text-warm-brown transition-colors">
              وثائقي
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              حفظ الهويات والجوازات والرخص والتأمينات في مساحة خاصة وآمنة.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-text-muted font-medium">الوثائق المؤرشفة</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-warm-brown">
              {documentsCount}{" "}
              <span className="text-xs font-normal text-text-muted">وثيقة محفوظة</span>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {expiringDocumentsCount > 0 ? (
                <span className="text-warm-brown font-semibold">
                  {expiringDocumentsCount} وثائق تحتاج تجديداً قريباً
                </span>
              ) : (
                "كافة وثائقك سارية ومحدثة"
              )}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-tint-brown/20 flex items-center justify-between text-xs font-bold text-warm-brown">
          <span>عرض وثائقك</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </Link>
    </div>
  );
};
