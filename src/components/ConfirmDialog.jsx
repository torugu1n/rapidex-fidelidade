import React from 'react';
import { AlertTriangle, Trash2, CheckCircle, X, Info } from 'lucide-react';

export default function ConfirmDialog({ config, onClose }) {
  if (!config) return null;

  const { title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', type = 'danger', onConfirm } = config;

  const handleConfirm = () => {
    onClose();
    if (onConfirm) onConfirm();
  };

  const icons = {
    danger:  <Trash2 className="w-6 h-6 text-rose-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    success: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    info:    <Info className="w-6 h-6 text-isp-accent" />,
  };

  const confirmStyles = {
    danger:  'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20',
    info:    'bg-isp-accent hover:bg-isp-accent/90 text-white shadow-isp-accent/20',
  };

  const iconBg = {
    danger:  'bg-rose-500/10 dark:bg-rose-500/15',
    warning: 'bg-amber-500/10 dark:bg-amber-500/15',
    success: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    info:    'bg-isp-accent/10 dark:bg-isp-accent/15',
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative bg-white dark:bg-isp-navy w-full max-w-sm rounded-2xl border border-slate-200 dark:border-isp-border shadow-2xl z-10 animate-slideUp overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-isp-border/30 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-4">
          {/* Icon + Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${iconBg[type]}`}>
              {icons[type]}
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 dark:text-isp-muted leading-relaxed pl-1">
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-isp-border/40 hover:bg-slate-50 dark:hover:bg-isp-border/20 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${confirmStyles[type]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
