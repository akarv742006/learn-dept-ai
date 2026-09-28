import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizeClass = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const iconInnerClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const titleClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';

  return (
    <div className="flex items-center gap-2.5 font-sans select-none">
      <div className={`${iconSizeClass} rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 shrink-0 relative overflow-hidden`}>
        <BookOpen className={`${iconInnerClass} relative z-10 text-white`} />
        {/* Subtle Neural Network Node Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className={`font-black tracking-tight text-slate-900 dark:text-white ${titleClass} flex items-center gap-1`}>
            <span>LearnDebt</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase block">
            Learning Debt Detection
          </span>
        </div>
      )}
    </div>
  );
};
