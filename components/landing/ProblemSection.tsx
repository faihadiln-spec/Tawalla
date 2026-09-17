import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AlertCircle, Clock, Receipt, FileWarning } from "lucide-react";

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Receipt className="w-5 h-5 text-[#C2410C]" />,
      title: "اشتراكات تتجدد بصمت",
      description:
        "خدمة اشتركت بها قبل عام للتجربة، بطاقة رقمية نسيتها، أو باقة توصيل نادراً ما تستخدمها؛ تتراكم المبالغ وتستنزف ميزانيتك شهراً بعد شهر.",
      tint: "bg-[#FFF7ED] border-[#FDBA74]/30",
    },
    {
      icon: <Clock className="w-5 h-5 text-warm-brown" />,
      title: "ضمانات تضيع عند الحاجة",
      description:
        "تتعطل الشاشة أو الغسالة، فتبدأ رحلة البحث المضنية في الأدراج وصناديق الكرتون عن ورقة الفاتورة، لتكتشف أحياناً أن الضمان قد انتهى للتو.",
      tint: "bg-tint-brown/60 border-warm-brown/25",
    },
    {
      icon: <FileWarning className="w-5 h-5 text-primary-blue" />,
      title: "وثائق تفاجئك بانتهاء صلاحيتها",
      description:
        "جواز سفر يمنعك من الصعود للطائرة، رخصة قيادة تتجاوز موعد الفحص الدوري، أو تأمين مركبة ينتهي دون انتباه؛ مواقف تربك جدولك اليومي.",
      tint: "bg-tint-blue/70 border-primary-blue/20",
    },
  ];

  return (
    <section id="problem" className="py-12 sm:py-16 space-y-12">
      <SectionHeader
        title="نظم اشتراكاتك وضماناتك ووثائقك في مكان واحد، وعش ببال مرتاح"
        titleClassName="md:whitespace-nowrap"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 hover:shadow-float text-right space-y-4 ${item.tint}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center shadow-xs shrink-0">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight">
                {item.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
