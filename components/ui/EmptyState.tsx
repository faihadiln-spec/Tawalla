import React from "react";
import { FolderPlus } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  tint?: "blue" | "green" | "brown";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  tint = "brown",
  className = "",
}) => {
  const tintStyles = {
    blue: "bg-tint-blue text-primary-blue border-primary-blue/20",
    green: "bg-tint-green text-accent-green border-accent-green/20",
    brown: "bg-tint-brown text-warm-brown border-warm-brown/25",
  };

  return (
    <div
      className={`w-full py-12 px-6 rounded-3xl bg-surface/60 border border-dashed border-tint-brown/40 flex flex-col items-center justify-center text-center space-y-4 ${className}`}
    >
      {/* Icon Squircle */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xs transition-transform duration-300 hover:scale-105 ${tintStyles[tint]}`}
      >
        {icon || <FolderPlus className="w-8 h-8" />}
      </div>

      {/* Typography */}
      <div className="max-w-sm space-y-1.5">
        <h4 className="text-base sm:text-lg font-bold text-text-main tracking-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
