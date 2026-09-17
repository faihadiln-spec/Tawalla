"use client";

import React from "react";
import Link from "next/link";
import { AttentionItem } from "@/types";
import { AlertCircle, Clock, ArrowLeft, ShieldAlert, FileWarning, CheckCircle2 } from "lucide-react";

interface AttentionSystemProps {
  items: AttentionItem[];
}

export const AttentionSystem: React.FC<AttentionSystemProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-tint-green/60 border border-accent-green/25 text-right">
        <div className="w-9 h-9 rounded-xl bg-accent-green text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-text-main">
            كل شيء هادئ ومنتظم في مساحتك ✨
          </p>
          <p className="text-[11px] text-text-muted">
            لا توجد ضمانات أو وثائق تتطلب انتباهك أو تجديداً خلال الـ 30 يوماً القادمة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-text-main flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warm-brown" />
          <span>يحتاج انتباهك قريباً ({items.length})</span>
        </span>
        <span className="text-[11px] text-text-muted">تنبيهات استباقية هادئة</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isExpired = item.severity === "expired";
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 hover:shadow-soft text-right ${
                isExpired
                  ? "bg-tint-brown/40 border-warm-brown/30 hover:border-warm-brown/60"
                  : "bg-surface border-tint-brown/40 hover:border-primary-blue/40"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isExpired
                      ? "bg-warm-brown text-white"
                      : "bg-tint-brown text-warm-brown"
                  }`}
                >
                  {item.type === "warranty_expiring" ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <FileWarning className="w-4 h-4" />
                  )}
                </div>

                <div className="truncate">
                  <p className="text-xs sm:text-sm font-bold text-text-main group-hover:text-primary-blue transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5 font-medium">
                    <Clock className="w-3 h-3 text-warm-brown" />
                    <span>{item.subtitle}</span>
                  </p>
                </div>
              </div>

              <div className="text-text-muted group-hover:text-primary-blue pr-2 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
