"use client";

import { useState } from "react";
import { Cpu, Database, Eye, ShieldAlert, Sparkles, Terminal } from "lucide-react";
import { CortexChat } from "./CortexChat";
import { BrandContextViewer } from "./BrandContextViewer";
import { useTranslation } from "@/lib/i18n";

interface CortexDashboardWrapperProps {
  brandContext: any;
  experts: any[];
}

export function CortexDashboardWrapper({ brandContext, experts }: CortexDashboardWrapperProps) {
  const { t } = useTranslation();
  const [selectedExpert, setSelectedExpert] = useState(experts[0]?.id || "aaker");
  
  const currentExpert = experts.find(e => e.id === selectedExpert) || experts[0];

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold font-outfit">{t("cortex.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("cortex.subtitle")}</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border border-border/50 rounded-lg px-3 py-1.5 shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("cortex.expert")}:</span>
            <select 
              value={selectedExpert}
              onChange={(e) => setSelectedExpert(e.target.value)}
              className="text-xs font-bold bg-transparent border-none focus:ring-0 outline-none cursor-pointer text-primary"
            >
              {experts.map(expert => (
                <option key={expert.id} value={expert.id}>
                  {expert.emoji} {expert.name}
                </option>
              ))}
            </select>
          </div>
          <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/80 transition-all shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {t("cortex.fineTune")}
          </button>
        </div>
      </header>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "LLM Core", status: "Online", model: "OpenRouter Gateway", icon: Cpu, color: "text-green-500", bg: "bg-green-50" },
          { name: "Vision AI", status: "Online", model: "Brand Vision API", icon: Eye, color: "text-green-500", bg: "bg-green-50" },
          { name: "Knowledge Base", status: "Synced", model: "Vector DB (RAG)", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
          { name: "Security", status: "Protected", model: "PII Masking Active", icon: ShieldAlert, color: "text-indigo-500", bg: "bg-indigo-50" }
        ].map((sys) => (
          <div key={sys.name} className="bg-white border border-border/50 rounded-xl p-3 flex items-start gap-3 shadow-sm hover:border-primary/30 transition-all">
            <div className={`p-2 rounded-lg ${sys.bg} ${sys.color}`}>
              <sys.icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">{sys.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sys.model}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${sys.status === 'Online' || sys.status === 'Synced' || sys.status === 'Protected' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{sys.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Context Viewer */}
        <div className="h-[600px]">
          <BrandContextViewer data={brandContext} />
        </div>

        {/* Chat Playground */}
        <div className="lg:col-span-2 bg-white border border-border/50 rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-3 border-b border-border/50 flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold">{t("cortex.playground")}</h2>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                 Channeling: {currentExpert?.name}
               </span>
               <span className="text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                 Context Aware
               </span>
            </div>
          </div>
          
          <CortexChat context={{
            brandEssence: brandContext?.strategy?.brandEssence || brandContext?.brandEssence,
            archetype: brandContext?.strategy?.archetypePrimary || brandContext?.brandArchetype,
            expert: currentExpert?.name
          }} />
        </div>
      </div>
    </div>
  );
}
