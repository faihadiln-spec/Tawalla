"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { uploadPrivateFile, StorageBucket } from "@/lib/supabase/storage";
import { Button } from "./Button";

interface FileUploadProps {
  bucket: StorageBucket;
  userId: string;
  recordId: string;
  currentFilePath?: string | null;
  onFileUploaded: (filePath: string, file: File) => void;
  onFileRemoved?: () => void;
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeBytes?: number; // default 10MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  userId,
  recordId,
  currentFilePath,
  onFileUploaded,
  onFileRemoved,
  label = "المرفق أو المستند",
  helperText = "يدعم PDF, JPG, PNG بحجم أقصى 10 ميجابايت",
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxSizeBytes = 10 * 1024 * 1024,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(currentFilePath || null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    currentFilePath ? currentFilePath.split("/").pop() || "ملف مرفق" : null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      setUploadError("حجم الملف يتجاوز الحد الأقصى المسموح (10 ميجابايت).");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setSelectedFileName(file.name);

    try {
      const { filePath, error } = await uploadPrivateFile(
        bucket,
        userId,
        recordId || "temp_" + Date.now(),
        file
      );

      if (error || !filePath) {
        setUploadError(error || "تعذر رفع الملف.");
      } else {
        setUploadedPath(filePath);
        onFileUploaded(filePath, file);
      }
    } catch (err: any) {
      setUploadError("حدث خطأ أثناء رفع الملف.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setUploadedPath(null);
    setSelectedFileName(null);
    setUploadError(null);
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  return (
    <div className="space-y-2 text-right">
      {label && <label className="block text-xs font-semibold text-text-main">{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {uploadedPath ? (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tint-green/60 border border-accent-green/30 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-accent-green text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="truncate text-right">
              <p className="font-semibold text-text-main truncate max-w-[200px] sm:max-w-xs">
                {selectedFileName}
              </p>
              <p className="text-[10px] text-accent-green font-medium">تم الحفظ بأمان في سحابة تولّى</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-xl hover:bg-surface text-text-muted hover:text-warm-brown transition-colors"
            title="حذف الملف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : isUploading ? (
        <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-bg-main border border-dashed border-primary-blue/40 text-xs text-primary-blue">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>جاري التشفير والرفع بأمان...</span>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer group flex flex-col items-center justify-center p-5 rounded-2xl bg-surface hover:bg-bg-main border border-dashed border-tint-brown hover:border-primary-blue/60 transition-all duration-200 text-center space-y-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-tint-blue/80 group-hover:bg-tint-blue text-primary-blue flex items-center justify-center transition-colors">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-text-main group-hover:text-primary-blue transition-colors">
              انقر لرفع المستند أو الفاتورة
            </p>
            <p className="text-[11px] text-text-muted">{helperText}</p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-warm-brown pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
