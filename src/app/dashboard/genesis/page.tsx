"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  BrainCircuit, 
  Loader2,
  LayoutGrid,
  ArrowUpRight,
  Edit3,
  MoreHorizontal,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getStrategyAction, generateVisualBriefAction } from "@/modules/pilar1-genesis/actions";
import { getVisualIdentityAction } from "@/modules/pilar7-visual/actions";

export default function GenesisDashboard() {
  const { t, language } = useTranslation();
  const [strategy, setStrategy] = useState<any>(null);
  const [visualIdentity, setVisualIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingVisual, setGeneratingVisual] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [stratRes, visRes] = await Promise.all([
        getStrategyAction(),
        getVisualIdentityAction()
      ]);
      
      if (stratRes.success) setStrategy(stratRes.data);
      if (visRes.success) setVisualIdentity(visRes.data);
      
      setLoading(false);
    }
    loadData();
  }, []);

  const handleGenerateVisual = async () => {
    setGeneratingVisual(true);
    const res = await generateVisualBriefAction(language);
    if (res.success) {
      // Reload visual identity
      const visRes = await getVisualIdentityAction();
      if (visRes.success) setVisualIdentity(visRes.data);
    }
    setGeneratingVisual(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loading Laboratory...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header with Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">{t("genesis.dashboard.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("genesis.dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
           <Link 
             href="/dashboard/genesis/edit"
             className="px-5 py-2.5 bg-white border border-border/50 rounded-xl text-xs font-bold shadow-sm hover:bg-muted transition-all flex items-center gap-2"
           >
             <Edit3 className="w-4 h-4 text-primary" />
             {t("genesis.dashboard.manualEdit")}
           </Link>
           <Link 
             href="/dashboard/genesis/discovery"
             className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/80 transition-all flex items-center gap-2"
           >
             <BrainCircuit className="w-4 h-4" />
             {t("genesis.dashboard.aiDiscovery")}
           </Link>
        </div>
      </div>
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border/50 p-4 rounded-xl shadow-sm relative group overflow-hidden">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("genesis.dashboard.essence")}</h3>
          <p className="text-lg font-bold font-outfit">{strategy?.brandEssence || "—"}</p>
          {strategy?.updatedByMode === "discovery" && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary font-bold">
              <Zap className="w-3 h-3" /> AI Generated
            </div>
          )}
        </div>

        <div className="bg-white border border-border/50 p-4 rounded-xl shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("genesis.dashboard.primaryArchetype")}</h3>
          <p className="text-lg font-bold font-outfit">{strategy?.archetypePrimary || "—"}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{strategy?.archetypeSecondary || "Define secondary archetype in edit mode."}</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2">{t("genesis.dashboard.report")}</h3>
             <p className="text-xs text-muted-foreground leading-snug">{t("genesis.dashboard.reportSubtitle")}</p>
          </div>
          <Link 
            href="/dashboard/genesis/report"
            className="text-[10px] font-bold text-primary flex items-center gap-1.5 group mt-3"
          >
            {t("genesis.dashboard.download")} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Interactive Frameworks Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Golden Circle Visual */}
          <Link 
            href="/dashboard/genesis/edit?tab=golden-circle"
            className="bg-white border border-border/50 rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold font-outfit">{t("genesis.dashboard.goldenCircle")}</h3>
                <p className="text-[10px] text-muted-foreground">{t("genesis.dashboard.goldenCircleSub")}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <div className="relative flex justify-center py-4">
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 border-2 border-primary/10 rounded-full" />
                <div className="absolute inset-4 border-2 border-primary/20 rounded-full" />
                <div className="absolute inset-8 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary">WHY</span>
                </div>
                {/* Labels/Values if exist */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   {(strategy?.goldenCircle as any)?.why && (
                     <div className="absolute top-12 scale-[0.6] opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-xl border border-primary/20 z-20 w-32 text-center">
                        <p className="text-[10px] font-bold text-primary">WHY: {(strategy?.goldenCircle as any).why}</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </Link>

          {/* Brand Key Card */}
          <Link 
            href="/dashboard/genesis/edit?tab=brand-key"
            className="bg-white border border-border/50 rounded-xl p-5 shadow-sm border-l-4 border-l-indigo-500 hover:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold font-outfit">{t("genesis.dashboard.brandKey")}</h3>
                <p className="text-[10px] text-muted-foreground">{t("genesis.dashboard.brandKeySub")}</p>
              </div>
              <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-500">
                <Edit3 className="w-3.5 h-3.5" />
              </div>
            </div>
            
            <div className="space-y-2 mt-2">
              {[
                { label: "Target", value: (strategy?.brandKey as any)?.target || "—" },
                { label: "Insight", value: (strategy?.brandKey as any)?.insight || "—" },
                { label: "Benefits", value: (strategy?.brandKey as any)?.benefits || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                  <span className="text-xs font-bold truncate max-w-[120px]">{item.value}</span>
                </div>
              ))}
            </div>
          </Link>

          {/* Kapferer Identity Prism Card */}
          <div className="bg-neutral-900 text-white border border-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col gap-6 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{t("genesis.dashboard.kapfererPrism")}</h3>
               <Link 
                 href="/dashboard/genesis/edit?tab=kapferer"
                 className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
               >
                 <MoreHorizontal className="w-3.5 h-3.5" />
               </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 relative z-10">
               {[
                 { id: "physique", label: "Physique" },
                 { id: "personality", label: "Personality" },
                 { id: "culture", label: "Culture" },
                 { id: "relationship", label: "Relationship" },
                 { id: "reflection", label: "Reflection" },
                 { id: "selfImage", label: "Self-Image" },
               ].map((item) => (
                 <div key={item.id} className="flex flex-col gap-0.5">
                    <p className="text-[7px] font-black uppercase tracking-widest opacity-30">{item.label}</p>
                    <p className="text-[10px] font-medium line-clamp-1">{(strategy?.kapfererPrism as any)?.[item.id] || "—"}</p>
                 </div>
               ))}
            </div>

            <p className="text-[9px] opacity-40 leading-relaxed relative z-10 group-hover:opacity-60 transition-opacity">
              {t("genesis.dashboard.kapfererPrismSub")}
            </p>
            <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
      </div>

      {/* Visual DNA Bridge */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
           <h2 className="text-sm font-bold font-outfit">{t("genesis.dashboard.visualBridge")}</h2>
           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t("genesis.dashboard.visualBridgeSub")}</p>
        </div>
        
        <div className="bg-white border border-border/50 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center">
           <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                 {visualIdentity?.visualDnaKeywords?.length > 0 ? (
                   visualIdentity.visualDnaKeywords.map((kw: string) => (
                     <span key={kw} className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-[10px] font-bold">
                        {kw}
                     </span>
                   ))
                 ) : (
                   <p className="text-[11px] text-muted-foreground italic">No keywords generated yet. Connect your strategy to visuals.</p>
                 )}
              </div>
              <button 
                onClick={handleGenerateVisual}
                disabled={generatingVisual || !strategy}
                className="bg-neutral-900 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg"
              >
                {generatingVisual ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                {t("genesis.dashboard.generateBrief")}
              </button>
           </div>

           <div className="w-full md:w-64 aspect-video bg-muted rounded-xl border border-border/50 overflow-hidden relative group">
              {visualIdentity?.moodboardUrls?.length > 0 ? (
                <img src={visualIdentity.moodboardUrls[0]} alt="Moodboard" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/50 to-muted">
                   <LayoutGrid className="w-8 h-8 text-muted-foreground/30" />
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t("genesis.dashboard.moodboard")}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Link href="/dashboard/visual" className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
                    Open Visual Hub
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* AI Discovery CTA (Compact) */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden flex items-center justify-between">
        <div className="max-w-md relative z-10">
           <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold font-outfit">{t("genesis.dashboard.deepenStrategy")}</h3>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed">
             {t("genesis.dashboard.deepenStrategySub")}
           </p>
        </div>
        <Link 
          href="/dashboard/genesis/discovery"
          className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all relative z-10"
        >
          {t("genesis.dashboard.openChat")}
        </Link>
        <Sparkles className="absolute right-0 bottom-0 w-32 h-32 text-primary/5 -mr-8 -mb-8" />
      </section>
    </div>
  );
}
