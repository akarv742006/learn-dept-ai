import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { AIAssistantDrawer } from './AIAssistantDrawer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased transition-colors duration-200">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Right Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <TopNavbar />

        {/* Main Route Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Floating AI Assistant Chat Drawer */}
      <AIAssistantDrawer />
    </div>
  );
};
