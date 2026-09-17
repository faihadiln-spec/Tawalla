"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { TawallaLogo } from "@/components/brand/TawallaLogo";
import { Button } from "@/components/ui/Button";
import { CalmSpinner } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import {
  LogOut,
  User as UserIcon,
  TrendingDown,
  ShieldCheck,
  FileText,
  Home,
  Settings,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirectTo=${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  const handleSignOut = async () => {
    await signOut();
    showToast({
      type: "info",
      title: "تم تسجيل الخروج",
      message: "ننتظر عودتك دائماً إلى مساحتك في تولّى.",
    });
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <CalmSpinner size="lg" label="جاري التحقق من جلستك في تولّى..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <CalmSpinner size="md" label="جاري تحويلك لصفحة تسجيل الدخول..." />
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "الرئيسية", icon: <Home className="w-4 h-4" /> },
    { href: "/expenses", label: "مصروفاتي", icon: <TrendingDown className="w-4 h-4" /> },
    { href: "/warranties", label: "ضماناتي", icon: <ShieldCheck className="w-4 h-4" /> },
    { href: "/documents", label: "وثائقي", icon: <FileText className="w-4 h-4" /> },
    { href: "/settings", label: "الإعدادات", icon: <Settings className="w-4 h-4" /> },
  ];

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "مستخدم تولّى";

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-arabic text-right pb-16 md:pb-0">
      {/* Authenticated Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-tint-brown/30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="focus:outline-none">
              <TawallaLogo size="sm" showText={true} />
            </Link>

            <nav className="hidden md:flex items-center gap-1 pr-4 border-r border-tint-brown/40">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-bg-main text-primary-blue font-semibold border border-tint-brown/30"
                        : "text-text-muted hover:text-text-main hover:bg-tint-brown/30"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Info & Sign Out */}
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-bg-main border border-tint-brown/30 text-xs text-text-main hover:border-primary-blue/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-tint-blue text-primary-blue flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold hidden sm:inline-block">{displayName}</span>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-warm-brown" />}
              className="text-xs"
            >
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Calm, Native, Touch-friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-tint-brown/40 px-2 py-2 flex items-center justify-around shadow-float">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-primary-blue font-bold bg-tint-blue/40"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block w-full border-t border-tint-brown/20 py-6 text-center text-xs text-text-muted">
        <span>منصة تولّى — مساحتك الشخصية الآمنة لما يهمك</span>
      </footer>
    </div>
  );
}
