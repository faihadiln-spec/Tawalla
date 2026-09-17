"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  DocumentRecord,
  DocumentInput,
  DocumentCategory,
  DOCUMENT_CATEGORY_LABELS,
} from "@/types";

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSave: (data: DocumentInput, docId?: string) => Promise<{ error: string | null }>;
  initialDocument?: DocumentRecord | null;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSave,
  initialDocument,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("identity");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderDays, setReminderDays] = useState("30");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialDocument) {
      setTitle(initialDocument.title);
      setCategory(initialDocument.category);
      setDocumentNumber(initialDocument.document_number || "");
      setIssueDate(initialDocument.issue_date || "");
      setExpiryDate(initialDocument.expiry_date || "");
      setReminderDays(
        initialDocument.reminder_days_before ? initialDocument.reminder_days_before.toString() : "30"
      );
      setFileUrl(initialDocument.file_url || null);
      setFileType(initialDocument.file_type || null);
      setFileSizeBytes(initialDocument.file_size_bytes || null);
      setNotes(initialDocument.notes || "");
    } else {
      setTitle("");
      setCategory("identity");
      setDocumentNumber("");
      setIssueDate("");
      setExpiryDate("");
      setReminderDays("30");
      setFileUrl(null);
      setFileType(null);
      setFileSizeBytes(null);
      setNotes("");
    }
    setErrorMessage(null);
  }, [initialDocument, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("يرجى إدخال اسم أو عنوان الوثيقة.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSave(
        {
          title: title.trim(),
          category,
          document_number: documentNumber.trim() || null,
          issue_date: issueDate || null,
          expiry_date: expiryDate || null,
          reminder_days_before: reminderDays ? parseInt(reminderDays, 10) : 30,
          file_url: fileUrl,
          file_type: fileType,
          file_size_bytes: fileSizeBytes,
          notes: notes.trim() || null,
        },
        initialDocument?.id
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ أثناء حفظ بيانات الوثيقة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialDocument ? "تعديل بيانات الوثيقة" : "إضافة وثيقة جديدة"}
      description="أرشف وثائقك الهامة في مساحتك المشفرة مع تتبع تواريخ الانتهاء والتجديد."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-right">
        {/* Title */}
        <Input
          label="اسم الوثيقة"
          placeholder="مثال: جواز السفر، رخصة القيادة، عقد إيجار الشقة، وثيقة التأمين الطبي..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Category & Document Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-main">تصنيف الوثيقة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full h-11 px-3.5 rounded-2xl bg-surface border border-tint-brown focus:border-primary-blue focus:outline-none text-xs text-text-main"
            >
              {(Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[]).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {DOCUMENT_CATEGORY_LABELS[catKey]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="رقم الوثيقة / الهوية (اختياري)"
            placeholder="مثال: 1089348291"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="تاريخ الإصدار (اختياري)"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />

          <Input
            label="تاريخ الانتهاء (اختياري)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {/* Reminder Days */}
        {expiryDate && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-main">
              التنبيه قبل موعد الانتهاء بـ
            </label>
            <select
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-surface border border-tint-brown focus:border-primary-blue focus:outline-none text-xs text-text-main"
            >
              <option value="15">15 يوماً</option>
              <option value="30">شهر (30 يوماً)</option>
              <option value="60">شهران (60 يوماً)</option>
              <option value="90">3 أشهر (90 يوماً)</option>
            </select>
          </div>
        )}

        {/* File Upload */}
        <FileUpload
          bucket="user-documents"
          userId={userId}
          recordId={initialDocument?.id || "temp_doc_" + Date.now()}
          currentFilePath={fileUrl}
          onFileUploaded={(filePath, file) => {
            setFileUrl(filePath);
            setFileType(file.type);
            setFileSizeBytes(file.size);
          }}
          onFileRemoved={() => {
            setFileUrl(null);
            setFileType(null);
            setFileSizeBytes(null);
          }}
          label="نسخة الوثيقة أو الصورة"
          helperText="يدعم PDF أو صورة واضحة (حفظ مشفر)"
        />

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">ملاحظات (اختياري)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: رقم الحساب المرتبط، جهة الإصدار، ملاحظات التجديد..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-surface border border-tint-brown focus:border-primary-blue focus:outline-none text-xs text-text-main resize-none"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-warm-brown/10 border border-warm-brown/20 text-xs text-warm-brown font-medium">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-tint-brown/20">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {initialDocument ? "حفظ التعديلات" : "حفظ الوثيقة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
