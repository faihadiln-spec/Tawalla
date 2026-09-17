-- ==============================================================================
-- TAWALLA (تولّى) — Database Schema & Row Level Security (RLS)
-- Phase 05 & Phase 11: Database Tables, Storage Buckets, Triggers, and RLS
-- ==============================================================================

-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  currency TEXT NOT NULL DEFAULT 'SAR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, currency)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'SAR'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. EXPENSES (مصروفاتي)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  category TEXT NOT NULL CHECK (category IN ('entertainment', 'health', 'digital', 'convenience', 'utilities', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'excluded', 'cancelled')),
  billing_day INTEGER CHECK (billing_day >= 1 AND billing_day <= 31),
  icon_key TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_expenses_user_status ON public.expenses(user_id, status);

DROP POLICY IF EXISTS "Users can select own expenses" ON public.expenses;
CREATE POLICY "Users can select own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
CREATE POLICY "Users can insert own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;
CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);


-- 3. WARRANTIES (ضماناتي)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  vendor TEXT,
  purchase_date DATE,
  warranty_start_date DATE,
  warranty_end_date DATE NOT NULL,
  duration_months INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expiring_soon', 'expired', 'claimed')),
  invoice_file_url TEXT,
  warranty_card_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_warranties_user_end_date ON public.warranties(user_id, warranty_end_date);

DROP POLICY IF EXISTS "Users can select own warranties" ON public.warranties;
CREATE POLICY "Users can select own warranties"
  ON public.warranties FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own warranties" ON public.warranties;
CREATE POLICY "Users can insert own warranties"
  ON public.warranties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own warranties" ON public.warranties;
CREATE POLICY "Users can update own warranties"
  ON public.warranties FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own warranties" ON public.warranties;
CREATE POLICY "Users can delete own warranties"
  ON public.warranties FOR DELETE
  USING (auth.uid() = user_id);


-- 4. DOCUMENTS (وثائقي)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('identity', 'vehicle', 'property', 'health_ins', 'contract', 'personal')),
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  reminder_days_before INTEGER DEFAULT 30,
  file_url TEXT,
  file_type TEXT,
  file_size_bytes BIGINT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_documents_user_expiry ON public.documents(user_id, expiry_date);

DROP POLICY IF EXISTS "Users can select own documents" ON public.documents;
CREATE POLICY "Users can select own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);


-- 5. SUPABASE STORAGE BUCKETS & POLICIES (Phase 11)
-- ------------------------------------------------------------------------------
-- Create private storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('user-documents', 'user-documents', false),
  ('warranty-invoices', 'warranty-invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Ensure user can only read/write files in their own folder ({user_id}/...)
DROP POLICY IF EXISTS "Users can access their own document files" ON storage.objects;
CREATE POLICY "Users can access their own document files"
  ON storage.objects FOR ALL
  USING (
    bucket_id IN ('user-documents', 'warranty-invoices') 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id IN ('user-documents', 'warranty-invoices') 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
