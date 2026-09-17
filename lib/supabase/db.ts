import { createClient } from "./client";
import {
  Profile,
  Expense,
  ExpenseInput,
  ExpenseStatus,
  Warranty,
  WarrantyInput,
  WarrantyStatus,
  DocumentRecord,
  DocumentInput,
  AttentionItem,
} from "@/types";
import { toArabicDigits, formatArabicDate } from "@/lib/utils/formatters";

// ==============================================================================
// 1. PROFILES
// ==============================================================================
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  // Merge user_metadata if available for seamless persistence
  try {
    const { data: authData } = await supabase.auth.getUser();
    const meta = authData?.user?.user_metadata || {};
    return {
      ...data,
      email_notifications_enabled:
        data.email_notifications_enabled ?? meta.email_notifications_enabled ?? true,
      reminder_days:
        data.reminder_days ?? meta.reminder_days ?? 7,
      notify_warranties:
        data.notify_warranties ?? meta.notify_warranties ?? true,
      notify_documents:
        data.notify_documents ?? meta.notify_documents ?? true,
      notification_email:
        data.notification_email ?? meta.notification_email ?? null,
    } as Profile;
  } catch {
    return data as Profile;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = createClient();

  // 1. Security: exclude read-only fields
  const { id, created_at, ...allowedUpdates } = updates;

  // 2. Persist notification preferences in Supabase Auth user_metadata
  // This guarantees persistence even before database schema migrations are executed
  const notifMeta: Record<string, any> = {};
  if (updates.email_notifications_enabled !== undefined)
    notifMeta.email_notifications_enabled = updates.email_notifications_enabled;
  if (updates.reminder_days !== undefined)
    notifMeta.reminder_days = updates.reminder_days;
  if (updates.notify_warranties !== undefined)
    notifMeta.notify_warranties = updates.notify_warranties;
  if (updates.notify_documents !== undefined)
    notifMeta.notify_documents = updates.notify_documents;
  if (updates.notification_email !== undefined)
    notifMeta.notification_email = updates.notification_email;

  if (Object.keys(notifMeta).length > 0) {
    try {
      await supabase.auth.updateUser({ data: notifMeta });
    } catch (e) {
      console.warn("Could not sync to user_metadata:", e);
    }
  }

  // 3. Attempt update on public.profiles table
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...allowedUpdates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    // If public.profiles table hasn't added the new columns yet (Postgres code 42703),
    // update only standard existing profile fields without crashing
    const baseUpdates: Record<string, any> = {};
    if (updates.full_name !== undefined) baseUpdates.full_name = updates.full_name;
    if (updates.avatar_url !== undefined) baseUpdates.avatar_url = updates.avatar_url;
    if (updates.currency !== undefined) baseUpdates.currency = updates.currency;

    if (Object.keys(baseUpdates).length > 0) {
      await supabase
        .from("profiles")
        .update({ ...baseUpdates, updated_at: new Date().toISOString() })
        .eq("id", userId);
    }

    // Return the updated data merged cleanly with the updates
    return {
      data: {
        id: userId,
        full_name: updates.full_name || "",
        currency: updates.currency || "SAR",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates,
      } as Profile,
      error: null,
    };
  }

  return { data: data as Profile, error: null };
}

// ==============================================================================
// 2. EXPENSES (مصروفاتي)
// ==============================================================================
export async function getExpenses(userId: string): Promise<Expense[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("amount", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
  return (data || []) as Expense[];
}

export async function createExpense(
  userId: string,
  input: ExpenseInput
): Promise<{ data: Expense | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        user_id: userId,
        title: input.title.trim(),
        amount: Number(input.amount),
        billing_cycle: input.billing_cycle || "monthly",
        category: input.category,
        status: input.status || "active",
        billing_day: input.billing_day || null,
        notes: input.notes?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating expense:", error);
    return { data: null, error: "تعذر حفظ المصروف الجديد. تأكد من صحة البيانات المدخلة." };
  }
  return { data: data as Expense, error: null };
}

