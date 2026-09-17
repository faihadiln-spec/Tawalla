"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Expense,
  ExpenseInput,
  ExpenseCategory,
  ExpenseBillingCycle,
  EXPENSE_CATEGORY_LABELS,
} from "@/types";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: ExpenseInput, expenseId?: string) => Promise<{ error: string | null }>;
  initialExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExpense,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<ExpenseBillingCycle>("monthly");
  const [category, setCategory] = useState<ExpenseCategory>("entertainment");
  const [billingDay, setBillingDay] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setAmount(initialExpense.amount.toString());
      setBillingCycle(initialExpense.billing_cycle);
      setCategory(initialExpense.category);
      setBillingDay(initialExpense.billing_day ? initialExpense.billing_day.toString() : "");
      setNotes(initialExpense.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setBillingCycle("monthly");
      setCategory("entertainment");
      setBillingDay("");
      setNotes("");
    }
    setErrorMessage(null);
  }, [initialExpense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("يرجى إدخال اسم المصروف أو الاشتراك.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("يرجى إدخال مبلغ صحيح أكبر من الصفر.");
      return;
    }

    let parsedDay: number | null = null;
    if (billingDay) {
      const d = parseInt(billingDay, 10);
      if (isNaN(d) || d < 1 || d > 31) {
        setErrorMessage("يوم الفاتورة يجب أن يكون بين ١ و ٣١.");
        return;
      }
      parsedDay = d;
    }

    setIsSubmitting(true);
    try {
      const result = await onSave(
        {
          title: title.trim(),
          amount: numAmount,
          billing_cycle: billingCycle,
          category,
          billing_day: parsedDay,
          notes: notes.trim() || null,
        },
        initialExpense?.id
      );

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ غير متوقع أثناء حفظ المصروف.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialExpense ? "تعديل المصروف" : "إضافة مصروف إلى السلة"}
      description="أدخل تفاصيل الاشتراك أو المصروف المتكرر لحسابه داخل سلتك الشخصية."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-right">
        {/* Title */}
        <Input
          label="اسم المصروف / الاشتراك"
          placeholder="مثال: سبوتيفاي العائلي، باقة التوصيل، اشتراك النادي..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Amount & Billing Cycle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="المبلغ (ر.س)"
            type="number"
            step="any"
            min="0.01"
            placeholder="٠٫٠٠"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-main">دورة التكرار</label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as ExpenseBillingCycle)}
              className="w-full h-11 px-3.5 rounded-2xl bg-surface border border-tint-brown focus:border-primary-blue focus:outline-none text-xs text-text-main"
            >
              <option value="monthly">شهرياً</option>
              <option value="yearly">سنوياً</option>
            </select>
          </div>
        </div>

        {/* Category & Billing Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-main">التصنيف</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full h-11 px-3.5 rounded-2xl bg-surface border border-tint-brown focus:border-primary-blue focus:outline-none text-xs text-text-main"
            >
              {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {EXPENSE_CATEGORY_LABELS[catKey]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="يوم الخصم من الشهر (اختياري)"
            type="number"
            min="1"
            max="31"
            placeholder="مثال: ٢٥"
            value={billingDay}
            onChange={(e) => setBillingDay(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-main">ملاحظات إضافية (اختياري)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي تفاصيل ترغب بتذكرها..."
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
            {initialExpense ? "حفظ التعديلات" : "إضافة إلى السلة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
