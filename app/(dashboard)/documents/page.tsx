"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/supabase/db";
import { DocumentRecord, DocumentInput, DOCUMENT_CATEGORY_LABELS } from "@/types";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentFormModal } from "@/components/documents/DocumentFormModal";
import { Button } from "@/components/ui/Button";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { FileText, Plus, Filter, Shield } from "lucide-react";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category Filter: 'all' or specific category
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getDocuments(user.id);
      setDocuments(data);
    } catch (err) {
      console.error("Error loading documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSave = async (data: DocumentInput, docId?: string) => {
    if (!user) return { error: "يجب تسجيل الدخول أولاً." };

    if (docId) {
      const res = await updateDocument(user.id, docId, data);
      if (res.error || !res.data) {
        return { error: res.error || "تعذر تحديث بيانات الوثيقة." };
      }
      setDocuments((prev) => prev.map((d) => (d.id === docId ? res.data! : d)));
      showToast({ type: "success", title: "تم التعديل", message: "تم تحديث بيانات الوثيقة بنجاح." });
      return { error: null };
    } else {
      const res = await createDocument(user.id, data);
      if (res.error || !res.data) {
        return { error: res.error || "تعذر إضافة الوثيقة." };
      }
      setDocuments((prev) => [res.data!, ...prev]);
      showToast({ type: "success", title: "تمت الإضافة", message: "تم حفظ الوثيقة بأمان." });
      return { error: null };
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("هل أنت متأكد من رغبتك في حذف هذه الوثيقة من أرشيفك؟")) return;

    const original = [...documents];
    setDocuments((prev) => prev.filter((d) => d.id !== id));

    const { success, error } = await deleteDocument(user.id, id);
    if (!success) {
      setDocuments(original);
      showToast({ type: "error", title: "تعذر الحذف", message: error || "حدث خطأ أثناء الحذف." });
    } else {
      showToast({ type: "info", title: "تم الحذف", message: "تم حذف الوثيقة من أرشيفك." });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory === "all") return true;
    return doc.category === selectedCategory;
  });

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري جلب وثائقك المشفرة بأمان..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-text-main flex items-center gap-2">
            <FileText className="w-6 h-6 text-warm-brown" />
            <span>وثائقي وأرشيفي الخاص</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            مساحتك الآمنة والمشفرة لحفظ الهويات، الرخص، العقود وتلقي تنبيهات التجديد في الوقت المناسب.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingDocument(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-float self-start sm:self-auto"
        >
          إضافة وثيقة جديدة
        </Button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-tint-brown/20 text-xs">
        <span className="text-text-muted flex items-center gap-1 pl-2 font-medium">
          <Filter className="w-3.5 h-3.5" /> التصنيف:
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
            selectedCategory === "all"
              ? "bg-warm-brown text-white shadow-xs"
              : "bg-surface text-text-muted hover:text-text-main border border-tint-brown/30"
          }`}
        >
          الكل ({documents.length})
        </button>

        {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([catKey, catLabel]) => {
          const count = documents.filter((d) => d.category === catKey).length;
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                isSelected
                  ? "bg-warm-brown text-white shadow-xs"
                  : "bg-surface text-text-muted hover:text-text-main border border-tint-brown/30"
              }`}
            >
              {catLabel} {count > 0 ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-surface border border-dashed border-tint-brown/40 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-tint-brown text-warm-brown mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-text-main">
            {selectedCategory === "all"
              ? "لم تقم بحفظ أي وثيقة بعد"
              : "لا توجد وثائق في هذا التصنيف حالياً"}
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            احفظ نسخاً واضحة من جوازات السفر، رخص القيادة، أو بطاقات التأمين للوصول إليها بسرعة وأمان.
          </p>
          {selectedCategory === "all" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingDocument(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              أضف أول وثيقة
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={(d) => {
                setEditingDocument(d);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DocumentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDocument(null);
        }}
        userId={user?.id || ""}
        onSave={handleSave}
        initialDocument={editingDocument}
      />
    </div>
  );
}
