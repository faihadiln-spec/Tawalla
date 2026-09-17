import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-12 sm:py-16 space-y-12">
      <SectionHeader
        badgeText="المنظومة الموحدة"
        badgeVariant="blue"
        title="مظلة واحدة تجمع الضروريات الثلاث"
        subtitle="ليست ثلاثة تطبيقات منفصلة؛ بل مركز حياة شخصي متناغم يريحك من شتات المتابعة والتنقل بين المنصات."
      />

      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-tint-brown/30 shadow-soft text-right space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Path 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main">١. مصروفاتي</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              تحكم بمرونة في اشتراكاتك المتكررة، واختبر استبعاد ما لا يفيدك لتكتشف كيف تنمو مدخراتك شهراً بعد شهر.
            </p>
            <div className="p-3 rounded-xl bg-bg-main text-xs text-primary-blue font-semibold">
              سلتك التفاعلية • وفر مباشر
            </div>
          </div>

          {/* Path 2 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main">٢. ضماناتي</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              احمِ استثماراتك في أجهزتك المنزلية والإلكترونية، واحتفظ بفواتيرها الأصلية جاهزة لأي صيانة أو مطالبة.
            </p>
            <div className="p-3 rounded-xl bg-bg-main text-xs text-accent-green font-semibold">
              تتبع الصلاحية • أرشفة الفواتير
            </div>
          </div>

          {/* Path 3 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main">٣. وثائقي</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              رخصك، جوازاتك، عقودك وتأميناتك في متناول يدك دائماً، مع إشعار استباقي يسبق كل موعد انتهاء.
            </p>
            <div className="p-3 rounded-xl bg-bg-main text-xs text-warm-brown font-semibold">
              تنبيهات استباقية • خصوصية مطلقة
            </div>
          </div>
        </div>

        {/* Security & Privacy Banner */}
        <div className="p-6 rounded-2xl bg-bg-main border border-tint-brown/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-text-main">
              بياناتك ووثائقك ملكك وحدك
            </p>
            <p className="text-xs text-text-muted">
              تشفير تام لكل مستند، بدون بيع بيانات، وبدون أي ربط مصرفي مباشر قد يقلقك.
            </p>
          </div>

          <div className="text-xs font-semibold text-accent-green bg-surface px-3.5 py-2 rounded-xl border border-tint-brown/30">
            <span>بيئة آمنة ومشفرة</span>
          </div>
        </div>
      </div>
    </section>
  );
};
