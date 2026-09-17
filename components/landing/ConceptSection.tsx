import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TawallaLogo } from "@/components/brand/TawallaLogo";
import { Eye, Hand, Coins, CheckCircle } from "lucide-react";

export const ConceptSection: React.FC = () => {
  const steps = [
    {
      icon: <Eye className="w-5 h-5 text-primary-blue" />,
      title: "راجع سلتك بوضوح",
      description: "ضع كل ما يخصك أمام عينيك في بيئة هادئة بدون رسوم بيانية معقدة أو تشويش.",
    },
    {
      icon: <Hand className="w-5 h-5 text-warm-brown" />,
      title: "جرّب الاستبعاد",
      description: "اسحب أي التزام أو اشتراك خارج السلة لترى أثر قراراتك فوراً وبكل خفة.",
    },
    {
      icon: <Coins className="w-5 h-5 text-accent-green" />,
      title: "شاهد التوفير",
      description: "حسابات ذكية تحول قراراتك الصغيرة إلى وفورات سنوية كبرى تصنع فارقاً حقيقياً.",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary-blue" />,
      title: "راحة بال واستقرار",
      description: "أوراقك مؤمنة، ضماناتك محفوظة، وتنبيهاتك تأتيك في الوقت المناسب تماماً.",
    },
  ];

  return (
    <section id="concept" className="py-12 sm:py-16 space-y-12">
      <SectionHeader
        badgeText="فلسفة تولّى"
        badgeVariant="blue"
        title="سهلناها عليك خطوة بخطوة"
        subtitle="«تولّى» ليست مجرد أداة لتسجيل الأرقام بل هي مساحة استعادة السيطرة والشعور بالخفة اليومية."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Brand Editorial Side */}
        <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-surface border border-tint-brown/30 shadow-soft text-right space-y-4 flex flex-col justify-center">
          <TawallaLogo size="lg" showText={true} subtitle="الحقيبة الحاضنة لأولويات حياتك" />
          <h3 className="text-xl sm:text-2xl font-bold text-text-main leading-snug">
            من التراكم والنسيان إلى الوضوح التام.
          </h3>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            صممنا «تولّى» لتكون كالحافظة الشخصية الفاخرة؛ تفتحها فتجد كل ورقة في موضعها، وكل اشتراك معلوم القيمة، وكل ضمان محفوظاً برقم فاتورته.
          </p>
        </div>

        {/* Narrative Progression Steps */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-surface/80 border border-tint-brown/30 shadow-xs hover:shadow-soft hover:bg-surface transition-all duration-300 text-right space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-main flex items-center justify-center border border-tint-brown/30 shrink-0">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-text-main">{item.title}</h4>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
