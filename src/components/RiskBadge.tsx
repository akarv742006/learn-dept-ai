import React from 'react';
import type { RiskLevel } from '../types/debt';

interface RiskBadgeProps {
  level: RiskLevel | 'Strong' | 'Healthy' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' | 'MODERATE RISK' | string;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const normalized = level.toLowerCase();

  let colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/60';

  if (normalized.includes('critical')) {
    colorClasses = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/60 font-black animate-pulse';
  } else if (normalized.includes('high')) {
    colorClasses = 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/60';
  } else if (normalized.includes('moderate') || normalized.includes('attention') || normalized.includes('yellow')) {
    colorClasses = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60';
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold border ${paddingClass} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{level}</span>
    </span>
  );
};
