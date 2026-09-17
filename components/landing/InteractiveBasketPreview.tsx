"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, RotateCcw, MinusCircle, PlusCircle, ShoppingBag, ArrowDownRight } from "lucide-react";

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  cycle: string;
  tag: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: "1", title: "باقة التوصيل السنوية (HungerStation Plus)", amount: 415, category: "خدمات واستهلاك", cycle: "شهرياً", tag: "الأكبر حجماً" },
  { id: "2", title: "اشتراك النادي (Fitness Time)", amount: 250, category: "صحة ولياقة", cycle: "شهرياً", tag: "متوسط" },
  { id: "3", title: "مساحة آبل السحابية (Apple One)", amount: 55, category: "سحابية ورقمية", cycle: "شهرياً", tag: "خفيف" },
  { id: "4", title: "شاهد VIP ومسلسلات (Shahid VIP)", amount: 49, category: "ترفيه", cycle: "شهرياً", tag: "خفيف" },
  { id: "5", title: "سبوتيفاي العائلي (Spotify)", amount: 32, category: "ترفيه", cycle: "شهرياً", tag: "خفيف" },
];

export const InteractiveBasketPreview: React.FC = () => {
  const [activeItems, setActiveItems] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [excludedItems, setExcludedItems] = useState<ExpenseItem[]>([]);

  const initialTotal = INITIAL_EXPENSES.reduce((sum, item) => sum + item.amount, 0);
  const currentTotal = activeItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlySavings = initialTotal - currentTotal;
  const annualSavings = monthlySavings * 12;

  const handleExclude = (item: ExpenseItem) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));
    setExcludedItems((prev) => [...prev, item]);
  };

  const handleRestore = (item: ExpenseItem) => {
    setExcludedItems((prev) => prev.filter((i) => i.id !== item.id));
    setActiveItems((prev) => [...prev, item]);
  };

  const handleResetAll = () => {
    setActiveItems(INITIAL_EXPENSES);
    setExcludedItems([]);
  };

  return (
    <div className="w-full rounded-3xl bg-surface border border-tint-brown/30 shadow-soft p-6 sm:p-8 md:p-10 space-y-8">
      {/* Header with Live Savings Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-tint-brown/20">
        <div className="space-y-1.5 text-right">
          <div className="inline-flex items-center gap-2">
            <Badge variant="blue" size="md">
              التجربة الحية
            </Badge>
            <span className="text-xs text-text-muted">جرب استبعاد أي اشتراك لتشاهد الأثر</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-main">
            سلتك الشهرية: عاين $\leftarrow$ استبعد $\leftarrow$ شاهد الوفر
          </h3>
        </div>

        {/* Live Calculation Badge */}
        <div className="flex items-center gap-4 bg-bg-main p-3.5 rounded-2xl border border-tint-brown/30">
          <div className="text-right">
            <p className="text-[11px] text-text-muted">التكلفة الشهرية الحالية</p>
            <p className="text-2xl font-bold text-primary-blue leading-tight">
              {currentTotal}{" "}
              <span className="text-xs font-normal text-text-muted">ر.س / شهر</span>
            </p>
          </div>

          {monthlySavings > 0 && (
            <div className="text-right pr-4 border-r border-tint-brown/40 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-[11px] text-accent-green font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> وفر شهري
              </p>
              <p className="text-2xl font-bold text-accent-green leading-tight">
                +{monthlySavings}{" "}
                <span className="text-xs font-normal text-text-muted">ر.س</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Before / After Banner if savings exist */}
      {monthlySavings > 0 && (
        <div className="p-4 rounded-2xl bg-tint-green/80 border border-accent-green/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-right animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-green text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-main">
                أنت الآن توفّر <span className="text-accent-green underline decoration-accent-green/40">{monthlySavings} ر.س</span> شهرياً!
              </p>
              <p className="text-xs text-text-muted">
                ما يعادل <strong className="text-text-main">{annualSavings.toLocaleString()} ر.س</strong> توفيراً سنوياً يمكنك استثماره فيما ينفعك.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetAll} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            إعادة تعيين السلة
          </Button>
        </div>
      )}

      {/* Main Basket Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-warm-brown" />
            الاشتراكات داخل السلة ({activeItems.length})
          </span>
          <span>حجم البطاقة يعكس وزن التكلفة</span>
        </div>

        {activeItems.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-bg-main border border-dashed border-tint-brown/40 space-y-3">
            <p className="text-sm font-semibold text-text-main">سلتك أصبحت خالية تماماً!</p>
            <p className="text-xs text-text-muted">وفرت كامل المبلغ الشهري ({initialTotal} ر.س).</p>
            <Button variant="primary" size="sm" onClick={handleResetAll}>
              استعادة الاشتراكات
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {activeItems.map((item) => {
              // Visual sizing classes based on amount
              const isHigh = item.amount >= 300;
              const isMed = item.amount >= 150 && item.amount < 300;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl border transition-all duration-300 p-4 bg-surface hover:shadow-float text-right ${
                    isHigh
                      ? "w-full sm:w-[320px] bg-gradient-to-br from-surface to-tint-blue/20 border-primary-blue/30 shadow-soft"
                      : isMed
                      ? "w-full sm:w-[240px] border-tint-brown/40 shadow-soft"
                      : "w-full sm:w-[190px] border-tint-brown/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg-main text-text-muted">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExclude(item)}
                      className="text-text-muted hover:text-warm-brown p-1 rounded-lg transition-colors"
                      title="استبعاد من السلة"
                    >
                      <MinusCircle className="w-4 h-4 text-warm-brown/80 group-hover:text-warm-brown" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-text-main line-clamp-1 mb-2">
                    {item.title}
                  </p>

                  <div className="flex items-baseline justify-between pt-2 border-t border-tint-brown/20 text-xs">
                    <span className="text-[11px] text-text-muted">{item.cycle}</span>
                    <span className="font-bold text-primary-blue text-sm sm:text-base">
                      {item.amount} ر.س
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Excluded Zone (مستبعد للتجربة) */}
      {excludedItems.length > 0 && (
        <div className="pt-6 border-t border-tint-brown/20 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
            <span className="flex items-center gap-1.5 text-warm-brown">
              <ArrowDownRight className="w-4 h-4" />
              المستبعدات للتجربة ({excludedItems.length})
            </span>
            <span className="text-[11px]">انقر على (+) لإعادة الاشتراك للسلة</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {excludedItems.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-tint-brown/60 border border-warm-brown/25 text-xs text-text-main shadow-xs"
              >
                <span className="line-through text-text-muted font-medium">{item.title}</span>
                <span className="font-bold text-warm-brown">{item.amount} ر.س</span>
                <button
                  type="button"
                  onClick={() => handleRestore(item)}
                  className="p-1 rounded-md text-accent-green hover:bg-surface transition-colors"
                  title="استعادة إلى السلة"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
