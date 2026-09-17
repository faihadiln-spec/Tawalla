import React from "react";

interface TawallaLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  withContainer?: boolean;
}

export const TawallaIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="شعار تولّى"
    >
      {/* Blue Document Card (وثائقي) */}
      <g transform="translate(62, 44) rotate(-3)">
        {/* Main Card with Folded Top-Right Corner */}
        <path
          d="M 10 0 
             L 42 0 
             L 56 14 
             L 56 70 
             C 56 76, 51 80, 45 80 
             L 11 80 
             C 5 80, 0 76, 0 70 
             L 0 10 
             C 0 4, 5 0, 10 0 Z"
          fill="#5C86C0"
        />
        {/* Folded Corner Triangle */}
        <path
          d="M 42 0 L 42 14 L 56 14 Z"
          fill="#E8EFF8"
          opacity="0.9"
        />
        {/* Document Profile / Avatar Mark */}
        <circle cx="28" cy="28" r="8" fill="#FFFFFF" />
        <path
          d="M 16 52 C 16 43, 21 39, 28 39 C 35 39, 40 43, 40 52 Z"
          fill="#FFFFFF"
        />
        {/* Information Lines */}
        <rect x="18" y="56" width="20" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.9" />
        <rect x="18" y="63" width="14" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8" />
      </g>

      {/* Green Currency Card (مصروفاتي / ضماناتي) */}
      <g transform="translate(108, 62) rotate(14)">
        {/* Card Body */}
        <rect
          x="0"
          y="0"
          width="48"
          height="58"
          rx="9"
          fill="#7A9B7C"
        />
        {/* White Inset Border/Frame */}
        <rect
          x="4"
          y="4"
          width="40"
          height="50"
          rx="6"
          stroke="#EAF1EA"
          strokeWidth="1.8"
          fill="none"
          opacity="0.85"
        />
        {/* Currency / Riyal Symbol Stamp */}
        <circle cx="24" cy="29" r="11" fill="#EAF1EA" />
        {/* Stylized Emblem in center */}
        <path
          d="M 24 21 L 24 37 M 20 25 L 28 25 M 19 32 L 27 32"
          stroke="#7A9B7C"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* The Warm Brown Pouch (الحقيبة الحاضنة - #AA8573) */}
      {/* Left / Main Body of the Pouch */}
      <path
        d="M 46 80 
           C 42 81, 39 85, 41 90 
           L 47 122 
           C 51 144, 70 152, 94 152 
           L 124 152 
           C 127 152, 129 150, 129 147 
           L 115 106 
           C 114 103, 112 101, 109 100 
           L 54 81 
           C 51 80, 48 80, 46 80 Z"
        fill="#AA8573"
      />

      {/* Right Flap of the Pouch */}
      <path
        d="M 120 106 
           L 134 146 
           C 135 148, 137 150, 140 148 
           C 152 142, 160 126, 162 108 
           C 163 103, 160 98, 155 99 
           L 125 105 
           C 123 105, 121 105, 120 106 Z"
        fill="#9B7766"
      />

      {/* Subtle bottom shadow line */}
      <path
        d="M 58 153 C 78 158, 122 158, 142 153"
        stroke="#AA8573"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
};

export const TawallaLogo: React.FC<TawallaLogoProps> = ({
  size = "md",
  showText = true,
  subtitle,
  className = "",
  withContainer = false,
}) => {
  const sizeMap = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  };

  const pixelSize = typeof size === "number" ? size : sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      <div className="relative shrink-0 transition-transform duration-300 hover:scale-105">
        <TawallaIcon size={pixelSize} />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span
              className="font-bold tracking-tight text-text-main leading-none"
              style={{ fontSize: `${Math.max(18, pixelSize * 0.44)}px` }}
            >
              تولّى
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block mb-1" />
          </div>
          {subtitle && (
            <span className="text-xs text-text-muted mt-1 leading-snug">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (withContainer) {
    return (
      <div className="p-2.5 rounded-2xl bg-surface shadow-soft border border-tint-brown/30 inline-block">
        {content}
      </div>
    );
  }

  return content;
};
