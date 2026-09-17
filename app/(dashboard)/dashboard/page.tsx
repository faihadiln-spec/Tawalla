"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getExpenses,
  getWarranties,
  getDocuments,
  getProfile,
  calculateAttentionItems,
} from "@/lib/supabase/db";
import { Expense, Warranty, DocumentRecord, Profile, AttentionItem } from "@/types";
import { AttentionSystem } from "@/components/dashboard/AttentionSystem";
import { PortalCards } from "@/components/dashboard/PortalCards";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { Sparkles, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const loadUserData = async () => {
      setIsLoadingData(true);
      try {
        const [profData, expData, warData, docData] = await Promise.all([
          getProfile(user.id),
          getExpenses(user.id),
          getWarranties(user.id),
          getDocuments(user.id),
        ]);

        if (isMounted) {
          setProfile(profData);
          setExpenses(expData);
          setWarranties(warData);
          setDocuments(docData);

          const items = calculateAttentionItems(warData, docData);
          setAttentionItems(items);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoadingData) {
    return (
      <div className="py-24 flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري تنظيم لوحة تحكمك الشخصية..." />
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "صديق تولّى";

  const activeExpenses = expenses.filter((e) => e.status === "active");
  const monthlyExpensesTotal = activeExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const expiringWarranties = warranties.filter(
    (w) => w.status === "expiring_soon" || w.status === "expired"
  );
  const expiringDocuments = attentionItems.filter((item) => item.type === "document_expiring");

  return (
    <div className="space-y-10 text-right">
      {/* 1. Personalized Greeting & Command Center Banner */}
      <div className="p-7 sm:p-9 rounded-3xl bg-surface border border-tint-brown/30 shadow-soft space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-tint-blue text-primary-blue border border-primary-blue/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مركز القيادة الشخصي</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-main">
            أهلاً بك، {displayName} ✨
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-2xl font-normal">
            مساحتك الخاصة لمتابعة ما يهمك من مصاريف وضمانات ووثائق في مكان واحد هادئ ومنظم.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-text-muted border-t border-tint-brown/20">
          <span className="flex items-center gap-1.5 font-medium text-text-main">
            <CheckCircle2 className="w-4 h-4 text-accent-green" /> مساحة مشفرة وخاصة
          </span>
          <span className="flex items-center gap-1.5 font-medium text-text-muted">
            <Calendar className="w-4 h-4 text-warm-brown" /> اليوم:{" "}
            {new Date().toLocaleDateString("ar-SA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* 2. Attention System (Items expiring soon) */}
      <AttentionSystem items={attentionItems} />

      {/* 3. The Three Portals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
          <span>المسارات الأساسية الثلاثة</span>
          <span>اختر مساراً للمعاينة والتعديل</span>
        </div>

        <PortalCards
          monthlyExpensesTotal={monthlyExpensesTotal}
          activeExpensesCount={activeExpenses.length}
          warrantiesCount={warranties.length}
          expiringWarrantiesCount={expiringWarranties.length}
          documentsCount={documents.length}
          expiringDocumentsCount={expiringDocuments.length}
        />
      </div>
    </div>
  );
}
