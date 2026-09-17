import React from "react";
import { Loader2 } from "lucide-react";

export const CalmSpinner: React.FC<{ size?: "sm" | "md" | "lg"; label?: string }> = ({
  size = "md",
  label = "جاري التحميل...",
}) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3 text-primary-blue select-none">
      <Loader2 className={`${sizeMap[size]} animate-spin`} />
      {label && <span className="text-xs text-text-muted font-medium">{label}</span>}
    </div>
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 2, className = "" }) => {
  return (
    <div className={`space-y-2.5 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded-full animate-shimmer ${
            i === lines - 1 && lines > 1 ? "w-3/5" : "w-full"
          }`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`p-6 rounded-3xl bg-surface border border-tint-brown/30 shadow-soft space-y-4 w-full ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl animate-shimmer" />
        <div className="w-20 h-5 rounded-full animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="w-2/3 h-4 rounded-md animate-shimmer" />
        <div className="w-1/2 h-3 rounded-md animate-shimmer" />
      </div>
      <div className="pt-4 border-t border-tint-brown/20 flex justify-between items-center">
        <div className="w-16 h-3 rounded-md animate-shimmer" />
        <div className="w-24 h-6 rounded-xl animate-shimmer" />
      </div>
    </div>
  );
};
