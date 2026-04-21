"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, LogIn, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, login, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Notice Board', path: '/board' },
    { name: 'Bulletin', path: '/bulletin' },
    { name: 'Resources', path: '/resources' },
    { name: 'Organizations', path: '/orgs' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleAccountClick = () => {
    if (!isAuthenticated) return;
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/profile');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
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
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span>Translate</span>
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.role === 'student' ? `ID: ${user?.studentId}` : user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAccountClick}>
                    {user?.role === 'admin' ? 'Admin Portal' : 'My Account'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive font-medium">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button size="sm" className="gap-2 shrink-0" />}>
                  <LogIn className="h-4 w-4" />
                  Account
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sign in for Demo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => login('student')}>
                    Login as Student
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => login('admin')}>
                    Login as Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && (
              <Avatar className="h-8 w-8 border border-primary/20" onClick={handleAccountClick}>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <button onClick={() => setIsOpen(!isOpen)}>
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
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm" onClick={() => login('student')}>Student Login</Button>
                   <Button variant="outline" size="sm" onClick={() => login('admin')}>Admin Login</Button>
                </div>
              ) : (
                <Button variant="destructive" onClick={logout}>Logout</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
