import { MapPin, Mail, Phone, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 pt-12 pb-8 mt-12">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Branding & About */}
        <div className="space-y-4">
          <img
            src="/LogoFull.png"
            alt="Tunghai University OIR"
            className="h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Official portal for international students at Tunghai University.
            Supporting your academic and campus journey since 1955.
          </p>
        </div>
        
        {/* Quick Links */}
        <div className="space-y-4 md:justify-self-center">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                OIR Website
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                Academic Calendar
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Student Handbook
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 md:justify-self-end">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">
            Contact Us
          </h4>
          <address className="not-italic text-sm text-muted-foreground space-y-2.5">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
              <p>
                No. 1727, Sec. 4, Taiwan Blvd.<br />
                Xitun District, Taichung City 407224<br />
                Taiwan (R.O.C.)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-primary/70" />
              <a href="mailto:oir@thu.edu.tw" className="hover:text-primary transition-colors">
                oir@thu.edu.tw
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-primary/70" />
              <a href="tel:+886423590121" className="hover:text-primary transition-colors">
                +886-4-2359-0121
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Printer className="h-4 w-4 shrink-0 text-primary/70" />
              <span>+886-4-2359-0884</span>
            </div>
          </address>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="container mx-auto px-4 max-w-6xl mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Tunghai University Office of International Relations. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
