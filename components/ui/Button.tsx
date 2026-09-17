import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "green"
  | "brown"
  | "outline"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: calm, rounded, responsive micro-interaction
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    // Size variants
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-3.5 py-1.5 rounded-xl gap-1.5 min-h-[34px]",
      md: "text-sm px-5 py-2.5 rounded-2xl gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3.5 rounded-2xl gap-2.5 min-h-[50px]",
    };

    // Color semantic variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-primary-blue text-white shadow-soft hover:brightness-105 active:brightness-95 hover:shadow-float",
      secondary:
        "bg-tint-blue text-primary-blue border border-primary-blue/20 hover:bg-tint-blue/80",
      green:
        "bg-accent-green text-white shadow-soft hover:brightness-105 active:brightness-95 hover:shadow-float",
      brown:
        "bg-warm-brown text-white shadow-soft hover:brightness-105 active:brightness-95",
      outline:
        "bg-surface text-text-main border border-tint-brown/40 hover:border-primary-blue/40 hover:bg-bg-main shadow-soft",
      ghost:
        "bg-transparent text-text-muted hover:text-text-main hover:bg-tint-brown/40",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
