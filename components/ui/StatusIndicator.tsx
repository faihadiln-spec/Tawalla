import React from "react";

export type StatusType =
  | "active"
  | "expiring"
  | "expired"
  | "saved"
  | "excluded";

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  withPing?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  withPing = false,
  className = "",
}) => {
  const statusConfig: Record<
    StatusType,
    { defaultLabel: string; dotColor: string; pingColor: string; textColor: string; bgColor: string }
  > = {
    active: {
      defaultLabel: "نشط / ساري",
      dotColor: "bg-accent-green",
      pingColor: "bg-accent-green/40",
      textColor: "text-accent-green",
      bgColor: "bg-tint-green/60",
    },
    expiring: {
      defaultLabel: "ينتهي قريباً",
      dotColor: "bg-[#EA580C]",
      pingColor: "bg-[#EA580C]/40",
      textColor: "text-[#C2410C]",
      bgColor: "bg-[#FFF7ED]",
    },
    expired: {
      defaultLabel: "منتهي",
      dotColor: "bg-text-muted",
      pingColor: "bg-text-muted/30",
      textColor: "text-text-muted",
      bgColor: "bg-tint-brown/40",
    },
    saved: {
      defaultLabel: "وفر محقق",
      dotColor: "bg-accent-green",
      pingColor: "bg-accent-green/40",
      textColor: "text-accent-green",
      bgColor: "bg-tint-green",
    },
    excluded: {
      defaultLabel: "مستبعد للتجربة",
      dotColor: "bg-warm-brown",
      pingColor: "bg-warm-brown/30",
      textColor: "text-warm-brown",
      bgColor: "bg-tint-brown",
    },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {withPing && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pingColor}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}
        />
      </span>
      <span>{displayLabel}</span>
    </div>
  );
};
