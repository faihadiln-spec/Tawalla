import React from "react";
import Link from "next/link";
import { TawallaLogo } from "@/components/brand/TawallaLogo";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 sm:pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للرئيسية</span>
        </Link>
        <Link href="/">
          <TawallaLogo size="sm" showText={true} />
        </Link>
      </div>

      {/* Main Form Center */}
      <div className="w-full max-w-md mx-auto py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-float border border-tint-brown/30 space-y-6">
          {children}
        </div>
      </div>

      {/* Bottom Subtle Footer */}
      <div className="text-center text-xs text-text-muted/70 pb-4">
        <span>تولّى © {new Date().getFullYear()} — مساحتك الشخصية لما يهمك</span>
      </div>
    </div>
  );
}
