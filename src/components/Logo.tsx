import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'auto',
  className = ''
}) => {
  const iconSizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const iconInnerClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const titleClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  // Force luminous white text when on dark backgrounds (like Sidebar or Login hero)
  const mainTextColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  const subtitleColor =
    variant === 'light'
      ? 'text-slate-300 font-semibold'
      : variant === 'dark'
      ? 'text-slate-500 font-semibold'
      : 'text-slate-500 dark:text-slate-400 font-semibold';

  return (
    <div className={`flex items-center gap-3 font-sans select-none ${className}`}>
      <div className={`${iconSizeClass} rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0 relative overflow-hidden ring-1 ring-white/20`}>
        <BookOpen className={`${iconInnerClass} relative z-10 text-white`} />
        {/* Subtle luminous glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className={`font-black tracking-tight ${titleClass} ${mainTextColor} flex items-center gap-1.5`}>
            <span>LearnDebt</span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-black drop-shadow-xs">
              AI
            </span>
          </div>
          <span className={`text-[10px] tracking-wider uppercase block mt-0.5 ${subtitleColor}`}>
            Learning Debt Detection
          </span>
        </div>
      )}
    </div>
  );
};
