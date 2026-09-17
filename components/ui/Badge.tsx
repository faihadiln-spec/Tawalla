import React from "react";

export type BadgeVariant =
  | "blue"
  | "green"
  | "brown"
  | "neutral"
  | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "blue",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-1.5",
  };

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    blue: {
      container: "bg-tint-blue text-primary-blue border-primary-blue/20",
      dot: "bg-primary-blue",
    },
    green: {
      container: "bg-tint-green text-accent-green border-accent-green/20",
      dot: "bg-accent-green",
    },
    brown: {
      container: "bg-tint-brown text-warm-brown border-warm-brown/25",
      dot: "bg-warm-brown",
    },
    neutral: {
      container: "bg-surface text-text-muted border-tint-brown/40",
      dot: "bg-text-muted",
    },
    warning: {
      container: "bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]/40",
      dot: "bg-[#EA580C]",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border leading-none select-none transition-colors ${sizeStyles[size]} ${current.container} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
