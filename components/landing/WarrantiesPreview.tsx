import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ShieldCheck, Receipt, Clock, Check, Bell } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

export const WarrantiesPreview: React.FC = () => {
  const warranties = [
    {
      product: "شاشة تلفزيون LG OLED 65\"",
      vendor: "إكسترا (eXtra)",
      date: "ينتهي: ٩ أكتوبر ٢٠٢٦",
      remaining: "باقٍ ١٨ يوماً",
      status: "expiring" as const,
      hasInvoice: true,
      highlight: true,
    },
    {
      product: "iPhone 15 Pro Max 256GB",
      vendor: "مكتبة جرير",
      date: "ينتهي: ٢٤ سبتمبر ٢٠٢٦",
      remaining: "سارٍ (ضمان ذهبي)",
      status: "active" as const,
      hasInvoice: true,
      highlight: false,
    },
    {
      product: "غسالة صحون بوش (Bosch Series 6)",
      vendor: "شركة المنيع",
      date: "ينتهي: ١٤ يناير ٢٠٢٧",
      remaining: "سارٍ لمدة سنتين",
      status: "active" as const,
      hasInvoice: true,
      highlight: false,
    },
  ];

  return (
    <section id="warranties" className="py-12 sm:py-16 space-y-12">
      <SectionHeader
        badgeText="مسار ضماناتي"
        badgeVariant="green"
        title="لا تفرّط في حقك عند حدوث أي عطل"
        subtitle="فواتير الشراء وبطاقات الضمان في مكان واحد آمن، مع تنبيهات هادئة قبل فوات الأوان."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warranties.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-7 rounded-3xl bg-surface border transition-all duration-300 text-right flex flex-col justify-between space-y-6 ${
              item.highlight
                ? "border-accent-green/40 shadow-float ring-1 ring-accent-green/20"
                : "border-tint-brown/30 shadow-soft hover:shadow-float"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-tint-green text-accent-green flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {item.status === "expiring" ? (
                  <StatusIndicator status="expiring" withPing label={item.remaining} />
                ) : (
                  <Badge variant="green" dot size="sm">
                    {item.remaining}
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-text-main leading-snug">
                  {item.product}
                </h4>
                <p className="text-xs text-text-muted mt-1">{item.vendor}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-tint-brown/20 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  تاريخ الانتهاء
                </span>
                <span className="font-medium text-text-main">{item.date}</span>
              </div>

              <div className="flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" />
                  الفاتورة الرقمية
                </span>
                <span className="text-accent-green font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> محفوظة ومؤرشفة
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
