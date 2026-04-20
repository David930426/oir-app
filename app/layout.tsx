import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import ChatBot from "@/components/ai/ChatBot";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Tunghai OIR | Office of International Relations",
  description: "Official portal for international students at Tunghai University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="border-t bg-muted/50 py-12 mt-12">
              <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Tunghai OIR</h3>
                  <p className="text-sm text-muted-foreground">
                    Official portal for international students at Tunghai University. 
                    Supporting your journey since 1955.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">OIR Website</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Academic Calendar</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Student Handbook</a></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider">Contact</h4>
                  <address className="not-italic text-sm text-muted-foreground space-y-1">
                    <p>No. 1727, Sec. 4, Taiwan Blvd.</p>
                    <p>Xitun District, Taichung City</p>
                    <p>Email: oir@thu.edu.tw</p>
                  </address>
                </div>
              </div>
              <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-xs text-muted-foreground font-mono">
                &copy; {new Date().getFullYear()} Tunghai University Office of International Relations
              </div>
            </footer>
            
            <ChatBot />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
