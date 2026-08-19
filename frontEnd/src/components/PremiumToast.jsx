import React, { useState, useEffect, useCallback } from 'react';

// Global trigger function to call from anywhere in your app
export const toast = {
  success: (message, options) => window.dispatchEvent(new CustomEvent('trigger-toast', { detail: { type: 'success', message, ...options } })),
  error: (message, options) => window.dispatchEvent(new CustomEvent('trigger-toast', { detail: { type: 'error', message, ...options } })),
  info: (message, options) => window.dispatchEvent(new CustomEvent('trigger-toast', { detail: { type: 'info', message, ...options } })),
};

const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || 5000;

  const triggerExit = useCallback(() => {
    setIsExiting(true);
    // Wait for the exit animation to finish before removing from state
    setTimeout(() => onRemove(toast.id), 400); 
  }, [toast.id, onRemove]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(triggerExit, duration);
    return () => clearTimeout(timer);
  }, [isPaused, duration, triggerExit]);

  // Color mapping for a highly premium, glowing glassmorphism look
  const theme = {
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-500',
      iconBg: 'bg-emerald-500/20',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      text: 'text-emerald-950 dark:text-emerald-50',
      desc: 'text-emerald-800/80 dark:text-emerald-200/80',
      progress: 'bg-emerald-500',
      fa: 'fa-check'
    },
    error: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      icon: 'text-rose-500',
      iconBg: 'bg-rose-500/20',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      text: 'text-rose-950 dark:text-rose-50',
      desc: 'text-rose-800/80 dark:text-rose-200/80',
      progress: 'bg-rose-500',
      fa: 'fa-triangle-exclamation'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-500/20',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      text: 'text-blue-950 dark:text-blue-50',
      desc: 'text-blue-800/80 dark:text-blue-200/80',
      progress: 'bg-blue-500',
      fa: 'fa-circle-info'
    }
  }[toast.type || 'info'];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        pointer-events-auto relative overflow-hidden flex flex-col gap-2 min-w-[320px] max-w-md p-4 rounded-2xl 
        backdrop-blur-xl border bg-white/60 dark:bg-slate-950/60 transition-all duration-400 ease-out
        ${theme.border} ${theme.glow}
        ${isExiting ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-8 fade-in'}
      `}
    >
      <div className="flex items-start gap-3 z-10">
        {/* Animated Icon Container */}
        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${theme.iconBg}`}>
          <i className={`fa-solid ${theme.fa} ${theme.icon} text-sm`}></i>
        </div>

        {/* Content */}
        <div className="flex-1 pt-0.5">
          <h4 className={`text-sm font-semibold tracking-tight ${theme.text}`}>
            {toast.message}
          </h4>
          {toast.description && (
            <p className={`text-xs mt-1 leading-relaxed ${theme.desc}`}>
              {toast.description}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={triggerExit}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          <i className="fa-solid fa-xmark text-xs text-slate-600 dark:text-slate-400"></i>
        </button>
      </div>

      {/* Action Button */}
      {toast.action && (
        <div className="mt-2 pl-11 z-10">
          <button
            onClick={() => {
              toast.action.onClick();
              triggerExit();
            }}
            className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            {toast.action.label}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-slate-200/50 dark:bg-slate-800/50 w-full overflow-hidden">
        <div 
          className={`h-full ${theme.progress} transition-all ease-linear`}
          style={{ 
            width: '100%',
            animation: isPaused ? 'none' : `shrinkToast ${duration}ms linear forwards` 
          }}
        />
      </div>
      
      {/* Required Keyframes for progress bar shrink effect */}
      <style>{`
        @keyframes shrinkToast { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
};

export default function PremiumToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, ...e.detail };
      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener('trigger-toast', handleToast);
    return () => window.removeEventListener('trigger-toast', handleToast);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}