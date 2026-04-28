"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  Sparkles,
  FileText,
  Printer
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getStrategyAction, generateExecutiveSummaryAction } from "@/modules/pilar1-genesis/actions";
import ReactMarkdown from "react-markdown";

export default function GenesisReportPage() {
  const { t, language } = useTranslation();
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getStrategyAction();
      if (res.success) setStrategy(res.data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    const res = await generateExecutiveSummaryAction(language);
    if (res.success) {
      setStrategy((prev: any) => ({ ...prev, executiveSummary: res.data }));
    }
    setGeneratingSummary(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Compiling Report...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 print:p-0 print:max-w-none">
      {/* Header - Hidden in Print */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/genesis" className="p-2 hover:bg-white border border-border/50 rounded-xl transition-all shadow-sm text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Genesis Executive Report</h1>
            <p className="text-xs text-muted-foreground">Laporan strategi lengkap untuk pondasi brand Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="bg-white border border-border text-foreground px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-muted transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Report Paper */}
      <div className="bg-white border border-border/50 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:border-none">
        {/* Cover Section */}
        <div className="bg-neutral-900 text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg italic">N</div>
              <span className="font-outfit font-black tracking-tighter text-xl">NGEBBRAND<span className="text-primary text-[6px] align-top ml-0.5">GENESIS</span></span>
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Strategic Foundation</h2>
            <h1 className="text-5xl font-black font-outfit mb-2">{strategy?.brandName || "Untitled Brand"}</h1>
            <p className="text-lg opacity-60 font-medium italic">"{strategy?.brandMantra || "No mantra set yet."}"</p>
          </div>
        </div>

        <div className="p-12 space-y-16">
          {/* Executive Summary */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> 01. Executive Narrative
              </h3>
              {!strategy?.executiveSummary && (
                <button 
                  onClick={handleGenerateSummary}
                  disabled={generatingSummary}
                  className="text-[10px] font-bold text-primary flex items-center gap-1.5 hover:underline disabled:opacity-50"
                >
                  {generatingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Brand Story
                </button>
              )}
            </div>
            
            {strategy?.executiveSummary ? (
              <div className="prose prose-sm max-w-none prose-neutral">
                <ReactMarkdown>{strategy.executiveSummary}</ReactMarkdown>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center gap-4 bg-muted/20">
                <p className="text-xs text-muted-foreground italic max-w-xs">Narasi eksekutif belum dibuat. Gunakan AI untuk merangkai strategi Anda menjadi cerita brand yang kuat.</p>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={generatingSummary}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2"
                >
                  {generatingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Bentuk Cerita Sekarang
                </button>
              </div>
            )}
          </section>

          {/* Strategic Elements Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">02. Core Essence</h3>
              <div className="p-6 bg-muted/30 rounded-2xl border border-border">
                <p className="font-bold text-lg leading-relaxed">{strategy?.brandEssence || "—"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">03. Tone of Voice</h3>
              <div className="p-6 bg-muted/30 rounded-2xl border border-border">
                <p className="font-bold text-lg leading-relaxed">{strategy?.toneOfVoice || "—"}</p>
              </div>
            </div>
          </section>

          {/* Frameworks */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">04. Strategic Frameworks</h3>
            
            <div className="space-y-12">
              {/* Golden Circle */}
              <div className="border-l-2 border-primary pl-8 py-2">
                <h4 className="text-sm font-bold mb-4">The Golden Circle</h4>
                <div className="grid grid-cols-3 gap-6">
                  {["why", "how", "what"].map(k => (
                    <div key={k}>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">{k}</p>
                      <p className="text-xs leading-relaxed">{(strategy?.goldenCircle as any)?.[k] || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Key */}
              <div className="border-l-2 border-indigo-500 pl-8 py-2">
                <h4 className="text-sm font-bold mb-4">The Brand Key</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                  {Object.entries(strategy?.brandKey || {}).map(([k, v]: any) => (
                    <div key={k}>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">{k.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-xs leading-relaxed">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-8 flex justify-between items-center text-[8px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/10">
          <span>Generated by Ngebbrand AI Genesis Laboratory</span>
          <span>© 2024 AgencyOS - Confidential</span>
        </div>
      </div>
    </div>
  );
}
