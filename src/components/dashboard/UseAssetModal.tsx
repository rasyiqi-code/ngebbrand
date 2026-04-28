"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  Loader2, 
  Lock, 
  CheckCircle2, 
  Eye,
  Info
} from "lucide-react";
import { downloadAssetAction, getAssetRulesAction } from "@/modules/pilar2-fortress/actions";

interface UseAssetModalProps {
  asset: {
    id: string;
    name: string;
    isLocked: boolean;
  };
  onClose: () => void;
}

export function UseAssetModal({ asset, onClose }: UseAssetModalProps) {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  
  // Rules from DB
  const [rules, setRules] = useState<any[]>([]);
  
  // Selections
  const [format, setFormat] = useState("png");
  const [variant, setVariant] = useState("primary");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadRules() {
      if (asset.isLocked) {
        const res = await getAssetRulesAction(asset.id);
        if (res.success) {
          setRules(res.rules);
          // Set defaults from rules if available
          const formatsRule = res.rules.find(r => r.ruleType === "allowed_formats");
          if (formatsRule) setFormat((formatsRule.ruleValue as any).formats[0]);
          
          const variantsRule = res.rules.find(r => r.ruleType === "allowed_variants");
          if (variantsRule) setVariant((variantsRule.ruleValue as any).variants[0]);
        }
      }
      setLoading(false);
    }
    loadRules();
  }, [asset.id, asset.isLocked]);

  const clearSpaceRule = rules.find(r => r.ruleType === "clear_space");
  const clearSpacePercentage = clearSpaceRule ? (clearSpaceRule.ruleValue as any).percentage : 0;
  
  const formatsRule = rules.find(r => r.ruleType === "allowed_formats");
  const allowedFormats = formatsRule ? (formatsRule.ruleValue as any).formats : ["png", "jpg", "svg"];
  
  const variantsRule = rules.find(r => r.ruleType === "allowed_variants");
  const allowedVariants = variantsRule ? (variantsRule.ruleValue as any).variants : ["primary", "white", "black"];

  async function handleDownload() {
    setDownloading(true);
    setStatusMsg("Processing asset...");
    
    const res = await downloadAssetAction(asset.id, {
      format,
      variant
    });

    if (res.success) {
      setStatusMsg("Starting download...");
      // In a real browser, this would trigger the actual download
      window.open(res.url, "_blank");
      setTimeout(() => {
        setStatusMsg("Download complete!");
        setTimeout(() => onClose(), 1000);
      }, 2000);
    } else {
      setStatusMsg("Error downloading.");
      setDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-border/60 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
        
        {/* Preview Side */}
        <div className="bg-muted/30 w-full md:w-1/2 p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-border/40">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest absolute top-4 left-4 flex items-center gap-1.5">
            <Eye className="w-3 h-3" /> Preview
          </div>
          
          {/* Asset Preview Container */}
          <div 
            className="w-full aspect-square bg-white rounded-lg shadow-sm border border-border/40 flex items-center justify-center relative transition-all duration-500"
            style={{ padding: `${clearSpacePercentage}%` }}
          >
             <div className={`w-full h-full rounded flex items-center justify-center ${
               variant === 'primary' ? 'bg-primary/10' : 
               variant === 'white' ? 'bg-white border border-border/20' : 
               variant === 'black' ? 'bg-black' : 'bg-muted'
             }`}>
                {/* Simulated Asset */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  variant === 'white' ? 'text-black' : 'text-white'
                }`}>
                   <CheckCircle2 className="w-8 h-8" />
                </div>
             </div>

             {/* Clear Space Guide Lines (Admin visualization) */}
             {asset.isLocked && (
               <div className="absolute inset-0 border-2 border-dashed border-primary/20 pointer-events-none rounded-lg" />
             )}
          </div>

          <p className="text-[10px] text-muted-foreground mt-6 text-center italic">
            {asset.isLocked 
              ? `Note: ${clearSpacePercentage}% clear space will be applied to the output file.` 
              : "Standard export. No specific brand rules applied."}
          </p>
        </div>

        {/* Configuration Side */}
        <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-outfit flex items-center gap-2">
                Use Asset {asset.isLocked && <Lock className="w-3.5 h-3.5 text-indigo-500" />}
              </h2>
              <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">{asset.name}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-all">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
               <Loader2 className="w-6 h-6 text-primary animate-spin" />
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Checking rules...</p>
             </div>
          ) : (
            <>
              {/* Locked Asset Info */}
              {asset.isLocked && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
                  <div className="p-1.5 bg-indigo-100 rounded text-indigo-600 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-indigo-900">Locked Asset Delivery</h3>
                    <p className="text-[10px] text-indigo-700/80 leading-relaxed">Pilihan varian dan format dibatasi untuk menjaga konsistensi merek.</p>
                  </div>
                </div>
              )}

              {/* Format Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Format</label>
                <div className="flex flex-wrap gap-2">
                  {allowedFormats.map((f: string) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-4 py-1.5 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                        format === f 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-white border-border/60 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Variant</label>
                <div className="flex flex-col gap-2">
                  {allowedVariants.map((v: string) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={`px-4 py-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-between group ${
                        variant === v 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-white border-border/60 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full border border-black/10 ${
                          v === 'primary' ? 'bg-[#c5a059]' : 
                          v === 'white' ? 'bg-white' : 
                          v === 'black' ? 'bg-black' : 'bg-muted'
                        }`} />
                        <span className="capitalize">{v} Variant</span>
                      </div>
                      {variant === v && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto pt-4 flex flex-col gap-3">
                {statusMsg && (
                  <p className="text-[10px] font-bold text-center text-primary animate-pulse">{statusMsg}</p>
                )}
                <button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full bg-secondary text-white px-4 py-3 rounded-xl text-xs font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Download className="w-4 h-4 text-primary" />}
                  Download {format.toUpperCase()} File
                </button>
                <p className="text-[9px] text-muted-foreground text-center">
                  Compliance audit will be logged automatically.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
