"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to translate Supabase Auth error messages into friendly Arabic
export function translateAuthError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مجدداً.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "هذا البريد الإلكتروني مسجل مسبقاً. يمكنك تسجيل الدخول مباشرة.";
  }
  if (lower.includes("password should be at least")) {
    return "كلمة المرور يجب أن تتكون من ٦ أحرف أو أرقام على الأقل.";
  }
  if (lower.includes("invalid email") || lower.includes("valid email")) {
    return "يرجى إدخال عنوان بريد إلكتروني صالح.";
  }
  if (lower.includes("email not confirmed")) {
    return "يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إلى صندوق الوارد.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "تم إجراء محاولات متكررة. يرجى الانتظار دقيقة واحدة قبل إعادة المحاولة.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "تعذر الاتصال بخدمة المصادقة. يرجى التحقق من اتصالك بالإنترنت.";
  }
  return errorMsg || "حدث خطأ غير متوقع أثناء عملية المصادقة.";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    // Fetch initial active session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (err) {
        console.error("Error checking initial auth session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen to ongoing auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: translateAuthError(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || "") };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: translateAuthError(error.message) };
      }

      // If Supabase has email confirmations enabled, user exists but session may be null
      const requiresConfirmation = !data.session && !!data.user;
      return { error: null, requiresEmailConfirmation: requiresConfirmation };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || "") };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: translateAuthError(error.message) };
      }
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || "") };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        return { error: translateAuthError(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || "") };
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { error: translateAuthError(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || "") };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
