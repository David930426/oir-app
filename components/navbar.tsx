"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Home', path: '/main' },
    { name: 'Notice Board', path: '/main/board' },
    { name: 'Bulletin', path: '/main/bulletin' },
    { name: 'Resources', path: '/main/resources' },
    { name: 'Organizations', path: '/main/orgs' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          <Link href="/main" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="h-14 w-auto flex items-center">
              <img 
                src="/Logo.png" 
                alt="Tunghai University OIR" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col border-l pl-3 border-primary/20">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary opacity-60 leading-none mb-1">Office of</span>
              <span className="text-sm font-black uppercase tracking-widest text-primary leading-none">International Relations</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary underline underline-offset-8' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="outline" size="sm" className="gap-2 hover:cursor-pointer">
              <Globe className="h-4 w-4" />
              <span>Translate</span>
            </Button>
            <Button size="sm" className="gap-2 hover:cursor-pointer" onClick={() => router.push('/login')}>
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="hover:cursor-pointer">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium ${
                    isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr />
              <Button className="w-full gap-2 hover:cursor-pointer" onClick={() => {
                setIsOpen(false);
                router.push('/login');
              }}>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
