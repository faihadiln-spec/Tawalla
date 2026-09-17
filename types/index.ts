// Tawalla Core Types & Interfaces

export type AppPath = 'expenses' | 'warranties' | 'documents';

// ==========================================
// 1. Profiles
// ==========================================
export interface Profile {
  id: string; // References auth.users(id)
  full_name: string;
  avatar_url?: string | null;
  currency: string; // default "SAR"
  created_at: string;
  updated_at: string;
}

// ==========================================
// 2. Expenses (مصروفاتي)
// ==========================================
export type ExpenseBillingCycle = 'monthly' | 'yearly';

export type ExpenseCategory =
  | 'entertainment'
  | 'health'
  | 'digital'
  | 'convenience'
  | 'utilities'
  | 'other';

export type ExpenseStatus = 'active' | 'excluded' | 'cancelled';

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number; // must be > 0
  billing_cycle: ExpenseBillingCycle;
  category: ExpenseCategory;
  status: ExpenseStatus;
  billing_day?: number | null;
  icon_key?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  billing_cycle: ExpenseBillingCycle;
  category: ExpenseCategory;
  status?: ExpenseStatus;
  billing_day?: number | null;
  notes?: string | null;
}

// ==========================================
// 3. Warranties (ضماناتي)
// ==========================================
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'claimed';

export interface Warranty {
  id: string;
  user_id: string;
  product_name: string;
  vendor?: string | null;
  purchase_date?: string | null;
  warranty_start_date?: string | null;
  warranty_end_date: string;
  duration_months?: number | null;
  status: WarrantyStatus;
  invoice_file_url?: string | null;
  warranty_card_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WarrantyInput {
  product_name: string;
  vendor?: string | null;
  purchase_date?: string | null;
  warranty_start_date?: string | null;
  warranty_end_date: string;
  duration_months?: number | null;
  invoice_file_url?: string | null;
  warranty_card_url?: string | null;
  notes?: string | null;
}

// ==========================================
// 4. Documents (وثائقي)
// ==========================================
export type DocumentCategory =
  | 'identity'
  | 'vehicle'
  | 'property'
  | 'health_ins'
  | 'contract'
  | 'personal';

export interface DocumentRecord {
  id: string;
  user_id: string;
  title: string;
  category: DocumentCategory;
  document_number?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  reminder_days_before?: number | null; // e.g. 30, 60, 90
  file_url?: string | null;
  file_type?: string | null;
  file_size_bytes?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentInput {
  title: string;
  category: DocumentCategory;
  document_number?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  reminder_days_before?: number | null;
  file_url?: string | null;
  file_type?: string | null;
  file_size_bytes?: number | null;
  notes?: string | null;
}

// ==========================================
// 5. Command Center Attention Items
// ==========================================
export type AttentionItemType = 'warranty_expiring' | 'document_expiring';

export interface AttentionItem {
  id: string;
  type: AttentionItemType;
  title: string;
  subtitle: string;
  daysRemaining: number;
  date: string;
  severity: 'calm' | 'soon' | 'expired';
  href: string;
}

// ==========================================
// 6. Category Metadata Helpers
// ==========================================
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  entertainment: 'ترفيه',
  health: 'صحة ولياقة',
  digital: 'تقنية',
  convenience: 'خدمات وتوصيل',
  utilities: 'فواتير واشتراكات',
  other: 'أخرى',
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  identity: 'هوية وجوازات',
  vehicle: 'مركبات ورخص',
  property: 'عقارات وسكن',
  health_ins: 'تأمين صحي',
  contract: 'عقود واتفاقيات',
  personal: 'وثائق شخصية',
};

export const WARRANTY_STATUS_LABELS: Record<
  WarrantyStatus,
  { label: string; variant: 'green' | 'brown' | 'blue' | 'neutral' }
> = {
  active: { label: 'ساري', variant: 'green' },
  expiring_soon: { label: 'ينتهي قريباً', variant: 'brown' },
  expired: { label: 'منتهي', variant: 'neutral' },
  claimed: { label: 'تمت المطالبة', variant: 'blue' },
};
