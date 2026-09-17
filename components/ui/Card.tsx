import React from "react";

export type CardVariant =
  | "default"
  | "elevated"
  | "tinted-blue"
  | "tinted-green"
  | "tinted-brown"
  | "interactive";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative rounded-3xl transition-all duration-300 text-right overflow-hidden";

    const paddingStyles = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const variantStyles: Record<CardVariant, string> = {
      default:
        "bg-surface text-text-main shadow-soft border border-tint-brown/30",
      elevated:
        "bg-surface text-text-main shadow-float border border-tint-brown/20",
      "tinted-blue":
        "bg-tint-blue text-text-main border border-primary-blue/20 shadow-soft",
      "tinted-green":
        "bg-tint-green text-text-main border border-accent-green/20 shadow-soft",
      "tinted-brown":
        "bg-tint-brown text-text-main border border-warm-brown/20 shadow-soft",
      interactive:
        "bg-surface text-text-main shadow-soft border border-tint-brown/30 hover:border-primary-blue/40 hover:shadow-float hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]",
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3
    className={`text-lg font-bold text-text-main tracking-tight leading-snug ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className = "", ...props }) => (
  <p className={`text-xs text-text-muted leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`mt-6 pt-4 border-t border-tint-brown/30 flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);
