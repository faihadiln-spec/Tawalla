import React from "react";
import { TawallaLogo } from "@/components/brand/TawallaLogo";
import { toArabicDigits } from "@/lib/utils/formatters";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-tint-brown/30 bg-surface/80 py-12 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <TawallaLogo size="md" showText={true} subtitle="كل ما يخص حياتك المالية والشخصية، في مكان واحد." />
            <p className="text-xs text-text-muted max-w-md leading-relaxed">
              منصة عربية شخصية لمساعدتك على رعاية أمورك الهامة قبل أن تتراكم أو تُنسى؛ عبر تجربة سلة بصرية مبتكرة ومسارات واضحة للضمانات والوثائق.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-text-main tracking-wider uppercase">
              مسارات تولّى
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <a href="#expenses" className="hover:text-primary-blue transition-colors">
                  مصروفاتي (السلة التفاعلية)
                </a>
              </li>
              <li>
                <a href="#warranties" className="hover:text-accent-green transition-colors">
                  ضماناتي (تتبع الصلاحية)
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-warm-brown transition-colors">
                  وثائقي (الأوراق الرسمية)
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Principles */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-text-main tracking-wider uppercase">
              مبادئنا
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>خصوصية وأمان تام للبيانات</li>
              <li>بدون بيع أو مشاركة لمعلوماتك</li>
              <li>تجربة عربية أصيلة</li>
              <li>واجهات بدون تعقيد</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-tint-brown/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {toArabicDigits(new Date().getFullYear())} تولّى. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};
