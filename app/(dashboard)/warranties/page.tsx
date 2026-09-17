"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getWarranties,
  createWarranty,
  updateWarranty,
  deleteWarranty,
} from "@/lib/supabase/db";
import { Warranty, WarrantyInput, WarrantyStatus } from "@/types";
import { WarrantyCard } from "@/components/warranties/WarrantyCard";
import { WarrantyFormModal } from "@/components/warranties/WarrantyFormModal";
import { Button } from "@/components/ui/Button";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Plus, Sparkles, Filter } from "lucide-react";

export default function WarrantiesPage() {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters: 'all' | 'active' | 'expiring_soon' | 'expired' | 'claimed'
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getWarranties(user.id);
      setWarranties(data);
    } catch (err) {
      console.error("Error loading warranties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSave = async (data: WarrantyInput, warrantyId?: string) => {
    if (!user) return { error: "يجب تسجيل الدخول أولاً." };

    if (warrantyId) {
      const res = await updateWarranty(user.id, warrantyId, data);
      if (res.error || !res.data) {
        return { error: res.error || "تعذر تحديث بيانات الضمان." };
      }
      setWarranties((prev) => prev.map((w) => (w.id === warrantyId ? res.data! : w)));
      showToast({ type: "success", title: "تم التعديل", message: "تم تحديث بيانات الضمان بنجاح." });
      return { error: null };
    } else {
      const res = await createWarranty(user.id, data);
      if (res.error || !res.data) {
        return { error: res.error || "تعذر حفظ الضمان الجديد." };
      }
      setWarranties((prev) => [res.data!, ...prev]);
      showToast({ type: "success", title: "تمت الإضافة", message: "تم حفظ الضمان في أرشيفك." });
      return { error: null };
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("هل أنت متأكد من رغبتك في حذف هذا الضمان؟")) return;

    const original = [...warranties];
    setWarranties((prev) => prev.filter((w) => w.id !== id));

    const { success, error } = await deleteWarranty(user.id, id);
    if (!success) {
      setWarranties(original);
      showToast({ type: "error", title: "تعذر الحذف", message: error || "حدث خطأ أثناء الحذف." });
    } else {
      showToast({ type: "info", title: "تم الحذف", message: "تم حذف الضمان من قائمتك." });
    }
  };

  const handleStatusChange = async (id: string, newStatus: WarrantyStatus) => {
    if (!user) return;
    const original = [...warranties];
    setWarranties((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
    );

    const { error } = await updateWarranty(user.id, id, { status: newStatus });
    if (error) {
      setWarranties(original);
      showToast({ type: "error", title: "تعذر تغيير الحالة", message: error });
    } else {
      showToast({
        type: "success",
        title: "تم تحديث الحالة",
        message: newStatus === "claimed" ? "تم تسجيل المطالبة بالضمان." : "تم تفعيل الضمان.",
      });
    }
  };

  const filteredWarranties = warranties.filter((w) => {
    if (activeFilter === "all") return true;
    return w.status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري جلب سجلات الضمان والفواتير..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-accent-green" />
            <span>ضماناتي وفواتير الأجهزة</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            احتفظ بفواتير أجهزتك، تتبع فترات السريان، وتلقَّ تنبيهات استباقية قبل انتهاء الصلاحية.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingWarranty(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-float self-start sm:self-auto"
        >
          إضافة ضمان جديد
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-tint-brown/20 text-xs">
        <span className="text-text-muted flex items-center gap-1 pl-2 font-medium">
          <Filter className="w-3.5 h-3.5" /> تصفية:
        </span>
        {[
          { key: "all", label: `الكل (${warranties.length})` },
          {
            key: "active",
            label: `سارية (${warranties.filter((w) => w.status === "active").length})`,
          },
          {
            key: "expiring_soon",
            label: `تنتهي قريباً (${warranties.filter((w) => w.status === "expiring_soon").length})`,
          },
          {
            key: "expired",
            label: `منتهية (${warranties.filter((w) => w.status === "expired").length})`,
          },
          {
            key: "claimed",
            label: `مطالب بها (${warranties.filter((w) => w.status === "claimed").length})`,
          },
        ].map((tab) => {
          const isSelected = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                isSelected
                  ? "bg-accent-green text-white shadow-xs"
                  : "bg-surface text-text-muted hover:text-text-main border border-tint-brown/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Warranties Grid */}
      {filteredWarranties.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-surface border border-dashed border-tint-brown/40 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-tint-green text-accent-green mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-text-main">
            {activeFilter === "all"
              ? "لم تقم بتسجيل أي ضمان بعد"
              : "لا توجد عناصر مطابقة للتصفية الحالية"}
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            احفظ فواتير أجهزتك الإلكترونية والمنزلية لسهولة الرجوع إليها عند الصيانة أو الاستبدال.
          </p>
          {activeFilter === "all" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingWarranty(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              أضف أول ضمان
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWarranties.map((warranty) => (
            <WarrantyCard
              key={warranty.id}
              warranty={warranty}
              onEdit={(w) => {
                setEditingWarranty(w);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <WarrantyFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWarranty(null);
        }}
        userId={user?.id || ""}
        onSave={handleSave}
        initialWarranty={editingWarranty}
      />
    </div>
  );
}
