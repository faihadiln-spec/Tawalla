"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Expense, ExpenseInput, ExpenseStatus } from "@/types";
import { ExpenseCard } from "./ExpenseCard";
import { SavingsSummary } from "./SavingsSummary";
import { ExpenseModal } from "./ExpenseModal";
import { ShareableResult } from "./ShareableResult";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  updateExpenseStatus,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/supabase/db";
import {
  ShoppingBag,
  Plus,
  ArrowDownRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface InteractiveBasketProps {
  userId: string;
  initialExpenses: Expense[];
  onRefresh?: () => void;
}

// Droppable Removal Zone
function RemovalZone({ isOver, count }: { isOver: boolean; count: number }) {
  const { setNodeRef } = useDroppable({
    id: "removal-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full rounded-2xl border-2 border-dashed p-4.5 transition-all duration-300 text-right ${
        isOver
          ? "bg-tint-brown border-warm-brown scale-[1.01] shadow-float ring-2 ring-warm-brown/30"
          : "bg-surface/50 border-tint-brown/60 hover:border-warm-brown/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isOver ? "bg-warm-brown text-white" : "bg-tint-brown text-warm-brown"
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-main">
              منطقة الاستبعاد للتجربة {count > 0 ? `(${count})` : ""}
            </p>
            <p className="text-[11px] text-text-muted">
              {isOver
                ? "أفلت البطاقة هنا لتجربة استبعادها وحساب الوفر فوراً!"
                : "اسحب أي اشتراك وأفلته هنا لاستبعاده مؤقتاً"}
            </p>
          </div>
        </div>

        {isOver && (
          <span className="text-xs font-bold text-accent-green animate-pulse">
            + وفر محتمل!
          </span>
        )}
      </div>
    </div>
  );
}

// Droppable Basket Zone
function BasketContainer({
  children,
  isOver,
}: {
  children: React.ReactNode;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: "basket-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded-3xl p-6 sm:p-7 border transition-all duration-300 ${
        isOver
          ? "bg-tint-blue/20 border-primary-blue/40 ring-2 ring-primary-blue/20"
          : "bg-surface border-tint-brown/30 shadow-soft"
      }`}
    >
      {children}
    </div>
  );
}

export const InteractiveBasket: React.FC<InteractiveBasketProps> = ({
  userId,
  initialExpenses,
  onRefresh,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [activeDraggingExpense, setActiveDraggingExpense] = useState<Expense | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { showToast } = useToast();

  // Configure Sensors (Smooth on pointer & touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  // Split active & excluded
  const activeItems = expenses.filter((e) => e.status === "active");
  const excludedItems = expenses.filter((e) => e.status === "excluded");

  // Totals
  const initialTotal = expenses
    .filter((e) => e.status !== "cancelled")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const currentTotal = activeItems.reduce((sum, item) => sum + Number(item.amount), 0);

  // Min / Max for logarithmic card scaling
  const amounts = activeItems.map((e) => Number(e.amount));
  const minPrice = amounts.length > 0 ? Math.min(...amounts) : 20;
  const maxPrice = amounts.length > 0 ? Math.max(...amounts) : 500;

  // DND Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const expense = event.active.data.current?.expense as Expense;
    if (expense) {
      setActiveDraggingExpense(expense);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDraggingExpense(null);

    if (!over) return;

    const expenseId = active.id as string;
    const targetZone = over.id as string;

    if (targetZone === "removal-zone") {
      await handleExcludeExpense(expenseId);
    } else if (targetZone === "basket-zone") {
      await handleRestoreExpense(expenseId);
    }
  };

  // Status Change with Optimistic UI & Rollback
  const handleExcludeExpense = async (expenseId: string) => {
    const originalExpenses = [...expenses];

    // Optimistic UI update
    setExpenses((prev) =>
      prev.map((item) => (item.id === expenseId ? { ...item, status: "excluded" } : item))
    );

    const { success, error } = await updateExpenseStatus(userId, expenseId, "excluded");
    if (!success) {
      // Rollback on failure
      setExpenses(originalExpenses);
      showToast({
        type: "error",
        title: "تعذر استبعاد المصروف",
        message: error || "حدث خطأ أثناء حفظ التغيير في قاعدة البيانات.",
      });
    }
  };

  const handleRestoreExpense = async (expenseId: string) => {
    const originalExpenses = [...expenses];

    // Optimistic UI update
    setExpenses((prev) =>
      prev.map((item) => (item.id === expenseId ? { ...item, status: "active" } : item))
    );

    const { success, error } = await updateExpenseStatus(userId, expenseId, "active");
    if (!success) {
      // Rollback on failure
      setExpenses(originalExpenses);
      showToast({
        type: "error",
        title: "تعذر استعادة المصروف",
        message: error || "حدث خطأ أثناء تحديث الحالة.",
      });
    }
  };

  const handleResetAll = async () => {
    const originalExpenses = [...expenses];
    setExpenses((prev) => prev.map((e) => ({ ...e, status: "active" })));

    try {
      const promises = excludedItems.map((e) => updateExpenseStatus(userId, e.id, "active"));
      await Promise.all(promises);
      showToast({
        type: "success",
        title: "تمت إعادة تعيين السلة",
        message: "تمت استعادة جميع المصروفات إلى السلة بنجاح.",
      });
    } catch (e) {
      setExpenses(originalExpenses);
      showToast({
        type: "error",
        title: "تعذر إعادة التعيين",
        message: "حدث خطأ في تحديث قاعدة البيانات.",
      });
    }
  };

  // Add / Edit Modal Save
  const handleSaveExpense = async (expenseData: ExpenseInput, expenseId?: string) => {
    if (expenseId) {
      // Update
      const { data, error } = await updateExpense(userId, expenseId, expenseData);
      if (error || !data) {
        return { error: error || "تعذر تحديث المصروف." };
      }
      setExpenses((prev) => prev.map((e) => (e.id === expenseId ? data : e)));
      showToast({ type: "success", title: "تم التعديل", message: "تم تحديث بيانات المصروف بنجاح." });
      return { error: null };
    } else {
      // Create
      const { data, error } = await createExpense(userId, expenseData);
      if (error || !data) {
        return { error: error || "تعذر إضافة المصروف." };
      }
      setExpenses((prev) => [data, ...prev]);
      showToast({ type: "success", title: "تمت الإضافة", message: "تمت إضافة المصروف إلى سلتك." });
      return { error: null };
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المصروف نهائياً؟")) return;

    const original = [...expenses];
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

    const { success, error } = await deleteExpense(userId, expenseId);
    if (!success) {
      setExpenses(original);
      showToast({
        type: "error",
        title: "تعذر الحذف",
        message: error || "حدث خطأ أثناء حذف المصروف.",
      });
    } else {
      showToast({ type: "info", title: "تم الحذف", message: "تم حذف المصروف من سلتك." });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8 text-right">
        {/* 1. Header & Live Totals */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-warm-brown" />
              <span>سلة مصروفاتي التفاعلية</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              عاين، اسحب، استبعد، وشاهد أثر الوفر اللحظي على نمط حياتك.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-float self-start sm:self-auto"
          >
            إضافة مصروف جديد
          </Button>
        </div>

        {/* 2. Before / After & Live Savings Summary */}
        <SavingsSummary
          initialTotal={initialTotal}
          currentTotal={currentTotal}
          excludedCount={excludedItems.length}
          onResetAll={handleResetAll}
          onOpenShare={() => setIsShareModalOpen(true)}
        />

        {/* 3. Drag & Drop Removal Zone */}
        <RemovalZone isOver={false} count={excludedItems.length} />

        {/* 4. Active Basket Container */}
        <BasketContainer isOver={false}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-text-muted pb-3 border-b border-tint-brown/20">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-warm-brown" />
                الاشتراكات النشطة في السلة ({activeItems.length})
              </span>
              <span className="hidden sm:inline-block text-[11px]">
                اسحب البطاقة للخارج أو انقر (-) للاستبعاد
              </span>
            </div>

            {activeItems.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-tint-green/80 text-accent-green mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-text-main">سلتك خالية حالياً!</p>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  {excludedItems.length > 0
                    ? `لقد استبعدت كافة المصروفات ووفرت ${initialTotal.toLocaleString()} ر.س شهرياً.`
                    : "ابدأ بإضافة أول مصروف أو اشتراك شهري لمشاهدة وزنه البصري داخل السلة."}
                </p>
                {excludedItems.length > 0 ? (
                  <Button variant="outline" size="sm" onClick={handleResetAll}>
                    استعادة كافة المصروفات
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingExpense(null);
                      setIsModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    أضف أول مصروف
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {activeItems.map((item) => (
                  <ExpenseCard
                    key={item.id}
                    expense={item}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onExclude={handleExcludeExpense}
                    onEdit={(exp) => {
                      setEditingExpense(exp);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </div>
            )}
          </div>
        </BasketContainer>

        {/* 5. Excluded Zone (المستبعدات للتجربة) */}
        {excludedItems.length > 0 && (
          <div className="p-6 rounded-3xl bg-tint-brown/40 border border-warm-brown/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-semibold text-text-main">
              <span className="flex items-center gap-2 text-warm-brown font-bold">
                <ArrowDownRight className="w-4 h-4" />
                المستبعدات للتجربة ({excludedItems.length})
              </span>
              <span className="text-[11px] text-text-muted">
                انقر على (+) لإعادة الاشتراك فوراً إلى السلة
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {excludedItems.map((item) => (
                <ExpenseCard
                  key={item.id}
                  expense={item}
                  isExcluded={true}
                  onRestore={handleRestoreExpense}
                />
              ))}
            </div>
          </div>
        )}

        {/* Drag Overlay Preview */}
        <DragOverlay>
          {activeDraggingExpense ? (
            <ExpenseCard
              expense={activeDraggingExpense}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          ) : null}
        </DragOverlay>

        {/* Add / Edit Modal */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          initialExpense={editingExpense}
        />

        {/* Share Result Modal */}
        <ShareableResult
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          activeExpenses={activeItems}
          initialTotal={initialTotal}
          currentTotal={currentTotal}
        />
      </div>
    </DndContext>
  );
};