export async function updateExpense(
  userId: string,
  expenseId: string,
  updates: Partial<ExpenseInput>
): Promise<{ data: Expense | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", expenseId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    return { data: null, error: "تعذر تحديث المصروف." };
  }
  return { data: data as Expense, error: null };
}

export async function updateExpenseStatus(
  userId: string,
  expenseId: string,
  status: ExpenseStatus
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("expenses")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", expenseId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating expense status:", error);
    return { success: false, error: "تعذر تعديل حالة المصروف في السلة." };
  }
  return { success: true, error: null };
}

export async function deleteExpense(
  userId: string,
  expenseId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "تعذر حذف المصروف." };
  }
  return { success: true, error: null };
}

// ==============================================================================
// 3. WARRANTIES (ضماناتي)
// ==============================================================================
export function calculateWarrantyStatus(endDateStr: string): WarrantyStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDateStr);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "expiring_soon";
  return "active";
}

export async function getWarranties(userId: string): Promise<Warranty[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("warranties")
    .select("*")
    .eq("user_id", userId)
    .order("warranty_end_date", { ascending: true });

  if (error) {
    console.error("Error fetching warranties:", error.message || error);
    return [];
  }

  // Dynamically update status based on date
  return (data || []).map((w: any) => ({
    ...w,
    status: w.status === "claimed" ? "claimed" : calculateWarrantyStatus(w.warranty_end_date),
  })) as Warranty[];
}

export async function createWarranty(
  userId: string,
  input: WarrantyInput
): Promise<{ data: Warranty | null; error: string | null }> {
  const supabase = createClient();
  const calculatedStatus = calculateWarrantyStatus(input.warranty_end_date);

  const { data, error } = await supabase
    .from("warranties")
    .insert([
      {
        user_id: userId,
        product_name: input.product_name.trim(),
        vendor: input.vendor?.trim() || null,
        purchase_date: input.purchase_date || null,
        warranty_start_date: input.warranty_start_date || null,
        warranty_end_date: input.warranty_end_date,
        duration_months: input.duration_months || null,
        status: calculatedStatus,
        invoice_file_url: input.invoice_file_url || null,
        warranty_card_url: input.warranty_card_url || null,
        notes: input.notes?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating warranty:", error);
    return { data: null, error: "تعذر حفظ الضمان الجديد." };
  }
  return { data: data as Warranty, error: null };
}

export async function updateWarranty(
  userId: string,
  warrantyId: string,
  updates: Partial<WarrantyInput> & { status?: WarrantyStatus }
): Promise<{ data: Warranty | null; error: string | null }> {
  const supabase = createClient();
  const payload: any = { ...updates, updated_at: new Date().toISOString() };
  if (updates.warranty_end_date && updates.status !== "claimed") {
    payload.status = calculateWarrantyStatus(updates.warranty_end_date);
  }

  const { data, error } = await supabase
    .from("warranties")
    .update(payload)
    .eq("id", warrantyId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: "تعذر تحديث بيانات الضمان." };
  }
  return { data: data as Warranty, error: null };
}

export async function deleteWarranty(
  userId: string,
  warrantyId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("warranties")
    .delete()
    .eq("id", warrantyId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "تعذر حذف الضمان." };
  }
  return { success: true, error: null };
}

// ==============================================================================
// 4. DOCUMENTS (وثائقي)
// ==============================================================================
export async function getDocuments(userId: string): Promise<DocumentRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("expiry_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching documents:", error.message || error);
    return [];
  }
  return (data || []) as DocumentRecord[];
}

export async function createDocument(
  userId: string,
  input: DocumentInput
): Promise<{ data: DocumentRecord | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        user_id: userId,
        title: input.title.trim(),
        category: input.category,
        document_number: input.document_number?.trim() || null,
        issue_date: input.issue_date || null,
        expiry_date: input.expiry_date || null,
        reminder_days_before: input.reminder_days_before || 30,
        file_url: input.file_url || null,
        file_type: input.file_type || null,
        file_size_bytes: input.file_size_bytes || null,
        notes: input.notes?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    return { data: null, error: "تعذر إضافة الوثيقة. يرجى مراجعة البيانات." };
  }
  return { data: data as DocumentRecord, error: null };
}

