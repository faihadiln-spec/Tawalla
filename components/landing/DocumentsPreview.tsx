import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FileText, Lock, ShieldCheck, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const DocumentsPreview: React.FC = () => {
  const documents = [
    {
      title: "جواز السفر السعودي",
      category: "هوية وسفر",
      source: "منصة أبشر",
      expiry: "ينتهي: أغسطس ٢٠٢٩",
      badge: "سارٍ لـ ٥ سنوات",
      badgeVariant: "green" as const,
      requiresAttention: false,
    },
    {
      title: "رخصة القيادة الخصوصي",
      category: "مركبات ومواصلات",
      source: "المرور السعودي",
      expiry: "ينتهي: أكتوبر ٢٠٢٦",
      badge: "تجديد بعد شهرين",
      badgeVariant: "warning" as const,
      requiresAttention: true,
    },
    {
      title: "وثيقة التأمين الشامل للمركبة",
      category: "تأمين وحماية",
      source: "شركة التعاونية",
      expiry: "ينتهي: مارس ٢٠٢٧",
      badge: "بوليصة معتمدة",
      badgeVariant: "blue" as const,
      requiresAttention: false,
    },
    {
      title: "عقد إيجار السكن الإلكتروني",
      category: "عقود وعقارات",
      source: "شبكة إيجار",
      expiry: "ينتهي: يناير ٢٠٢٧",
      badge: "عقد موثق",
      badgeVariant: "brown" as const,
      requiresAttention: false,
    },
  ];

  return (
    <section id="documents" className="py-12 sm:py-16 space-y-12">
      <SectionHeader
        badgeText="مسار وثائقي"
        badgeVariant="brown"
        title="أوراقك الرسمية المهمة... منظمة وفي متناول يدك"
        subtitle="حفظ مشفر وخاص بالكامل، مع تصنيف ذكي يعطيك تنبيهاً قبل انتهاء أي وثيقة رسمية لتتجنب المفاجآت أو الغرامات."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-surface border transition-all duration-300 text-right flex flex-col justify-between space-y-6 ${
              doc.requiresAttention
                ? "border-[#FDBA74] shadow-float ring-1 ring-[#FDBA74]/30"
                : "border-tint-brown/30 shadow-soft hover:shadow-float"
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-tint-brown text-warm-brown flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <Badge variant={doc.badgeVariant} size="sm">
                  {doc.badge}
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-text-muted">
                  {doc.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-text-main leading-snug mt-0.5">
                  {doc.title}
                </h4>
                <p className="text-xs text-text-muted mt-1">{doc.source}</p>
              </div>
            </div>

            <div className="pt-3.5 border-t border-tint-brown/20 flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {doc.expiry}
              </span>
              <span title="مشفر وخاص">
                <Lock className="w-3.5 h-3.5 text-warm-brown/70" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
