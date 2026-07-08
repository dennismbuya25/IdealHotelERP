import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/80 px-6 py-4 text-sm shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="text-slate-600 dark:text-slate-400">
          © 2024 Ideal Hotel ERP. All rights reserved.
        </div>
        <div className="mt-2 text-slate-600 dark:text-slate-400 md:mt-0">
          Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">Bibe Tech Solutions</span>
        </div>
      </div>
    </footer>
  );
}