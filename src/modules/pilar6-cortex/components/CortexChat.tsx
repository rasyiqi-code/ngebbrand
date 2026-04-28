"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, Loader2 } from "lucide-react";
import { chatWithCortexAction } from "../actions";
import { useTranslation } from "@/lib/i18n";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface BrandContext {
  brandEssence?: string;
  archetype?: string;
  expert?: string;
}

export function CortexChat({ context }: { context: BrandContext }) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatWithCortexAction(newMessages, {
        currentPage: "Cortex Dashboard",
        brandEssence: context.brandEssence,
        archetype: context.archetype,
        expert: context.expert,
        language,
      });

      if (result.success) {
        setMessages([...newMessages, { role: "assistant", content: result.content }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${result.error}` }]);
      }
    } catch (error: any) {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 space-y-2 py-10">
            <BrainCircuit className="w-8 h-8" />
            <p className="text-xs">{t("cortex.startChat")}</p>
            <p className="text-[10px] text-center max-w-[200px]">{t("cortex.chatHint")}</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${
              msg.role === "user" 
                ? "bg-muted/30 border border-border/50" 
                : "bg-primary/5 border border-primary/20 shadow-sm"
            } rounded-lg p-3 text-xs animate-in fade-in slide-in-from-bottom-1`}
          >
            <div className={`w-6 h-6 rounded-md flex flex-shrink-0 items-center justify-center font-bold ${
              msg.role === "user" ? "bg-primary text-white shadow-sm" : "bg-white border border-border"
            }`}>
              {msg.role === "user" ? "U" : <BrainCircuit className="w-3.5 h-3.5 text-primary" />}
            </div>
            <div className="flex-1">
              <p className={`font-bold mb-1 ${msg.role === "user" ? "text-foreground" : "text-primary"}`}>
                {msg.role === "user" ? t("cortex.you") : `AI Co-Strategist (${context.expert || "David Aaker"})`}
              </p>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[10px]">{t("cortex.thinking")}</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border/50 bg-white">
        <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-lg p-1.5 focus-within:border-primary/50 focus-within:bg-white transition-all">
          <input 
            type="text" 
            placeholder={t("cortex.placeholder")}
            className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none px-2 py-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white p-2 rounded-md hover:bg-primary/80 transition-all disabled:opacity-50 shadow-sm active:scale-95"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
