"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  CircleDot, 
  Key, 
  Box, 
  Type,
  LayoutGrid,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { getStrategyAction, updateStrategyAction } from "@/modules/pilar1-genesis/actions";

export default function GenesisEditPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "basics";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    brandName: "",
    brandEssence: "",
    brandMantra: "",
    whyStatement: "",
    toneOfVoice: "",
    goldenCircle: { why: "", how: "", what: "" },
    brandKey: { target: "", insight: "", benefits: "", values: "", personality: "", reasonToBelieve: "", discriminator: "", essence: "" },
    kapfererPrism: { physique: "", personality: "", culture: "", relationship: "", reflection: "", selfImage: "" }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getStrategyAction();
      if (res.success && res.data) {
        setFormData({
          ...formData,
          ...res.data,
          goldenCircle: res.data.goldenCircle || formData.goldenCircle,
          brandKey: res.data.brandKey || formData.brandKey,
          kapfererPrism: res.data.kapfererPrism || formData.kapfererPrism,
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateStrategyAction(formData);
    setSaving(false);
    if (res.success) {
      router.push("/dashboard/genesis");
    }
  };

  const updateNestedField = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/genesis" className="p-2 hover:bg-white border border-border/50 rounded-xl transition-all shadow-sm text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Edit Brand DNA</h1>
            <p className="text-xs text-muted-foreground">Sempurnakan detail strategi brand Anda secara manual.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/80 transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2">
          {[
            { id: "basics", label: "Dasar Brand", icon: LayoutGrid },
            { id: "golden-circle", label: "Golden Circle", icon: CircleDot },
            { id: "brand-key", label: "Brand Key", icon: Key },
            { id: "kapferer", label: "Identitas Prism", icon: Box },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-white border border-border shadow-sm text-primary" 
                : "text-muted-foreground hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-sm">
            
            {activeTab === "basics" && (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Nama Brand</label>
                  <input 
                    type="text" 
                    value={formData.brandName || ""}
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    placeholder="Masukkan nama brand..."
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Esensi Brand (Visi Utama)</label>
                  <textarea 
                    value={formData.brandEssence || ""}
                    onChange={(e) => setFormData({...formData, brandEssence: e.target.value})}
                    placeholder="Satu kalimat yang merangkum jiwa brand Anda..."
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Tone of Voice</label>
                  <input 
                    type="text" 
                    value={formData.toneOfVoice || ""}
                    onChange={(e) => setFormData({...formData, toneOfVoice: e.target.value})}
                    placeholder="misal: Ceria, Profesional, Mewah..."
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {activeTab === "golden-circle" && (
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl mb-6">
                  <p className="text-xs text-primary leading-relaxed">
                    <strong>Golden Circle</strong> membantu Anda mendefinisikan tujuan mendalam brand (Why), proses unik (How), dan hasil nyata (What).
                  </p>
                </div>
                {["why", "how", "what"].map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{field.toUpperCase()}</label>
                    <textarea 
                      value={formData.goldenCircle?.[field] || ""}
                      onChange={(e) => updateNestedField("goldenCircle", field, e.target.value)}
                      placeholder={`Jelaskan ${field} brand Anda...`}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "brand-key" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData.brandKey).map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                    <textarea 
                      value={formData.brandKey[field] || ""}
                      onChange={(e) => updateNestedField("brandKey", field, e.target.value)}
                      placeholder="..."
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "kapferer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData.kapfererPrism).map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                    <textarea 
                      value={formData.kapfererPrism[field] || ""}
                      onChange={(e) => updateNestedField("kapfererPrism", field, e.target.value)}
                      placeholder="..."
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
