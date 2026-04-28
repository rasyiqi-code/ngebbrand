"use client";

import { useState, useRef, useEffect } from "react";
import {
  BrainCircuit,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import { chatWithCortexAction } from "@/modules/pilar6-cortex/actions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EXPERTS = [
  { id: "aaker", name: "David Aaker", emoji: "📊", title: "Brand Identity" },
  { id: "kapferer", name: "Kapferer", emoji: "💎", title: "Identity Prism" },
  { id: "keller", name: "Kevin Keller", emoji: "🏔️", title: "Resonance" },
  { id: "sinek", name: "Simon Sinek", emoji: "🎯", title: "Start With Why" },
  { id: "neumeier", name: "Neumeier", emoji: "⚡", title: "Brand Gap" },
];

const QUICK_PROMPTS = [
  "Analisis diferensiasi merek saya",
  "Evaluasi positioning statement saya",
  "Apa kelemahan brand identity saya?",
  "Bagaimana meningkatkan brand resonance?",
];

export function AICortexSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState("aaker");
  const [showExpertPicker, setShowExpertPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const currentExpert = EXPERTS.find((e) => e.id === selectedExpert)!;

  async function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const chatMessages = newMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const result = await chatWithCortexAction(chatMessages, {
      currentPage: typeof window !== "undefined" ? window.location.pathname : "/dashboard",
      expert: currentExpert.name,
    });

    if (result.success) {
      setMessages([...newMessages, { role: "assistant", content: result.content }]);
    } else {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Maaf, terjadi kesalahan. Silakan coba lagi." },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-secondary text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center group"
          title="AI Co-Strategist"
        >
          <BrainCircuit className="w-5 h-5 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Sidebar Panel */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[380px] h-[560px] bg-white border border-border/60 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/40 bg-secondary text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold">AI Co-Strategist</h3>
                <p className="text-[9px] opacity-70">Powered by OpenRouter</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-md transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Expert Selector */}
          <div className="px-3 py-2 border-b border-border/30 bg-muted/20">
            <div className="relative">
              <button
                onClick={() => setShowExpertPicker(!showExpertPicker)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-border/40 text-xs hover:border-primary/40 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>{currentExpert.emoji}</span>
                  <span className="font-bold">{currentExpert.name}</span>
                  <span className="text-muted-foreground text-[9px]">• {currentExpert.title}</span>
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showExpertPicker ? "rotate-180" : ""}`} />
              </button>

              {showExpertPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border/40 rounded-lg shadow-lg z-10 py-1">
                  {EXPERTS.map((expert) => (
                    <button
                      key={expert.id}
                      onClick={() => {
                        setSelectedExpert(expert.id);
                        setShowExpertPicker(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-muted/50 transition-all ${
                        expert.id === selectedExpert ? "bg-primary/5 text-primary font-bold" : ""
                      }`}
                    >
                      <span>{expert.emoji}</span>
                      <span className="font-medium">{expert.name}</span>
                      <span className="text-muted-foreground text-[9px] ml-auto">{expert.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold mb-1">Halo! Saya {currentExpert.name}.</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Tanyakan apa saja tentang strategi merek Anda. Saya akan memberikan perspektif berdasarkan teori saya.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-col gap-1.5 w-full">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-3 py-2 rounded-lg border border-border/40 bg-muted/20 text-[10px] hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] px-3 py-2 rounded-lg text-[11px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-secondary text-white"
                        : "bg-muted/30 border border-border/30 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-secondary" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-muted/30 border border-border/30 px-3 py-2 rounded-lg">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-3 py-2.5 border-t border-border/40 bg-muted/10">
            <div className="flex items-center gap-2 bg-white border border-border/40 rounded-lg p-1 focus-within:border-primary/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 bg-transparent border-none text-xs outline-none px-2 py-1"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-md bg-primary text-white hover:bg-primary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
