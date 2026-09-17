"use client";

import React, { useState } from "react";
import { DocumentRecord, DOCUMENT_CATEGORY_LABELS } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { getSignedFileUrl } from "@/lib/supabase/storage";
import {
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  FileCheck,
  Shield,
  Car,
  Home,
  HeartPulse,
  FileSignature,
  User,
} from "lucide-react";
import {
  toArabicDigits,
  formatArabicDate,
  formatDaysRemaining,
} from "@/lib/utils/formatters";

interface DocumentCardProps {
  document: DocumentRecord;
  onEdit: (doc: DocumentRecord) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  identity: <User className="w-4 h-4" />,
  vehicle: <Car className="w-4 h-4" />,
  property: <Home className="w-4 h-4" />,
  health_ins: <HeartPulse className="w-4 h-4" />,
  contract: <FileSignature className="w-4 h-4" />,
  personal: <Shield className="w-4 h-4" />,
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onDelete,
}) => {
  const [loadingDoc, setLoadingDoc] = useState(false);

  // Expiry calculation
  let diffDays: number | null = null;
  let statusBadge: { label: string; variant: "green" | "brown" | "neutral" } = {
    label: "سارية",
    variant: "green",
  };

  if (document.expiry_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(document.expiry_date);
    end.setHours(0, 0, 0, 0);
    diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const reminderDays = document.reminder_days_before || 30;

    if (diffDays < 0) {
      statusBadge = { label: "منتهية الصلاحية", variant: "neutral" };
    } else if (diffDays <= reminderDays) {
      statusBadge = { label: "تنتهي قريباً", variant: "brown" };
    }
  }

  const handleOpenFile = async (fileUrl: string) => {
    setLoadingDoc(true);
    try {
      const { url, error } = await getSignedFileUrl("user-documents", fileUrl);
      if (url) {
        window.open(url, "_blank");
      } else {
        alert(error || "تعذر فتح الوثيقة المشفرة.");
      }
    } catch (e) {
      alert("تعذر فتح الوثيقة المشفرة.");
    } finally {
      setLoadingDoc(false);
    }
  };

  return (
    <div className="group rounded-3xl bg-surface border border-tint-brown/30 p-5 sm:p-6 text-right shadow-soft hover:shadow-float transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Top row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-2xl bg-tint-brown text-warm-brown flex items-center justify-center shrink-0">
            {CATEGORY_ICONS[document.category] || <FileText className="w-5 h-5" />}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-bg-main text-text-muted border border-tint-brown/30">
              {DOCUMENT_CATEGORY_LABELS[document.category] || document.category}
            </span>
            {document.expiry_date && (
              <Badge variant={statusBadge.variant} size="sm">
                {statusBadge.label}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-text-main line-clamp-1">
            {document.title}
          </h3>
          {document.document_number && (
            <p className="text-xs text-text-muted font-mono mt-0.5">
              رقم الوثيقة: {toArabicDigits(document.document_number)}
            </p>
          )}
        </div>
      </div>

      {/* Dates & Expiry */}
      <div className="space-y-2 py-3 border-y border-tint-brown/20 text-xs">
        {document.expiry_date ? (
          <>
            <div className="flex items-center justify-between text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> تاريخ الانتهاء
              </span>
              <span className="font-semibold text-text-main font-mono">
                {formatArabicDate(document.expiry_date)}
              </span>
            </div>

            {diffDays !== null && (
              <div className="flex items-center justify-between text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> المهلة المتبقية
                </span>
                <span
                  className={`font-semibold ${
                    diffDays < 0
                      ? "text-text-muted"
                      : diffDays <= (document.reminder_days_before || 30)
                      ? "text-warm-brown"
                      : "text-accent-green"
                  }`}
                >
                  {formatDaysRemaining(diffDays, true)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between text-text-muted">
            <span>الصلاحية</span>
            <span className="font-medium text-accent-green">وثيقة دائمة / غير مؤقتة</span>
          </div>
        )}

        {document.notes && (
          <p className="text-[11px] text-text-muted/90 bg-bg-main p-2 rounded-xl mt-1 line-clamp-2">
            {document.notes}
          </p>
        )}
      </div>

      {/* Attached file & Actions */}
      <div className="space-y-3 pt-1">
        {document.file_url ? (
          <button
            type="button"
            disabled={loadingDoc}
            onClick={() => handleOpenFile(document.file_url!)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-tint-blue/50 hover:bg-tint-blue text-primary-blue text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>معاينة الوثيقة المشفرة</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="text-center py-2 text-[11px] text-text-muted">
            لا يوجد ملف مرفق
          </div>
        )}

        <div className="flex items-center justify-end gap-1 pt-1">
          <button
            type="button"
            onClick={() => onEdit(document)}
            className="p-1.5 text-text-muted hover:text-primary-blue hover:bg-bg-main rounded-xl transition-colors"
            title="تعديل"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(document.id)}
            className="p-1.5 text-text-muted hover:text-warm-brown hover:bg-bg-main rounded-xl transition-colors"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
