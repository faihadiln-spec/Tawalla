import { createClient } from "./client";

export type StorageBucket = "user-documents" | "warranty-invoices";

export interface UploadResult {
  filePath: string | null;
  error: string | null;
  publicUrl?: string | null;
}

/**
 * Sanitizes a filename to prevent invalid characters in Supabase Storage paths
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

/**
 * Generates the standard Tawalla file path:
 * {user_id}/{year}/{record_id}_{sanitized_filename}
 */
export function generateFilePath(
  userId: string,
  recordId: string,
  filename: string
): string {
  const currentYear = new Date().getFullYear().toString();
  const cleanName = sanitizeFilename(filename);
  return `${userId}/${currentYear}/${recordId}_${cleanName}`;
}

/**
 * Uploads a file to a private Supabase Storage bucket
 */
export async function uploadPrivateFile(
  bucket: StorageBucket,
  userId: string,
  recordId: string,
  file: File
): Promise<UploadResult> {
  const supabase = createClient();
  const filePath = generateFilePath(userId, recordId, file.name);

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { filePath: null, error: "تعذر رفع الملف إلى مساحتك الآمنة. يرجى المحاولة لاحقاً." };
    }

    return { filePath, error: null };
  } catch (err: any) {
    console.error("Unexpected upload error:", err);
    return { filePath: null, error: err?.message || "حدث خطأ غير متوقع أثناء الرفع." };
  }
}

/**
 * Creates a temporary signed URL to safely view or download a private file
 */
export async function getSignedFileUrl(
  bucket: StorageBucket,
  filePath: string,
  expiresInSeconds: number = 3600 // 1 hour default
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return { url: null, error: "تعذر توليد رابط المعاينة الآمن." };
    }

    return { url: data.signedUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || "خطأ أثناء جلب الملف." };
  }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deletePrivateFile(
  bucket: StorageBucket,
  filePath: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      return { success: false, error: "تعذر حذف الملف من التخزين." };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || "حدث خطأ أثناء الحذف." };
  }
}
