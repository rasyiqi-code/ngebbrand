"use client";

import { Database, Zap, Target, Quote } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface BrandContextViewerProps {
  data: any;
}

export function BrandContextViewer({ data }: BrandContextViewerProps) {
  const { t } = useTranslation();
  const strategy = data?.strategy;
  const visual = data?.visual;

  if (!strategy && !visual) {
    return (
      <div className="bg-white border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col h-full items-center justify-center p-10 text-muted-foreground italic text-xs text-center">
        <Database className="w-8 h-8 mb-3 opacity-20" />
        <p>No active brand context found.<br/>Please define your strategy in Genesis Lab.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col h-full hover:border-primary/30 transition-all group">
      <div className="p-3 border-b border-border/50 flex items-center gap-2 bg-muted/10">
        <Database className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold">{t("cortex.activeContext")}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Core Identity */}
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-500" /> Core DNA
          </h3>
          <div className="space-y-3">
             <div className="bg-muted/30 p-2 rounded-lg border border-border/50 group-hover:bg-white transition-all">
               <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Brand Essence</p>
               <p className="text-xs font-bold text-foreground">{strategy?.brandEssence || "Not set"}</p>
             </div>
             <div className="bg-muted/30 p-2 rounded-lg border border-border/50 group-hover:bg-white transition-all">
               <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Archetype</p>
               <p className="text-xs font-bold text-foreground">{strategy?.archetypePrimary || "Not set"}</p>
             </div>
          </div>
        </div>

        {/* Visual DNA */}
        {(visual?.visualDnaKeywords?.length > 0) && (
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-blue-500" /> Visual Identity
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {visual.visualDnaKeywords.map((kw: string) => (
                <span key={kw} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase border border-primary/20">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tone of Voice */}
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Quote className="w-3 h-3 text-indigo-500" /> Voice & Tone
          </h3>
          <div className="bg-muted/20 p-3 rounded-lg border border-dashed border-border/60">
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "{strategy?.toneOfVoice || "No tone of voice defined yet in Pillar 1."}"
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-secondary text-white text-[9px] font-bold uppercase tracking-widest text-center">
        Workspace: {strategy?.brandName || "Hening Coffee"}
      </div>
    </div>
  );
}