export async function updateDocument(
  userId: string,
  documentId: string,
  updates: Partial<DocumentInput>
): Promise<{ data: DocumentRecord | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", documentId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: "تعذر تحديث بيانات الوثيقة." };
  }
  return { data: data as DocumentRecord, error: null };
}

export async function deleteDocument(
  userId: string,
  documentId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "تعذر حذف الوثيقة." };
  }
  return { success: true, error: null };
}

// ==============================================================================
// 5. ATTENTION SYSTEM (يحتاج انتباهك قريباً)
// ==============================================================================
export function calculateAttentionItems(
  warranties: Warranty[],
  documents: DocumentRecord[]
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check Warranties expiring within 30 days or expired
  warranties.forEach((w) => {
    if (w.status === "claimed") return;
    const endDate = new Date(w.warranty_end_date);
    endDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 30 && diffDays >= 0) {
      const daysText =
        diffDays === 1
          ? "يوم واحد"
          : diffDays === 2
          ? "يومان"
          : diffDays <= 10
          ? `${toArabicDigits(diffDays)} أيام`
          : `${toArabicDigits(diffDays)} يوماً`;

      items.push({
        id: `warranty-${w.id}`,
        type: "warranty_expiring",
        title: `ضمان «${w.product_name}» ينتهي قريباً`,
        subtitle:
          diffDays === 0
            ? "ينتهي اليوم!"
            : `متبقي ${daysText} على انتهاء الضمان`,
        daysRemaining: diffDays,
        date: w.warranty_end_date,
        severity: "soon",
        href: "/warranties",
      });
    } else if (diffDays < 0 && diffDays >= -30) {
      const absDays = Math.abs(diffDays);
      const daysText =
        absDays === 1
          ? "يوم واحد"
          : absDays === 2
          ? "يومين"
          : absDays <= 10
          ? `${toArabicDigits(absDays)} أيام`
          : `${toArabicDigits(absDays)} يوماً`;

      items.push({
        id: `warranty-${w.id}`,
        type: "warranty_expiring",
        title: `ضمان «${w.product_name}» منتهي`,
        subtitle: `انتهت صلاحية الضمان منذ ${daysText}`,
        daysRemaining: diffDays,
        date: w.warranty_end_date,
        severity: "expired",
        href: "/warranties",
      });
    }
  });

  // Check Documents expiring within their reminder period or expired
  documents.forEach((d) => {
    if (!d.expiry_date) return;
    const expiryDate = new Date(d.expiry_date);
    expiryDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const reminderDays = d.reminder_days_before || 30;

    if (diffDays <= reminderDays && diffDays >= 0) {
      const daysText =
        diffDays === 1
          ? "يوم واحد"
          : diffDays === 2
          ? "يومان"
          : diffDays <= 10
          ? `${toArabicDigits(diffDays)} أيام`
          : `${toArabicDigits(diffDays)} يوماً`;

      items.push({
        id: `doc-${d.id}`,
        type: "document_expiring",
        title: `وثيقة «${d.title}» قاربت على الانتهاء`,
        subtitle:
          diffDays === 0
            ? "تنتهي اليوم!"
            : `متبقي ${daysText} على تاريخ الانتهاء`,
        daysRemaining: diffDays,
        date: d.expiry_date,
        severity: "soon",
        href: "/documents",
      });
    } else if (diffDays < 0) {
      items.push({
        id: `doc-${d.id}`,
        type: "document_expiring",
        title: `وثيقة «${d.title}» منتهية الصلاحية`,
        subtitle: `انتهت بتاريخ ${formatArabicDate(d.expiry_date)}`,
        daysRemaining: diffDays,
        date: d.expiry_date,
        severity: "expired",
        href: "/documents",
      });
    }
  });

  // Sort by urgency (lowest days remaining first)
  return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
