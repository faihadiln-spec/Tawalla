"use client";

import React from "react";
import { TawallaIcon } from "@/components/brand/TawallaLogo";
import { TrendingDown, ShieldCheck, FileText, Sparkles, Check, Clock } from "lucide-react";

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none py-6">
      {/* Ambient background soft glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-tint-brown/80 via-tint-blue/40 to-tint-green/40 blur-3xl opacity-60 pointer-events-none" />

      {/* Decorative orbital halo */}
      <div className="absolute w-[82%] h-[82%] rounded-full border border-tint-brown/30 pointer-events-none" />

      {/* Central Tawalla Organic Brand Pouch (مزاح إلى اليمين بوضوح حسب التوجيه) */}
      <div className="relative z-10 translate-x-12 sm:translate-x-16">
        <div className="p-6 rounded-full bg-surface/85 backdrop-blur-md border border-tint-brown/40 shadow-soft flex items-center justify-center transition-transform duration-500 hover:scale-105">
          <TawallaIcon size={95} />
        </div>
      </div>

      {/* Card 1: مصروفاتي (Top Right - مقربة للمركز بحركة ديناميكية) */}
      <div className="absolute top-10 right-3 sm:top-12 sm:right-6 z-20 w-60 sm:w-64 p-3.5 sm:p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-soft border border-primary-blue/25 rotate-[-2.5deg] hover:rotate-0 hover:scale-105 hover:-translate-y-1.5 hover:z-30 hover:shadow-float transition-all duration-300 ease-out cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tint-blue text-primary-blue flex items-center justify-center shadow-xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-main">اشتراك النادي</span>
          </div>
          <span className="text-[11px] font-bold text-primary-blue bg-tint-blue px-2.5 py-0.5 rounded-full">
            ٢٥٠ ر.س
          </span>
        </div>
        <div className="flex items-center justify-end text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span className="text-accent-green font-semibold">
            وفر سنوي: ٣٬٠٠٠ ر.س
          </span>
        </div>
      </div>

      {/* Card 2: وثائقي (Middle Left - متناسقة مع إزاحة الشعار دون تداخل) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-2 z-20 w-56 sm:w-60 p-3.5 sm:p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-soft border border-warm-brown/25 rotate-[-3deg] hover:rotate-0 hover:scale-105 hover:-translate-y-1.5 hover:z-30 hover:shadow-float transition-all duration-300 ease-out cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tint-brown text-warm-brown flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-main">جواز السفر السعودي</p>
              <p className="text-[10px] text-text-muted">منصة أبشر</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span className="text-accent-green font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> سارٍ حتى ٢٠٢٩
          </span>
        </div>
      </div>

      {/* Card 3: ضماناتي (Bottom Right - مقربة للمركز بمسافة متناسقة وحركة ديناميكية) */}
      <div className="absolute bottom-10 right-3 sm:bottom-12 sm:right-6 z-20 w-64 sm:w-68 p-3.5 sm:p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-soft border border-accent-green/25 rotate-[2.5deg] hover:rotate-0 hover:scale-105 hover:-translate-y-1.5 hover:z-30 hover:shadow-float transition-all duration-300 ease-out cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tint-green text-accent-green flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-main">شاشة LG OLED ٦٥ بوصة</p>
              <p className="text-[10px] text-text-muted">إكسترا (eXtra)</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            <span>ينتهي بعد ١٨ يوماً</span>
          </div>
        </div>
        <div className="flex items-center justify-start text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span className="flex items-center gap-1 text-accent-green font-medium">
            <Check className="w-3 h-3" /> الفاتورة محفوظة
          </span>
        </div>
      </div>
    </div>
  );
};
