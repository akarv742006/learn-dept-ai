import React from 'react';
import { parentService } from '../services/parentService';

export const ParentProgress: React.FC = () => {
  const overview = parentService.getParentOverview();
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Child Academic Progress: {overview.child.name}</h1>
        <p className="text-xs text-slate-500 mt-1">Detailed performance and subject breakdown.</p>
      </div>
    </div>
  );
};

export const ParentLearningDebt: React.FC = () => {
  const overview = parentService.getParentOverview();
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Child Learning Debt Index: {overview.child.learningDebtIndex} / 100</h1>
        <p className="text-xs text-slate-500 mt-1">Current debt reduced from 72 → 42 after completing recovery.</p>
      </div>
    </div>
  );
};

export const ParentNotifications: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Parent Notifications</h1>
      </div>
    </div>
  );
};

export const ParentProfile: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Parent Account Profile</h1>
      </div>
    </div>
  );
};
