"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Warranty, WarrantyInput } from "@/types";

interface WarrantyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSave: (data: WarrantyInput, warrantyId?: string) => Promise<{ error: string | null }>;
  initialWarranty?: Warranty | null;
}

export const WarrantyFormModal: React.FC<WarrantyFormModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSave,
  initialWarranty,
}) => {
  const [productName, setProductName] = useState("");
  const [vendor, setVendor] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyStartDate, setWarrantyStartDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [invoiceFileUrl, setInvoiceFileUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialWarranty) {
      setProductName(initialWarranty.product_name);
      setVendor(initialWarranty.vendor || "");
      setPurchaseDate(initialWarranty.purchase_date || "");
      setWarrantyStartDate(initialWarranty.warranty_start_date || "");
      setWarrantyEndDate(initialWarranty.warranty_end_date);
      setDurationMonths(
        initialWarranty.duration_months ? initialWarranty.duration_months.toString() : ""
      );
      setInvoiceFileUrl(initialWarranty.invoice_file_url || null);
      setNotes(initialWarranty.notes || "");
    } else {
      setProductName("");
      setVendor("");
      setPurchaseDate("");
      setWarrantyStartDate("");
      setWarrantyEndDate("");
      setDurationMonths("");
      setInvoiceFileUrl(null);
      setNotes("");
    }
    setErrorMessage(null);
  }, [initialWarranty, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage("يرجى إدخال اسم الجهاز أو المنتج المشمول بالضمان.");
      return;
    }

    if (!warrantyEndDate) {
      setErrorMessage("يرجى تحديد تاريخ انتهاء الضمان.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSave(
        {
          product_name: productName.trim(),
          vendor: vendor.trim() || null,
          purchase_date: purchaseDate || null,
          warranty_start_date: warrantyStartDate || null,
          warranty_end_date: warrantyEndDate,
          duration_months: durationMonths ? parseInt(durationMonths, 10) : null,
          invoice_file_url: invoiceFileUrl,
          notes: notes.trim() || null,
        },
        initialWarranty?.id
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ أثناء حفظ بيانات الضمان.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialWarranty ? "تعديل بيانات الضمان" : "إضافة ضمان جديد"}
      description="سجّل ضمانات أجهزتك وفواتيرها لتصلك التنبيهات قبل انتهائها وتستفيد منها عند الحاجة."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-right">
        {/* Product Name */}
        <Input
          label="اسم الجهاز / المنتج"
          placeholder="مثال: هاتف آيفون 16، شاشة سامسونج OLED، ثلاجة إل جي..."
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        {/* Vendor & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="المتجر / الوكيل (اختياري)"
            placeholder="مثال: جرير، إكسترا، أمازون..."
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />

          <Input
            label="مدة الضمان بالأشهر (اختياري)"
            type="number"
            placeholder="مثال: 24"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="تاريخ الشراء (اختياري)"
            type="date"
            value={purchaseDate}
            onChange={(e) => {
              setPurchaseDate(e.target.value);
              if (!warrantyStartDate) setWarrantyStartDate(e.target.value);
            }}
          />

          <Input
            label="تاريخ انتهاء الضمان *"
            type="date"
            value={warrantyEndDate}
            onChange={(e) => setWarrantyEndDate(e.target.value)}
            required
          />
        </div>

        {/* Invoice File Upload */}
        <FileUpload
          bucket="warranty-invoices"
          userId={userId}
          recordId={initialWarranty?.id || "temp_warranty_" + Date.now()}
          currentFilePath={invoiceFileUrl}
          onFileUploaded={(filePath) => setInvoiceFileUrl(filePath)}
          onFileRemoved={() => setInvoiceFileUrl(null)}
          label="فاتورة الشراء أو كرت الضمان"
          helperText="يدعم رفع الفاتورة كـ PDF أو صورة"
        />

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">
            ملاحظات أو الرقم التسلسلي (اختياري)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: تم الشراء مع ضمان إضافي ضد الكسر، الرقم التسلسلي S/N..."
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
            {initialWarranty ? "حفظ التعديلات" : "حفظ الضمان"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
