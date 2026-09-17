"use client";

import React, { useState } from "react";
import { TawallaLogo } from "../brand/TawallaLogo";
import { Button } from "./Button";
import { Menu, X, ArrowLeft } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  badge?: string;
  badgeVariant?: "blue" | "green" | "brown";
  href?: string;
}

export interface NavigationProps {
  currentPath?: string;
  onNavigate?: (id: string) => void;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath = "home",
  onNavigate,
  ctaText = "ابدأ مع تولّى",
  onCtaClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "home", label: "الرئيسية" },
    { id: "expenses", label: "مصروفاتي", badge: "السلة", badgeVariant: "blue" },
    { id: "warranties", label: "ضماناتي" },
    { id: "documents", label: "وثائقي" },
  ];

  const handleItemClick = (id: string) => {
    if (onNavigate) onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <nav className="max-w-6xl mx-auto bg-surface/90 backdrop-blur-md border border-tint-brown/30 rounded-3xl shadow-soft px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleItemClick("home")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/30 rounded-xl"
            aria-label="الصفحة الرئيسية لتولّى"
          >
            <TawallaLogo size="sm" showText={true} />
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 pr-4 border-r border-tint-brown/40">
            {navItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-bg-main text-primary-blue shadow-xs"
                      : "text-text-muted hover:text-text-main hover:bg-tint-brown/30"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        item.badgeVariant === "blue"
                          ? "bg-tint-blue text-primary-blue"
                          : "bg-tint-green text-accent-green"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-blue inline-block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={onCtaClick}
            rightIcon={<ArrowLeft className="w-3.5 h-3.5 rotate-180 md:rotate-0" />}
            className="hidden sm:inline-flex"
          >
            {ctaText}
          </Button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-tint-brown/40 transition-colors"
            aria-label="فتح القائمة"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-surface rounded-3xl shadow-float border border-tint-brown/30 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-tint-blue text-primary-blue font-semibold"
                      : "text-text-muted hover:text-text-main hover:bg-bg-main"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-tint-blue text-primary-blue font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-tint-brown/30">
            <Button
              fullWidth
              size="md"
              variant="primary"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
