"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '@/services/gemini';
import { ChatMessage } from '@/types';

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! How can I help you with your university life today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.query) {
        setInput(e.detail.query);
        // We can't easily trigger handleSend here because compute logic is inside the component
        // But we can at least fill the input and set a small timeout to "auto-send" if desired
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If input was set via event and we want to auto-send
    if (input && isOpen && messages.length === 1) {
       const timer = setTimeout(() => handleSend(input), 100);
       return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-100 origin-bottom-right"
          >
            <Card className="shadow-2xl border-border/50 rounded-2xl overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground p-4 space-y-0">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-foreground/90" />
                  OIR AI Assistant
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground rounded-full" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex flex-col bg-card/50 backdrop-blur-sm">
                <div 
                  ref={scrollRef}
                  className="h-100 overflow-y-auto p-4 space-y-4 scroll-smooth"
                >
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted/80 text-foreground rounded-tl-sm border border-border/50'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted/80 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-border/50 text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t bg-background/95 mt-auto">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything..."
                      className="w-full bg-muted/50 hover:bg-muted/80 transition-colors border-transparent focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-full pl-4 pr-12 h-11 text-sm outline-none"
                    />
                    <Button 
                      size="icon" 
                      className="absolute right-1 rounded-full h-9 w-9 shadow-sm hover:scale-105 transition-transform" 
                      onClick={() => handleSend()} 
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 mt-4"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
