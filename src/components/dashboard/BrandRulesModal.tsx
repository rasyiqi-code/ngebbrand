"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  Save, 
  Loader2, 
  Maximize2, 
  Palette, 
  FileType 
} from "lucide-react";
import { saveBrandRulesAction, getAssetRulesAction, toggleAssetLockAction } from "@/modules/pilar2-fortress/actions";

interface BrandRulesModalProps {
  asset: {
    id: string;
    name: string;
    isLocked: boolean;
  };
  onClose: () => void;
}

export function BrandRulesModal({ asset, onClose }: BrandRulesModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(asset.isLocked);
  
  // Rule states
  const [clearSpace, setClearSpace] = useState(10);
  const [allowedFormats, setAllowedFormats] = useState(["png", "svg", "jpg"]);
  const [allowedVariants, setAllowedVariants] = useState(["primary", "white", "black"]);

  useEffect(() => {
    async function loadRules() {
      const res = await getAssetRulesAction(asset.id);
      if (res.success && res.rules.length > 0) {
        res.rules.forEach(rule => {
          if (rule.ruleType === "clear_space") setClearSpace((rule.ruleValue as any).percentage);
          if (rule.ruleType === "allowed_formats") setAllowedFormats((rule.ruleValue as any).formats);
          if (rule.ruleType === "allowed_variants") setAllowedVariants((rule.ruleValue as any).variants);
        });
      }
      setLoading(false);
    }
    loadRules();
  }, [asset.id]);

  async function handleSave() {
    setSaving(true);
    
    // Toggle lock first if changed
    if (isLocked !== asset.isLocked) {
      await toggleAssetLockAction(asset.id, isLocked);
    }

    const rules = [
      { type: "clear_space", value: { percentage: clearSpace } },
      { type: "allowed_formats", value: { formats: allowedFormats } },
      { type: "allowed_variants", value: { variants: allowedVariants } }
    ];

    const res = await saveBrandRulesAction(asset.id, rules);
    if (res.success) {
      onClose();
    } else {
      alert("Error saving rules: " + res.error);
    }
    setSaving(false);
  }

  const toggleFormat = (format: string) => {
    setAllowedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const toggleVariant = (variant: string) => {
    setAllowedVariants(prev => 
      prev.includes(variant) ? prev.filter(v => v !== variant) : [...prev, variant]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-border/60 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-outfit">Asset Brand Rules</h2>
              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{asset.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-all">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loading rules...</p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-6">
            {/* Lock Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/40">
              <div>
                <h3 className="text-xs font-bold">Lock this asset?</h3>
                <p className="text-[9px] text-muted-foreground">Locked assets enforce clear space and variants on download.</p>
              </div>
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`w-10 h-5 rounded-full transition-all relative ${isLocked ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLocked ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {isLocked && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Clear Space Rule */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Maximize2 className="w-3 h-3" /> Clear Space (Padding)
                    </label>
                    <span className="text-xs font-bold text-primary">{clearSpace}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="25" 
                    step="1"
                    value={clearSpace}
                    onChange={(e) => setClearSpace(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-muted rounded-full cursor-pointer"
                  />
                  <p className="text-[9px] text-muted-foreground italic">Minimum clear space maintained around the asset.</p>
                </div>

                {/* Allowed Formats */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <FileType className="w-3 h-3" /> Allowed Formats
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["png", "svg", "jpg", "webp", "pdf"].map(format => (
                      <button
                        key={format}
                        onClick={() => toggleFormat(format)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                          allowedFormats.includes(format) 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-white border-border/60 text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allowed Variants */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Palette className="w-3 h-3" /> Allowed Variants
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      { id: "primary", name: "Primary", color: "bg-[#c5a059]" },
                      { id: "white", name: "Negative (White)", color: "bg-white border border-border" },
                      { id: "black", name: "Dark", color: "bg-black" },
                      { id: "accent", name: "Accent", color: "bg-orange-200" }
                    ].map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => toggleVariant(variant.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-2 ${
                          allowedVariants.includes(variant.id) 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-white border-border/60 text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${variant.color}`} />
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-border/40 bg-muted/10 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-xs font-bold border border-border/60 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Rules
          </button>
        </div>
      </div>
    </div>
  );
}
