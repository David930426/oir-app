import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-blue-500 via-violet-500 to-indigo-500 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden text-slate-900">
      <div className="relative z-10 w-full max-w-md space-y-8 bg-white backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-white/80">
        {children}
      </div>
    </div>
  );
}