"use client";

import React, { useState } from "react";
import { Warranty, WARRANTY_STATUS_LABELS } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getSignedFileUrl } from "@/lib/supabase/storage";
import {
  ShieldCheck,
  Calendar,
  Building2,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  toArabicDigits,
  formatArabicDate,
  formatDaysRemaining,
  formatMonthsCount,
} from "@/lib/utils/formatters";

interface WarrantyCardProps {
  warranty: Warranty;
  onEdit: (warranty: Warranty) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: Warranty["status"]) => void;
}

export const WarrantyCard: React.FC<WarrantyCardProps> = ({
  warranty,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [loadingDoc, setLoadingDoc] = useState(false);

  const statusMeta = WARRANTY_STATUS_LABELS[warranty.status] || {
    label: warranty.status,
    variant: "default",
  };

  const handleOpenFile = async (fileUrl: string) => {
    setLoadingDoc(true);
    try {
      const { url, error } = await getSignedFileUrl("warranty-invoices", fileUrl);
      if (url) {
        window.open(url, "_blank");
      } else {
        alert(error || "تعذر فتح الملف.");
      }
    } catch (e) {
      alert("تعذر فتح الملف.");
    } finally {
      setLoadingDoc(false);
    }
  };

  // Remaining days calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(warranty.warranty_end_date);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="group rounded-3xl bg-surface border border-tint-brown/30 p-5 sm:p-6 text-right shadow-soft hover:shadow-float transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-2xl bg-tint-green/80 text-accent-green flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant={statusMeta.variant} size="sm">
              {statusMeta.label}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-text-main line-clamp-1">
            {warranty.product_name}
          </h3>
          {warranty.vendor && (
            <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{warranty.vendor}</span>
            </p>
          )}
        </div>
      </div>

      {/* Dates & Details */}
      <div className="space-y-2 py-3 border-y border-tint-brown/20 text-xs">
        <div className="flex items-center justify-between text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> نهاية الضمان
          </span>
          <span className="font-semibold text-text-main font-mono">
            {formatArabicDate(warranty.warranty_end_date)}
          </span>
        </div>

        <div className="flex items-center justify-between text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> الحالة الزمنية
          </span>
          <span
            className={`font-semibold ${
              diffDays < 0
                ? "text-text-muted"
                : diffDays <= 30
                ? "text-warm-brown"
                : "text-accent-green"
            }`}
          >
            {formatDaysRemaining(diffDays, false)}
          </span>
        </div>

        {warranty.duration_months && (
          <div className="flex items-center justify-between text-text-muted">
            <span>مدة الضمان الأصلية</span>
            <span className="font-medium text-text-main">
              {formatMonthsCount(warranty.duration_months)}
            </span>
          </div>
        )}

        {warranty.notes && (
          <p className="text-[11px] text-text-muted/90 bg-bg-main p-2 rounded-xl mt-1 line-clamp-2">
            {warranty.notes}
          </p>
        )}
      </div>

      {/* Attached Files & Action Buttons */}
      <div className="space-y-3 pt-1">
        {warranty.invoice_file_url && (
          <button
            type="button"
            disabled={loadingDoc}
            onClick={() => handleOpenFile(warranty.invoice_file_url!)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-tint-blue/50 hover:bg-tint-blue text-primary-blue text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>معاينة فاتورة الضمان</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center justify-between pt-1">
          {onStatusChange && (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  warranty.id,
                  warranty.status === "claimed" ? "active" : "claimed"
                )
              }
              className="text-[11px] font-semibold text-text-muted hover:text-primary-blue transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {warranty.status === "claimed" ? "إلغاء المطالبة" : "تسجيل مطالبة"}
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(warranty)}
              className="p-1.5 text-text-muted hover:text-primary-blue hover:bg-bg-main rounded-xl transition-colors"
              title="تعديل الضمان"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(warranty.id)}
              className="p-1.5 text-text-muted hover:text-warm-brown hover:bg-bg-main rounded-xl transition-colors"
              title="حذف الضمان"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
