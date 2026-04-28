"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  HelpCircle,
  Dna,
  Zap,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { 
  savePrismAction, 
  getVisualIdentityAction 
} from "@/modules/pilar7-visual/actions";

const prismFields = [
  { id: "physique", title: "Physique", d: "Aset fisik: Logo, warna, bentuk unik.", icon: "🎨" },
  { id: "personality", title: "Personality", d: "Karakter merek jika ia manusia.", icon: "👤" },
  { id: "culture", title: "Culture", d: "Nilai & asal usul (Internal).", icon: "🏛️" },
  { id: "relationship", title: "Relationship", d: "Hubungan antara merek & pelanggan.", icon: "🤝" },
  { id: "reflection", title: "Reflection", d: "Bagaimana target audiens ingin dilihat.", icon: "🪞" },
  { id: "selfImage", title: "Self-Image", d: "Perasaan batin audiens saat pakai merek.", icon: "💎" },
];

export default function IdentityPrism() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visualDna, setVisualDna] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await getVisualIdentityAction();
      if (res.success && res.data) {
        setData({
          physique: res.data.prismPhysique || "",
          personality: res.data.prismPersonality || "",
          culture: res.data.prismCulture || "",
          relationship: res.data.prismRelationship || "",
          reflection: res.data.prismReflection || "",
          selfImage: res.data.prismSelfImage || "",
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
    const res = await savePrismAction(data);
    if (res.success) {
      setStatusMsg("Prism saved!");
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
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/visual" className="p-1.5 hover:bg-muted rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Identity Prism</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Kapferer Framework • Pilar 7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusMsg && (
            <span className="text-[10px] font-bold text-primary animate-pulse mr-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {statusMsg}
            </span>
          )}
          <button className="glass px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all opacity-50 cursor-not-allowed">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Suggest
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Prism
          </button>
        </div>
      </header>

      {/* Intro AI Insight */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 text-white p-4 rounded-xl flex items-center gap-4 relative overflow-hidden">
        <div className="p-2 bg-white/10 rounded-lg">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold mb-0.5">Strategy Context</p>
          <p className="text-[11px] opacity-80 leading-snug">
            {visualDna.length > 0 
              ? `Visual DNA Anda saat ini: ${visualDna.join(", ")}. Gunakan kata-kata ini untuk mengisi Physique dan Personality.`
              : "Definisikan Visual DNA di Aaker Canvas terlebih dahulu untuk mendapatkan saran konteks di sini."}
          </p>
        </div>
        <Dna className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" />
      </div>

      {/* The Prism Grid (Compact 3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prismFields.map((field) => (
          <div key={field.id} className="bg-white border border-border/60 rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{field.icon}</span>
                <h3 className="font-bold text-xs uppercase tracking-wider">{field.title}</h3>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea 
              className="w-full bg-muted/20 border border-border/30 rounded-lg p-3 text-xs min-h-[100px] focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none placeholder:italic"
              placeholder={`Describe the ${field.title.toLowerCase()}...`}
              value={data[field.id] || ""}
              onChange={(e) => setData({ ...data, [field.id]: e.target.value })}
            />
            <p className="text-[9px] text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {field.d}
            </p>
          </div>
        ))}
      </div>

      {/* Visual DNA Output (Preview) */}
      {visualDna.length > 0 && (
        <div className="glass border-dashed border-border/60 rounded-xl p-6 text-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Active Visual DNA</span>
          <div className="flex flex-wrap justify-center gap-3">
            {visualDna.map(tag => (
              <div key={tag} className="px-4 py-1.5 rounded-full bg-white border border-border/50 text-[10px] font-bold shadow-sm">
                #{tag.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
