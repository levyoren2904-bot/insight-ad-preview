"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-coral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const bgClasses: Record<ToastType, string> = {
  success: "border-teal/30 bg-teal/5",
  error: "border-coral/30 bg-coral/5",
  info: "border-primary/30 bg-primary/5",
};

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed start-1/2 top-6 z-[200] -translate-x-1/2 transition-all duration-300 ${
        visible && !exiting
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg backdrop-blur-sm ${bgClasses[type]}`}
      >
        {icons[type]}
        <span className="text-sm font-medium text-text-primary">{message}</span>
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(onClose, 300);
          }}
          className="ms-2 rounded-full p-1 text-text-muted transition-colors hover:bg-black/5 hover:text-text-primary"
          aria-label="Close"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
