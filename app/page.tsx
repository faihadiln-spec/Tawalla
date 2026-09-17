"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/ui/Navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ConceptSection } from "@/components/landing/ConceptSection";
import { InteractiveBasketPreview } from "@/components/landing/InteractiveBasketPreview";
import { WarrantiesPreview } from "@/components/landing/WarrantiesPreview";
import { DocumentsPreview } from "@/components/landing/DocumentsPreview";
import { Footer } from "@/components/landing/Footer";
import { ArrowLeft, Sparkles, Shield, Check, Heart } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentNav, setCurrentNav] = useState("home");

  const handleStartClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };


  const handleNavClick = (id: string) => {
    setCurrentNav(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col font-arabic selection:bg-tint-blue selection:text-primary-blue">
      {/* 1. Global Navigation Bar */}
      <Navigation
        currentPath={currentNav}
        onNavigate={handleNavClick}
        ctaText={user ? "دخول لمساحتي" : "تسجيل دخول"}
        onCtaClick={() => (user ? router.push("/dashboard") : router.push("/login"))}
      />

      {/* Main Storytelling Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 1. THE HERO SECTION */}
        <section className="pt-8 sm:pt-14 pb-4 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Right Column (in RTL): Core Confident Messaging */}
            <div className="lg:col-span-6 space-y-6 text-right">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-main leading-[1.15]">
                  تولّى مصاريفك ضماناتك ووثائقك
                </h1>
                <p className="text-base sm:text-xl text-text-muted leading-relaxed font-normal">
                  كل ما يخص حياتك المالية والشخصية، في مكان واحد هادئ ومنظم.
                </p>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleNavClick("expenses")}
                  className="hover:border-primary-blue/30"
                >
                  جرّب السلة التفاعلية
                </Button>
              </div>

              {/* Reassurance Micro-Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent-green" /> بدون أي ربط بنكي
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent-green" /> خصوصية وتشفير كامل
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent-green" /> واجهة عربية
                </span>
              </div>
            </div>

            {/* Left Column (in RTL): Abstract Visual Composition */}
            <div className="lg:col-span-6">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM SECTION */}
        <ProblemSection />

        {/* 3. THE TAWALLA CONCEPT SECTION */}
        <ConceptSection />

        {/* 4. مصروفاتي: THE SIGNATURE BASKET PREVIEW */}
        <section id="expenses" className="py-8 sm:py-12 space-y-8">
          <SectionHeader
            badgeText="مسار مصروفاتي"
            badgeVariant="blue"
            title="السلة التفاعلية: حرّك، استبعد، وشاهد توفيرك"
            subtitle="وداعاً للقوائم الجامدة. في «تولّى»، كل مصروف له وزنه البصري داخل السلة، واستبعاده يمنحك فوراً إجمالي الوفر الشهري والسنوي."
          />
          <InteractiveBasketPreview />
        </section>

        {/* 5. ضماناتي: WARRANTY PREVIEW */}
        <WarrantiesPreview />

        {/* 6. وثائقي: DOCUMENT PREVIEW */}
        <DocumentsPreview />
      </main>

      {/* 9. BRAND FOOTER */}
      <Footer />

    </div>
  );
}
