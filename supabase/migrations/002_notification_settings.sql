-- ==============================================================================
-- TAWALLA (تولّى) — Database Migration: 002_notification_settings.sql
-- Adds email notification preferences and timing for warranties & documents
-- ==============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reminder_days INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS notify_warranties BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_documents BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_email TEXT;

COMMENT ON COLUMN public.profiles.email_notifications_enabled IS 'Whether the user wants to receive email alerts before expiration';
COMMENT ON COLUMN public.profiles.reminder_days IS 'Number of days before expiration to trigger the email alert (0 means بدون تنبيه)';
COMMENT ON COLUMN public.profiles.notify_warranties IS 'Whether to send alerts for expiring product warranties';
COMMENT ON COLUMN public.profiles.notify_documents IS 'Whether to send alerts for expiring personal documents';
COMMENT ON COLUMN public.profiles.notification_email IS 'Optional alternative email address to receive alerts; defaults to auth email if null';
