"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  Type, 
  CheckCircle2, 
  Loader2, 
  RefreshCcw,
  MousePointer2,
  Lock
} from "lucide-react";
import Link from "next/link";
import { 
  getVisualIdentityAction, 
  saveVisualSystemAction 
} from "@/modules/pilar7-visual/actions";
import { 
  generatePaletteAction, 
  generateTypographyAction 
} from "@/modules/pilar6-cortex/actions";
import { useTranslation } from "@/lib/i18n";

export default function VisualSystemEngine() {
  const { language } = useTranslation();
  const [visualIdentity, setVisualIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [palettes, setPalettes] = useState<any[]>([]);
  const [typography, setTypography] = useState<any[]>([]);
  
  const [selectedPalette, setSelectedPalette] = useState<any>(null);
  const [selectedTypo, setSelectedTypo] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await getVisualIdentityAction();
      if (res.success && res.data) {
        setVisualIdentity(res.data);
        setSelectedPalette(res.data.colorPalette);
        setSelectedTypo(res.data.typography);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleGenerate() {
    if (!visualIdentity?.visualDnaKeywords?.length) {
      alert("Definisikan Visual DNA di Aaker Canvas terlebih dahulu!");
      return;
    }

    setGenerating(true);
    setStatusMsg("AI is crafting your visual system...");
    
    try {
      const [paletteRes, typoRes] = await Promise.all([
        generatePaletteAction("The Magician", visualIdentity.visualDnaKeywords, language),
        generateTypographyAction("The Magician", visualIdentity.visualDnaKeywords, language)
      ]);

      if (paletteRes.success) setPalettes(paletteRes.data.options);
      if (typoRes.success) setTypography(typoRes.data.options);
      
      setStatusMsg("AI Suggestions ready!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      setStatusMsg("Error generating.");
    }
    
    setGenerating(false);
  }

  async function handleSave() {
    setSaving(true);
    setStatusMsg("Saving visual system...");
    const res = await saveVisualSystemAction({
      colorPalette: selectedPalette,
      typography: selectedTypo
    });
    if (res.success) {
      setStatusMsg("Visual system updated!");
      setTimeout(() => setStatusMsg(""), 2000);
    } else {
      setStatusMsg("Error saving.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-20">
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/visual" className="p-1.5 hover:bg-muted rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Visual System Engine</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">AI Driven Styles • Pilar 7</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-[10px] font-bold text-primary animate-pulse flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {statusMsg}
            </span>
          )}
          <button 
            onClick={handleGenerate}
            disabled={generating || saving}
            className="glass px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
            Generate New Options
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || generating || (!selectedPalette && !selectedTypo)}
            className="bg-primary text-white px-6 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Palette className="w-3.5 h-3.5" />}
            Apply System
          </button>
        </div>
      </header>

      {!palettes.length && !selectedPalette && (
        <div className="bg-white border border-border/50 rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="max-w-md">
            <h2 className="text-lg font-bold font-outfit mb-2">Generate Visual System</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI akan menganalisis Visual DNA Anda (<strong>{visualIdentity?.visualDnaKeywords?.join(", ") || "Belum ada"}</strong>) 
              untuk membuatkan 3 opsi palet warna dan tipografi yang selaras secara psikologis.
            </p>
          </div>
          <button 
            onClick={handleGenerate}
            className="mt-2 bg-secondary text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" /> Start AI Generation
          </button>
        </div>
      )}

      {(palettes.length > 0 || typography.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Color Palettes Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Color Palette Options</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {palettes.map((p, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedPalette(p)}
                  className={`bg-white border text-left p-4 rounded-xl shadow-sm transition-all group relative ${
                    selectedPalette?.name === p.name ? 'border-primary ring-1 ring-primary' : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xs font-bold">{p.name}</h3>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Score: {p.score}%</p>
                    </div>
                    {selectedPalette?.name === p.name && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex gap-1 h-12 rounded-lg overflow-hidden border border-border/20">
                    <div className="flex-1" style={{ backgroundColor: p.colors.primary }} />
                    <div className="flex-1" style={{ backgroundColor: p.colors.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: p.colors.accent }} />
                    <div className="flex-1" style={{ backgroundColor: p.colors.neutral1 }} />
                    <div className="flex-1" style={{ backgroundColor: p.colors.neutral2 }} />
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-3 italic leading-relaxed">
                    "{p.description}"
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Typography Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Typography Options</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {typography.map((t, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedTypo(t)}
                  className={`bg-white border text-left p-4 rounded-xl shadow-sm transition-all group relative ${
                    selectedTypo?.name === t.name ? 'border-primary ring-1 ring-primary' : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xs font-bold">{t.name}</h3>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Score: {t.score}%</p>
                    </div>
                    {selectedTypo?.name === t.name && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/30 flex flex-col gap-1">
                    <p className="text-lg font-bold" style={{ fontFamily: t.heading.family }}>
                      {t.heading.family}
                    </p>
                    <p className="text-[11px] leading-relaxed opacity-70" style={{ fontFamily: t.body.family }}>
                      The quick brown fox jumps over the lazy dog. Brand strategy meets visual excellence.
                    </p>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-3 italic leading-relaxed">
                    "{t.description}"
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Preview Section */}
      {(selectedPalette || selectedTypo) && (
        <section className="mt-10 border-t border-border/40 pt-10">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-center text-muted-foreground">Live Preview</h2>
          <div 
            className="rounded-2xl border border-border/60 p-10 shadow-xl max-w-2xl mx-auto flex flex-col gap-6"
            style={{ 
              backgroundColor: selectedPalette?.colors?.neutral1 || "#ffffff",
              color: selectedPalette?.colors?.neutral2 || "#1a1a1a"
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{ backgroundColor: selectedPalette?.colors?.primary || "#c5a059" }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 
                className="text-xl font-bold"
                style={{ 
                  fontFamily: selectedTypo?.heading?.family || "inherit",
                  color: selectedPalette?.colors?.primary || "inherit"
                }}
              >
                Brand Elevation
              </h3>
            </div>
            
            <p 
              className="text-sm leading-relaxed"
              style={{ fontFamily: selectedTypo?.body?.family || "inherit" }}
            >
              Ini adalah representasi visual bagaimana palet warna <strong>{selectedPalette?.name || "Standard"}</strong> dan tipografi <strong>{selectedTypo?.name || "Standard"}</strong> akan berinteraksi dalam antarmuka nyata. 
              Gunakan aksen <span style={{ color: selectedPalette?.colors?.accent || "#c5a059", fontWeight: "bold" }}>warna ini</span> untuk elemen penting.
            </p>
            
            <button 
              className="mt-2 py-2 px-6 rounded-lg text-xs font-bold shadow-md self-start transition-all hover:scale-105"
              style={{ 
                backgroundColor: selectedPalette?.colors?.primary || "#c5a059",
                color: "#ffffff"
              }}
            >
              Primary Action Button
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
