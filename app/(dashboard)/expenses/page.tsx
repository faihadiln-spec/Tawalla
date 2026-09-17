"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getExpenses } from "@/lib/supabase/db";
import { Expense } from "@/types";
import { InteractiveBasket } from "@/components/basket/InteractiveBasket";
import { CalmSpinner } from "@/components/ui/LoadingState";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadExpenses = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getExpenses(user.id);
      setExpenses(data);
    } catch (err) {
      console.error("Error loading expenses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [user]);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري تجهيز سلتك التفاعلية..." />
      </div>
    );
  }

  return (
    <div>
      <InteractiveBasket
        userId={user?.id || ""}
        initialExpenses={expenses}
        onRefresh={loadExpenses}
      />
    </div>
  );
}
