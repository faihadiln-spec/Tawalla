"use client";

import React from "react";
import { TawallaIcon } from "@/components/brand/TawallaLogo";
import { TrendingDown, ShieldCheck, FileText, Sparkles, Check, Clock } from "lucide-react";

export const HeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none py-6">
      {/* Ambient background soft glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-tint-brown/80 via-tint-blue/40 to-tint-green/40 blur-3xl opacity-60 pointer-events-none" />

      {/* Central Tawalla Organic Heart/Pouch */}
      <div className="relative z-10 p-6 rounded-full bg-surface/70 backdrop-blur-md border border-tint-brown/40 shadow-soft flex items-center justify-center transition-transform duration-500 hover:scale-105">
        <TawallaIcon size={110} />
      </div>

      {/* Floating Card 1: مصروفاتي (Top Right in RTL) */}
      <div className="absolute -top-2 -right-2 sm:top-2 sm:right-0 z-20 w-60 sm:w-64 p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-float border border-primary-blue/20 rotate-[-3deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-default">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tint-blue text-primary-blue flex items-center justify-center shadow-xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-text-main">اشتراك النادي</span>
          </div>
          <span className="text-[11px] font-bold text-primary-blue bg-tint-blue px-2 py-0.5 rounded-full">
            250 ر.س
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span>مسار مصروفاتي</span>
          <span className="text-accent-green font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            وفر سنوي: 3,000 ر.س
          </span>
        </div>
      </div>

      {/* Floating Card 2: ضماناتي (Bottom Right in RTL) */}
      <div className="absolute -bottom-4 -right-1 sm:bottom-4 sm:right-2 z-20 w-64 sm:w-72 p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-float border border-accent-green/25 rotate-[4deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-default">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-tint-green text-accent-green flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-main">شاشة LG OLED 65"</p>
              <p className="text-[10px] text-text-muted">إكسترا (eXtra)</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-ping" />
            <span>ينتهي بعد 18 يوماً</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span className="flex items-center gap-1 text-accent-green font-medium">
            <Check className="w-3 h-3" /> الفاتورة محفوظة
          </span>
          <span>مسار ضماناتي</span>
        </div>
      </div>

      {/* Floating Card 3: وثائقي (Left in RTL) */}
      <div className="absolute top-1/3 -left-4 sm:top-1/4 sm:-left-6 z-20 w-56 sm:w-64 p-4 rounded-3xl bg-surface/95 backdrop-blur-sm shadow-float border border-warm-brown/25 rotate-[-5deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-default">
        <div className="flex items-center justify-between mb-2.5">
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
        <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-tint-brown/20">
          <span className="text-accent-green font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> سارٍ حتى 2029
          </span>
          <span>مسار وثائقي</span>
        </div>
      </div>
    </div>
  );
};
