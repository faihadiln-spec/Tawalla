"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { TawallaIcon } from "@/components/brand/TawallaLogo";
import { ArrowLeft, Sparkles, Check } from "lucide-react";

export const CtaSection: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
  return (
    <section className="py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-tint-brown/40 shadow-float p-8 sm:p-14 text-center space-y-8">
        {/* Soft decorative background glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-tint-blue/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-tint-green/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-tint-brown/60 border border-warm-brown/30 flex items-center justify-center shadow-xs">
            <TawallaIcon size={44} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-main leading-tight">
            تولّى أمورك اليوم... قبل أن تتراكم
          </h2>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            انضم إلى مساحة شخصية مهدئة تضع مصاريفك، ضماناتك، ووثائقك في متناول يدك بكل طمأنينة ووضوح.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            variant="primary"
            onClick={onStart}
            rightIcon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto px-8"
          >
            ابدأ مع تولّى الآن
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const el = document.getElementById("expenses");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-6"
          >
            استكشف السلة التفاعلية
          </Button>
        </div>

        {/* Reassurance Checklist */}
        <div className="relative z-10 pt-6 border-t border-tint-brown/20 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-accent-green" /> إعداد خلال دقيقة واحدة
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-accent-green" /> بدون أي ربط مصرفي مقلق
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-accent-green" /> خصوصية مشفرة بالكامل
          </span>
        </div>
      </div>
    </section>
  );
};
