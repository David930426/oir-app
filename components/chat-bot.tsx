"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '@/services/gemini';
import { ChatMessage } from '@/types';

export default function ChatBot() {
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 transition-transform active:scale-95"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-87.5 sm:w-100"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground p-4 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  OIR AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/20 text-primary-foreground" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  ref={scrollRef}
                  className="h-100 overflow-y-auto p-4 space-y-4 scroll-smooth"
                >
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted text-muted-foreground rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-2xl rounded-tl-none animate-pulse text-xs text-muted-foreground">
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about mail, ARC, scholarships..."
                    className="flex-1 bg-muted rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
                  />
                  <Button size="icon" className="rounded-full h-10 w-10" onClick={() => handleSend()} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
