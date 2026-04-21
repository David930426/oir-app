import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden text-slate-900">
      {/* Decorative background blobs to complement the logo color */}
      <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-blue-200/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-blue-300/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white">
        {children}
      </div>
    </div>
  );
}