"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/services/api";

export interface UseSessionTimeoutOptions {
  /**
   * Session timeout duration in minutes (default: 60 minutes)
   */
  timeoutMinutes?: number;

  /**
   * Warning modal appears this many minutes before timeout (default: 5 minutes)
   */
  warningMinutes?: number;

  /**
   * Whether to auto-logout on timeout (default: true)
   */
  autoLogout?: boolean;

  /**
   * Activities that reset the inactivity timer (default: mouse, keyboard, touch)
   */
  trackingEvents?: string[];
}

export interface SessionTimeoutState {
  isTimedOut: boolean;
  showWarning: boolean;
  timeUntilWarning: number; // seconds
  timeUntilLogout: number; // seconds
  extendSession: () => Promise<void>;
}

/**
 * Hook for managing session timeouts.
 * Tracks user activity and warns before auto-logout.
 *
 * Usage:
 * ```tsx
 * const session = useSessionTimeout({
 *   timeoutMinutes: 60,
 *   warningMinutes: 5,
 * });
 *
 * if (session.showWarning) {
 *   return <SessionWarningModal {...session} />;
 * }
 * ```
 */
export function useSessionTimeout(
  options: UseSessionTimeoutOptions = {},
): SessionTimeoutState {
  const {
    timeoutMinutes = 60,
    warningMinutes = 5,
    autoLogout = true,
    trackingEvents = ["mousedown", "keydown", "touchstart"],
  } = options;

  const { isAuthenticated, logout } = useAuth();
  const [state, setState] = useState<SessionTimeoutState>({
    isTimedOut: false,
    showWarning: false,
    timeUntilWarning: timeoutMinutes * 60,
    timeUntilLogout: timeoutMinutes * 60,
    extendSession: async () => {},
  });

  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const totalTimeoutSeconds = timeoutMinutes * 60;
  const warningTimeSeconds = warningMinutes * 60;
  const logoutTimeSeconds = totalTimeoutSeconds - warningTimeSeconds;

  // Extended session by calling API and resetting timers
  const extendSession = useCallback(async () => {
    try {
      // Call session-status endpoint to reset server-side activity
      await api<{ isActive: boolean; lastActivityAt: string }>(
        "/auth/session-status",
      );

      // Reset timers
      lastActivityRef.current = Date.now();

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      setState({
        isTimedOut: false,
        showWarning: false,
        timeUntilWarning: totalTimeoutSeconds,
        timeUntilLogout: totalTimeoutSeconds,
        extendSession,
      });

      // Set new timers
      inactivityTimeoutRef.current = setTimeout(() => {
        if (autoLogout) {
          logout();
          setState((prev) => ({
            ...prev,
            isTimedOut: true,
            showWarning: false,
          }));
        }
      }, totalTimeoutSeconds * 1000);

      warningTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          showWarning: true,
        }));

        // Start countdown
        let remaining = warningTimeSeconds;
        countdownIntervalRef.current = setInterval(() => {
          remaining -= 1;
          setState((prev) => ({
            ...prev,
            timeUntilLogout: remaining,
          }));

          if (remaining <= 0) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
          }
        }, 1000);
      }, logoutTimeSeconds * 1000);
    } catch (error) {
      console.error("Failed to extend session:", error);
    }
  }, [
    totalTimeoutSeconds,
    logoutTimeSeconds,
    warningTimeSeconds,
    autoLogout,
    logout,
  ]);

  // Activity listener
  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = (now - lastActivityRef.current) / 1000;

    // Only reset if enough time has passed (debounce)
    if (timeSinceLastActivity > 5) {
      extendSession();
    }
  }, [extendSession]);

  // Initialize timers on mount
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    extendSession();

    // Attach activity listeners
    trackingEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      trackingEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isAuthenticated, extendSession, handleActivity, trackingEvents]);

  return state;
}
