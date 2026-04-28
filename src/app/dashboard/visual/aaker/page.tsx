"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  HelpCircle,
  Component,
  Zap,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { 
  saveAakerAction, 
  getVisualIdentityAction, 
  generateVisualDNAFromAakerAction 
} from "@/modules/pilar7-visual/actions";
import { useTranslation } from "@/lib/i18n";

const aakerFields = [
  { id: "product", title: "Brand as Product", d: "Atribut, kualitas, kegunaan, dan pengguna.", icon: "📦" },
  { id: "organization", title: "Brand as Organization", d: "Atribut organisasi, lokal vs global.", icon: "🏢" },
  { id: "person", title: "Brand as Person", d: "Kepribadian dan hubungan merek-pelanggan.", icon: "🧑" },
  { id: "symbol", title: "Brand as Symbol", d: "Citra visual, metafora, dan warisan merek.", icon: "✨" },
];

export default function AakerCanvas() {
  const { language } = useTranslation();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [visualDna, setVisualDna] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await getVisualIdentityAction();
      if (res.success && res.data) {
        setData({
          product: res.data.aakerProduct || "",
          organization: res.data.aakerOrganization || "",
          person: res.data.aakerPerson || "",
          symbol: res.data.aakerSymbol || "",
        });
        setVisualDna(res.data.visualDnaKeywords || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatusMsg("Saving...");
    const res = await saveAakerAction(data);
    if (res.success) {
      setStatusMsg("Canvas saved!");
      setTimeout(() => setStatusMsg(""), 2000);
    } else {
      setStatusMsg("Error saving.");
    }
    setSaving(false);
  }

  async function handleAIAssist() {
    setGenerating(true);
    setStatusMsg("AI is analyzing...");
    const res = await generateVisualDNAFromAakerAction(data, language);
    if (res.success) {
      setVisualDna(res.data.keywords);
      setStatusMsg("Visual DNA Generated!");
      setTimeout(() => setStatusMsg(""), 3000);
    } else {
      setStatusMsg("AI Error.");
    }
    setGenerating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/visual" className="p-1.5 hover:bg-muted rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Aaker Canvas</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Aaker Framework • Pilar 7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusMsg && (
            <span className="text-[10px] font-bold text-primary animate-pulse mr-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {statusMsg}
            </span>
          )}
          <button 
            onClick={handleAIAssist}
            disabled={generating || saving}
            className="glass px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-primary" />}
            AI Visual DNA
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || generating}
            className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Canvas
          </button>
        </div>
      </header>

      {/* Visual DNA Output (Pinned at top if exists) */}
      {visualDna.length > 0 && (
        <div className="bg-gradient-to-r from-secondary to-secondary/90 text-white p-4 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest">Brand Visual DNA</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {visualDna.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
          <Component className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" />
        </div>
      )}

      {/* Intro AI Insight (Fallback if no DNA) */}
      {visualDna.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-white rounded-lg border border-indigo-100">
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-900 mb-0.5">Ready to define your visual DNA?</p>
            <p className="text-[11px] text-indigo-700/80 leading-snug">
              Isi kanvas di bawah ini, lalu klik tombol **AI Visual DNA** untuk mengekstrak kata kunci desain dari strategi Anda.
            </p>
          </div>
        </div>
      )}

      {/* The Canvas Grid (Compact 2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aakerFields.map((field) => (
          <div key={field.id} className="bg-white border border-border/60 rounded-xl p-4 shadow-sm hover:border-primary/30 transition-all flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{field.icon}</span>
                <h3 className="font-bold text-xs uppercase tracking-wider">{field.title}</h3>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea 
              className="w-full bg-muted/20 border border-border/30 rounded-lg p-3 text-xs min-h-[120px] flex-1 focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none placeholder:italic"
              placeholder={`Describe the ${field.title.toLowerCase()}...`}
              value={data[field.id] || ""}
              onChange={(e) => setData({ ...data, [field.id]: e.target.value })}
            />
            <p className="text-[9px] text-muted-foreground">
              {field.d}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
