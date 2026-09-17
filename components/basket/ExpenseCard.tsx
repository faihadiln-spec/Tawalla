"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Expense, EXPENSE_CATEGORY_LABELS } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  GripVertical,
  PlusCircle,
  Trash2,
  Edit2,
  Tv,
  HeartPulse,
  Cloud,
  Car,
  Zap,
  Tag,
} from "lucide-react";

import { formatArabicNumber, toArabicDigits } from "@/lib/utils/formatters";

interface ExpenseCardProps {
  expense: Expense;
  isExcluded?: boolean;
  isOverlay?: boolean;
  onExclude?: (id: string) => void;
  onRestore?: (id: string) => void;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  minPrice?: number;
  maxPrice?: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  entertainment: <Tv className="w-3.5 h-3.5" />,
  health: <HeartPulse className="w-3.5 h-3.5" />,
  digital: <Cloud className="w-3.5 h-3.5" />,
  convenience: <Car className="w-3.5 h-3.5" />,
  utilities: <Zap className="w-3.5 h-3.5" />,
  other: <Tag className="w-3.5 h-3.5" />,
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  isExcluded = false,
  isOverlay = false,
  onExclude,
  onRestore,
  onEdit,
  onDelete,
  minPrice = 20,
  maxPrice = 500,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: expense.id,
    data: { expense },
    disabled: isExcluded || isOverlay,
  });

  // Normalized logarithmic scale calculation for card width
  const safeMin = Math.max(minPrice, 1);
  const safeMax = Math.max(maxPrice, safeMin + 1);
  const safeAmount = Math.max(expense.amount, safeMin);
  const normalizedWeight = Math.min(
    1,
    Math.max(0, (Math.log(safeAmount) - Math.log(safeMin)) / (Math.log(safeMax) - Math.log(safeMin)))
  );

  // Dynamic width classes based on weight
  let sizeClass = "w-full sm:w-[190px]";
  let visualWeight = "bg-surface border-tint-brown/40";

  if (normalizedWeight > 0.65 || expense.amount >= 300) {
    sizeClass = "w-full sm:w-[310px]";
    visualWeight = "bg-gradient-to-br from-surface via-surface to-tint-blue/20 border-primary-blue/30 shadow-soft";
  } else if (normalizedWeight > 0.35 || expense.amount >= 150) {
    sizeClass = "w-full sm:w-[245px]";
    visualWeight = "bg-surface border-tint-brown/60 shadow-soft";
  }

  if (isExcluded) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-tint-brown/60 border border-warm-brown/30 text-xs text-text-main shadow-xs transition-all hover:bg-tint-brown">
        <span className="w-2 h-2 rounded-full bg-warm-brown" />
        <span className="line-through text-text-muted font-medium truncate max-w-[140px] sm:max-w-[200px]">
          {expense.title}
        </span>
        <span className="font-bold text-warm-brown whitespace-nowrap">
          {formatArabicNumber(expense.amount)} ر.س
        </span>
        {onRestore && (
          <button
            type="button"
            onClick={() => onRestore(expense.id)}
            className="p-1 rounded-lg text-accent-green hover:bg-surface transition-colors cursor-pointer"
            title="استعادة إلى السلة"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : { ...listeners, ...attributes })}
      className={`group relative rounded-2xl border p-4.5 text-right transition-all duration-200 select-none touch-none ${sizeClass} ${visualWeight} ${
        isDragging
          ? "opacity-25 scale-95 border-dashed border-warm-brown pointer-events-none"
          : isOverlay
          ? "shadow-float scale-105 border-warm-brown ring-2 ring-warm-brown/40 cursor-grabbing z-50 pointer-events-none"
          : "hover:shadow-float hover:border-primary-blue/40 cursor-grab active:cursor-grabbing"
      }`}
    >
      {/* Top Row: Expense Title & Drag handle */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base sm:text-[17px] font-bold text-text-main line-clamp-1 leading-snug">
          {expense.title}
        </h3>

        <div
          className="p-1 text-text-muted/60 group-hover:text-text-main rounded-md shrink-0 cursor-grab active:cursor-grabbing"
          title="اسحب للخارج للاستبعاد"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Category Badge (تحت اسم الاشتراك) */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bg-main border border-tint-brown/30 text-[10px] font-semibold text-text-muted mb-3">
        {CATEGORY_ICONS[expense.category] || <Tag className="w-3 h-3" />}
        <span>{EXPENSE_CATEGORY_LABELS[expense.category] || expense.category}</span>
      </div>

      {/* Amount & Cycle (السعر جهة اليمين مع ر.س / شهر) */}
      <div className="flex items-baseline justify-between pt-2.5 border-t border-tint-brown/20 text-xs">
        <div className="flex items-baseline gap-1 text-primary-blue font-bold text-base sm:text-lg">
          <span>{formatArabicNumber(expense.amount)}</span>
          <span className="text-xs font-normal text-text-muted">
            {expense.billing_cycle === "yearly" ? "ر.س / سنة" : "ر.س / شهر"}
          </span>
        </div>

        {expense.billing_day && (
          <span className="text-[11px] text-text-muted font-medium">
            يوم {toArabicDigits(expense.billing_day)}
          </span>
        )}
      </div>

      {/* Card hover action menu */}
      {!isOverlay && (onEdit || onDelete) && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-surface/90 backdrop-blur-xs p-1 rounded-xl shadow-xs border border-tint-brown/30">
          {onEdit && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(expense);
              }}
              className="p-1 text-text-muted hover:text-primary-blue rounded-md hover:bg-bg-main transition-colors cursor-pointer"
              title="تعديل"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(expense.id);
              }}
              className="p-1 text-text-muted hover:text-warm-brown rounded-md hover:bg-bg-main transition-colors cursor-pointer"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

