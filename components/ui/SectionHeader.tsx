import React from "react";
import { Badge, BadgeVariant } from "./Badge";

export interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "right" | "center";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = "blue",
  title,
  subtitle,
  action,
  align = "right",
  className = "",
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 ${
        isCenter ? "text-center items-center" : "text-right"
      } ${className}`}
    >
      <div className={`space-y-3 max-w-3xl ${isCenter ? "mx-auto" : ""}`}>
        {badgeText && (
          <div>
            <Badge variant={badgeVariant} size="md">
              {badgeText}
            </Badge>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-main leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 pt-2 md:pt-0">{action}</div>}
    </div>
  );
};
