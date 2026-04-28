"use client";

import { useState } from "react";
import { 
  Send, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  History,
  BrainCircuit,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { sendDiscoveryMessage, resetStrategyAction, getDiscoveryLogsAction } from "@/modules/pilar1-genesis/actions";
import { useTranslation } from "@/lib/i18n";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  suggestedOptions?: string[];
}

export default function DiscoveryChat() {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch history on mount
  useEffect(() => {
    async function loadHistory() {
      const res = await getDiscoveryLogsAction();
      if (res.success && res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          {
            id: "greeting",
            role: "ai",
            content: t("genesis.discovery.greeting"),
            timestamp: new Date(),
          },
        ]);
      }
    }
    loadHistory();
  }, [t]);

  const handleSendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Call Server Action
    const result = await sendDiscoveryMessage(newMessages.map(m => ({
      role: m.role,
      content: m.content
    })), language);

    setIsLoading(false);

    if (result.success) {
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: result.content || "...",
        timestamp: new Date(),
        suggestedOptions: result.suggestedOptions
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // If successful, show sync indicator
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 3000);
    } else {
      // Handle error
      alert(result.error || "Gagal mendapatkan respon dari AI Strategist.");
      console.error(result.error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8">
      {/* Chat Header */}
      <header className="glass p-4 border-b border-border/50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/genesis" className="p-2 hover:bg-white/5 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="font-bold font-outfit flex items-center gap-2">
              {t("cortex.challenger")} <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase">P1 Genesis</span>
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {t("cortex.strategistActive")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSyncing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full animate-in fade-in zoom-in duration-300">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-600 uppercase">Strategy Synced</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/genesis/history"
              className="p-2 hover:bg-white/10 rounded-full transition-all text-muted-foreground hover:text-primary"
              title="View History"
            >
              <History className="w-5 h-5" />
            </Link>
            <button 
              onClick={async () => {
                if (confirm("Apakah Anda yakin ingin menghapus percakapan ini? SELURUH DATA strategi brand yang tersimpan akan dikosongkan.")) {
                  await resetStrategyAction();
                  setMessages([{
                    id: "greeting",
                    role: "ai",
                    content: t("genesis.discovery.greeting"),
                    timestamp: new Date(),
                  }]);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-all text-muted-foreground hover:text-red-500"
              title="Reset Strategy"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('/grid.svg')] bg-center opacity-90">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`p-2 rounded-xl ${msg.role === "ai" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {msg.role === "ai" ? <BrainCircuit className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className={`max-w-2xl px-6 py-4 rounded-[2rem] ${
              msg.role === "ai" 
                ? "bg-white border border-border/50 text-foreground shadow-sm" 
                : "bg-secondary text-white shadow-lg shadow-secondary/10"
            }`}>
              <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${msg.role === "user" ? "prose-invert" : ""}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {msg.role === "ai" && msg.suggestedOptions && msg.suggestedOptions.length > 0 && idx === messages.length - 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {msg.suggestedOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(opt)}
                      disabled={isLoading}
                      className="text-[11px] px-3 py-1.5 bg-primary/5 hover:bg-primary/20 border border-primary/20 rounded-full text-primary transition-all active:scale-95 whitespace-nowrap"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] mt-2 block opacity-50">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div className="bg-white border border-border/50 px-6 py-4 rounded-[2rem] flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground italic">{t("cortex.thinking")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-8 pt-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto relative">
          <textarea 
            className="w-full bg-muted/30 border border-border/50 rounded-[1.5rem] p-4 pr-32 min-h-[80px] max-h-[200px] text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
            placeholder={t("cortex.placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-primary transition-all">
              <Sparkles className="w-5 h-5" />
            </button>
            <button 
              className="bg-primary p-2.5 rounded-xl text-white hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSendMessage()}
              disabled={!input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest">
          {t("cortex.disclaimer")}
        </p>
      </div>
    </div>
  );
}
