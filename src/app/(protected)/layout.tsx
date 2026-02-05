"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { useSessionTimeout } from "@/hooks/use-session-timeout";
import { SessionWarningModal } from "@/components/auth/session-warning-modal";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const sessionTimeout = useSessionTimeout({
    timeoutMinutes: 60, // 1 hour of inactivity
    warningMinutes: 5, // Warn 5 minutes before
    autoLogout: true,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
      <SessionWarningModal {...sessionTimeout} />
    </div>
  );
}
