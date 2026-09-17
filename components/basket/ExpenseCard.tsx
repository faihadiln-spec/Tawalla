"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Expense, EXPENSE_CATEGORY_LABELS } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  GripVertical,
  MinusCircle,
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

interface ExpenseCardProps {
  expense: Expense;
  isExcluded?: boolean;
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
  onExclude,
  onRestore,
  onEdit,
  onDelete,
  minPrice = 20,
  maxPrice = 500,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: expense.id,
    data: { expense },
    disabled: isExcluded,
  });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  // Normalized logarithmic scale calculation for card width
  // clamp(0, 1, (log(price) - log(min)) / (log(max) - log(min)))
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
          {expense.amount} ر.س
        </span>
        {onRestore && (
          <button
            type="button"
            onClick={() => onRestore(expense.id)}
            className="p-1 rounded-lg text-accent-green hover:bg-surface transition-colors"
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
      ref={setNodeRef}
      style={transformStyle}
      className={`group relative rounded-2xl border p-4.5 text-right transition-all duration-200 select-none ${sizeClass} ${visualWeight} ${
        isDragging
          ? "opacity-60 scale-105 shadow-float border-primary-blue ring-2 ring-primary-blue/30 cursor-grabbing z-50"
          : "hover:shadow-float hover:border-primary-blue/40 cursor-grab"
      }`}
    >
      {/* Top row: Category Badge & Drag handle / Exclude */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bg-main border border-tint-brown/30 text-[10px] font-semibold text-text-muted">
          {CATEGORY_ICONS[expense.category] || <Tag className="w-3 h-3" />}
          <span>{EXPENSE_CATEGORY_LABELS[expense.category] || expense.category}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Drag Handle */}
          <div
            {...listeners}
            {...attributes}
            className="p-1 text-text-muted/60 hover:text-text-main cursor-grab active:cursor-grabbing rounded-md hover:bg-bg-main"
            title="اسحب للخارج للاستبعاد"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Quick Exclude Button (especially helpful for mobile / touch) */}
          {onExclude && (
            <button
              type="button"
              onClick={() => onExclude(expense.id)}
              className="p-1 text-text-muted hover:text-warm-brown rounded-md hover:bg-tint-brown/50 transition-colors"
              title="استبعاد من السلة"
            >
              <MinusCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expense Title */}
      <p className="text-sm font-bold text-text-main line-clamp-1 mb-3">
        {expense.title}
      </p>

      {/* Amount & Cycle */}
      <div className="flex items-baseline justify-between pt-2.5 border-t border-tint-brown/20 text-xs">
        <span className="text-[11px] text-text-muted">
          {expense.billing_cycle === "yearly" ? "سنوياً" : "شهرياً"}
          {expense.billing_day ? ` • يوم ${expense.billing_day}` : ""}
        </span>
        <span className="font-bold text-primary-blue text-base sm:text-lg">
          {expense.amount}{" "}
          <span className="text-xs font-normal text-text-muted">ر.س</span>
        </span>
      </div>

      {/* Card hover action menu */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-surface/90 backdrop-blur-xs p-1 rounded-xl shadow-xs border border-tint-brown/30">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(expense);
            }}
            className="p-1 text-text-muted hover:text-primary-blue rounded-md hover:bg-bg-main transition-colors"
            title="تعديل"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(expense.id);
            }}
            className="p-1 text-text-muted hover:text-warm-brown rounded-md hover:bg-bg-main transition-colors"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
