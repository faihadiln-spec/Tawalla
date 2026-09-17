import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isLtrType =
      props.type === "email" ||
      props.type === "password" ||
      props.type === "tel" ||
      props.type === "url";

    return (
      <div className="w-full space-y-1.5 text-right">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-text-muted tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-text-muted">
              {rightIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            dir={props.dir || (isLtrType ? "ltr" : undefined)}
            className={`w-full bg-surface text-text-main text-sm rounded-2xl border transition-all duration-200 placeholder:text-text-muted/60 focus:outline-none focus:ring-2 disabled:bg-bg-main disabled:opacity-60 ${
              isLtrType ? "text-left" : ""
            } ${
              rightIcon ? "pr-10" : "pr-4"
            } ${leftIcon ? "pl-10" : "pl-4"} py-3 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-tint-brown/40 focus:border-primary-blue focus:ring-primary-blue/20"
            } ${className}`}
            {...props}
          />

          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
