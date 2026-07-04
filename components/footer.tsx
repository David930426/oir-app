import { MapPin, Mail, Phone, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PORTAL_LINKS = [
  { name: 'Notice board', href: '/main/board' },
  { name: 'OIR bulletin', href: '/main/bulletin' },
  { name: 'Resources', href: '/main/resources' },
  { name: 'Organizations', href: '/main/orgs' },
];

const EXTERNAL_LINKS = [
  { name: 'OIR website', href: '#' },
  { name: 'Academic calendar', href: '#' },
  { name: 'Student handbook', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-16">
      <div className="container mx-auto px-4 max-w-6xl pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Typographic lockup */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-brass mb-2">
                Tunghai University
              </p>
              <p className="font-heading text-2xl text-white leading-snug">
                Office of International Relations
              </p>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Official portal for international students at Tunghai University.
              Supporting your academic and campus journey since 1955.
            </p>
          </div>

          {/* Portal */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40">
              Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {PORTAL_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40">
              University
            </h4>
            <ul className="space-y-2.5 text-sm">
              {EXTERNAL_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-40 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40">
              Contact
            </h4>
            <address className="not-italic text-sm space-y-2.5">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brass" />
                <p>
                  No. 1727, Sec. 4, Taiwan Blvd.<br />
                  Xitun District, Taichung City 407224<br />
                  Taiwan (R.O.C.)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brass" />
                <a href="mailto:oir@thu.edu.tw" className="hover:text-white transition-colors">
                  oir@thu.edu.tw
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brass" />
                <a href="tel:+886423590121" className="hover:text-white transition-colors">
                  +886-4-2359-0121
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Printer className="h-4 w-4 shrink-0 text-brass" />
                <span>+886-4-2359-0884</span>
              </div>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Tunghai University Office of International Relations. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
