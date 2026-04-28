"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Trash2, 
  Check, 
  Loader2,
  Send,
  History,
  LayoutGrid,
  Type,
  PenTool,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { generateCopyAction, getCopiesAction, deleteCopyAction } from "@/modules/pilar3-expression/actions";
import { getStrategyAction } from "@/modules/pilar1-genesis/actions";

export default function AIBrandWriter() {
  const { t, language } = useTranslation();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<any>("instagram");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copies, setCopies] = useState<any[]>([]);
  const [strategy, setStrategy] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [copyRes, stratRes] = await Promise.all([
        getCopiesAction(),
        getStrategyAction()
      ]);
      if (copyRes.success) setCopies(copyRes.data || []);
      if (stratRes.success) setStrategy(stratRes.data);
    }
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const res = await generateCopyAction({
      topic,
      platform,
      language
    });
    
    if (res.success) {
      setCopies(prev => [res.data, ...prev]);
      setTopic("");
    } else {
      alert(res.error);
    }
    setIsGenerating(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus konten ini?")) {
      const res = await deleteCopyAction(id);
      if (res.success) {
        setCopies(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const platforms = [
    { id: "instagram", name: "Instagram", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "linkedin", name: "LinkedIn", icon: <Type className="w-4 h-4" /> },
    { id: "tiktok", name: "TikTok", icon: <PenTool className="w-4 h-4" /> },
    { id: "website", name: "Website", icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8">
      {/* Header */}
      <header className="p-4 border-b border-border/50 bg-white/50 backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="font-bold font-outfit text-xl flex items-center gap-2">
              {t("expression.writerTitle")} <Sparkles className="w-4 h-4 text-primary fill-primary" />
            </h2>
            <p className="text-xs text-muted-foreground">{t("expression.writerSubtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {strategy && (
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-primary uppercase tracking-wider">DNA: {strategy.brandName}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar History */}
        <aside className="w-80 border-r border-border/50 bg-white/30 overflow-y-auto hidden lg:block">
          <div className="p-4 sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/30 z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <History className="w-4 h-4" /> {t("fortress.scanHistory")}
            </h3>
          </div>
          
          <div className="p-2 space-y-2">
            {copies.map((copy) => (
              <button 
                key={copy.id}
                onClick={() => {}} // Could scroll to or highlight
                className="w-full text-left p-3 rounded-xl hover:bg-white border border-transparent hover:border-border/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase">{copy.platform}</span>
                  <span className="text-[9px] text-muted-foreground">{new Date(copy.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs font-medium line-clamp-2 text-foreground/80">{copy.title || copy.content.substring(0, 50)}</p>
              </button>
            ))}
            {copies.length === 0 && (
              <div className="p-8 text-center opacity-30 mt-10">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-tighter">Belum ada riwayat</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col bg-muted/20">
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Generation Input */}
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all border ${
                        platform === p.id 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-white hover:border-border/50"
                      }`}
                    >
                      {p.icon}
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t("expression.placeholder")}
                    className="w-full min-h-[120px] p-4 bg-muted/30 rounded-2xl border-2 border-transparent focus:border-primary/30 focus:bg-white transition-all resize-none text-sm font-medium"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-bold">{topic.length} characters</span>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !topic}
                      className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 group"
                    >
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Stream (Latest first) */}
              <div className="space-y-6 pb-20">
                {copies.map((copy) => (
                  <div 
                    key={copy.id}
                    className="bg-white rounded-3xl border border-border/50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="p-4 border-b border-border/30 bg-muted/10 flex justify-between items-center px-6">
                      <div className="flex items-center gap-3">
                         <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                           {copy.platform}
                         </span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">{copy.tone || "Brand DNA Tone"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopy(copy.content, copy.id)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-all text-muted-foreground hover:text-primary flex items-center gap-2 text-[10px] font-bold"
                        >
                          {copiedId === copy.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === copy.id ? "Copied" : "Copy"}
                        </button>
                        <button 
                          onClick={() => handleDelete(copy.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-all text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-8 prose prose-sm max-w-none prose-p:leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">
                      {copy.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
