"use client";

import { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Clock, 
  Download, 
  Settings, 
  ChevronRight,
  Lock,
  Tag,
  Palette
} from "lucide-react";

interface AssetDetailModalProps {
  asset: any;
  onClose: () => void;
  onOpenRules: () => void;
  onOpenUse: () => void;
}

export function AssetDetailModal({ asset, onClose, onOpenRules, onOpenUse }: AssetDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "rules">("overview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white border border-border/60 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
        
        {/* Left Side: Preview */}
        <div className="w-full md:w-1/2 bg-neutral-50 flex flex-col items-center justify-center p-12 relative border-b md:border-b-0 md:border-r border-border/40">
           <button onClick={onClose} className="absolute top-6 left-6 p-2 hover:bg-white rounded-full transition-all md:hidden">
              <X className="w-5 h-5 text-muted-foreground" />
           </button>

           <div className="w-full aspect-square bg-white rounded-3xl shadow-xl shadow-neutral-200 border border-border/40 flex items-center justify-center relative overflow-hidden group">
              <ShieldCheck className="w-20 h-20 text-primary/10 group-hover:scale-110 transition-all duration-500" />
              {asset.isLocked && (
                <div className="absolute top-4 right-4 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                  <Lock className="w-4 h-4" />
                </div>
              )}
           </div>

           <div className="mt-8 text-center">
              <h2 className="text-xl font-black font-outfit tracking-tight truncate max-w-[300px]">{asset.name}</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{asset.type} • {asset.size}</p>
           </div>

           <div className="absolute bottom-8 flex gap-3">
              <button 
                onClick={onOpenUse}
                className="bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-primary" /> {asset.isLocked ? "Use Asset" : "Download"}
              </button>
           </div>
        </div>

        {/* Right Side: Tabs & Info */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
           <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex gap-4">
                 {(['overview', 'history', 'rules'] as const).map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${
                       activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                     }`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-all hidden md:block">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-8">
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Metadata & Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                         {asset.tags.map((tag: string) => (
                           <span key={tag} className="px-3 py-1 rounded-lg bg-muted/50 border border-border/50 text-[10px] font-bold text-muted-foreground">
                             {tag}
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Palette className="w-3 h-3" /> AI Color Extraction
                      </h4>
                      <div className="flex gap-3">
                         {asset.aiColors && asset.aiColors.length > 0 ? (
                            asset.aiColors.map((c: any, i: number) => (
                              <div key={i} className="flex flex-col items-center gap-2">
                                 <div className="w-10 h-10 rounded-xl shadow-sm border border-border/40" style={{ backgroundColor: c.hex }} />
                                 <span className="text-[9px] font-mono font-bold">{c.hex}</span>
                              </div>
                            ))
                         ) : (
                           <p className="text-[10px] text-muted-foreground italic">No colors extracted.</p>
                         )}
                      </div>
                   </div>

                   <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={onOpenRules}>
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                           <Settings className="w-5 h-5" />
                         </div>
                         <div>
                            <h3 className="text-xs font-bold text-indigo-900">Brand Governance</h3>
                            <p className="text-[10px] text-indigo-700/70">Configure how this asset can be used by others.</p>
                         </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                     <Clock className="w-3 h-3" /> Audit Trail (Last 20 Actions)
                   </h4>
                   <div className="flex flex-col gap-3">
                      {asset.auditLogs && asset.auditLogs.length > 0 ? (
                        asset.auditLogs.map((log: any) => (
                          <div key={log.id} className="p-4 rounded-xl border border-border/40 flex items-center justify-between text-xs">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-bold capitalize">{log.action}</span>
                                <span className="text-muted-foreground">• {log.format || 'original'}</span>
                             </div>
                             <span className="text-[9px] text-muted-foreground font-mono">
                               {new Date(log.timestamp).toLocaleString()}
                             </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center border border-dashed border-border/60 rounded-2xl">
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No activity yet.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="p-6 bg-muted/30 rounded-2xl border border-border/40">
                      <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-sm font-bold">Enforcement Status: {asset.isLocked ? "Active" : "Disabled"}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-white rounded-xl border border-border/40">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Clear Space</p>
                            <p className="text-xl font-black font-outfit">10%</p>
                         </div>
                         <div className="p-4 bg-white rounded-xl border border-border/40">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Allowed Formats</p>
                            <p className="text-xs font-bold">PNG, SVG, JPG</p>
                         </div>
                      </div>
                   </div>
                   
                   <button 
                     onClick={onOpenRules}
                     className="w-full py-3 bg-white border border-border/60 rounded-xl text-xs font-bold hover:bg-muted transition-all"
                   >
                     Modify Rules
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
