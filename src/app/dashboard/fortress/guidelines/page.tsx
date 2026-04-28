"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Palette, 
  Type, 
  ShieldCheck, 
  Printer,
  Sparkles,
  Loader2,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  MousePointer2
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getStrategyAction } from "@/modules/pilar1-genesis/actions";
import { getAssetsAction } from "@/modules/pilar2-fortress/actions";

export default function BrandGuidelinesPage() {
  const { t } = useTranslation();
  const [strategy, setStrategy] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [stratRes, assetRes] = await Promise.all([
        getStrategyAction(),
        getAssetsAction()
      ]);
      
      if (stratRes.success) setStrategy(stratRes.data);
      if (assetRes.success) setAssets(assetRes.assets);
      
      setLoading(false);
    }
    loadData();
  }, []);

  const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/guidelines/${strategy?.workspaceId || 'default'}" width="100%" height="400" frameborder="0"></iframe>`;

  const copyEmbedCode = () => {
    copyToClipboard(embedCode, "embed-code");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Synthesizing Guidelines...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/fortress" className="p-2 hover:bg-muted rounded-xl transition-all border border-border/50">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-outfit tracking-tight">Interactive Brand Guidelines</h1>
            <p className="text-xs text-muted-foreground font-medium">Auto-generated from your strategic DNA & assets.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => window.print()}
             className="bg-white border border-border/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all shadow-sm"
           >
             <Printer className="w-3.5 h-3.5" /> Print Brand Book
           </button>
           <button className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
             <Download className="w-3.5 h-3.5" /> Export PDF
           </button>
        </div>
      </header>

      {/* Grid Layout for Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Sidebar Navigation */}
         <aside className="lg:col-span-3 flex flex-col gap-2 sticky top-24 h-fit print:hidden">
            {[
              { id: 'logo', label: 'Logo Usage', icon: ShieldCheck },
              { id: 'colors', label: 'Color System', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type },
              { id: 'injector', label: 'Style Injector', icon: MousePointer2 },
              { id: 'expression', label: 'Verbal Expression', icon: Sparkles },
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all text-sm font-bold text-muted-foreground hover:text-foreground group"
              >
                <div className="flex items-center gap-3">
                   <item.icon className="w-4 h-4" />
                   {item.label}
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
         </aside>

         {/* Main Guidelines Content */}
         <main className="lg:col-span-9 flex flex-col gap-16">
            
            {/* Section: Logo Usage */}
            <section id="logo" className="bg-white border border-border/40 rounded-[2.5rem] p-10 md:p-14 shadow-sm flex flex-col gap-10 scroll-mt-24">
               <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">Logo Usage</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">Fundamental rules for maintaining the visual integrity of our brand mark.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 flex items-center justify-center aspect-square relative overflow-hidden group">
                     {assets.find(a => a.tags.includes('LOGO')) ? (
                       <img src={`/uploads/${assets.find(a => a.tags.includes('LOGO')).s3Key}`} alt="Main Logo" className="max-w-[150px] drop-shadow-sm" />
                     ) : (
                       <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          <Eye className="w-10 h-10 opacity-20" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Upload logo in DAM to see preview</p>
                       </div>
                     )}
                     <div className="absolute bottom-4 left-4 bg-primary text-white text-[9px] font-black uppercase px-2 py-1 rounded">Primary Mark</div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                     <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Do's
                        </h4>
                        <ul className="text-xs space-y-2 text-muted-foreground font-medium">
                           <li>• Maintain a clear space of at least 20% around the logo.</li>
                           <li>• Use the primary color variant on light backgrounds.</li>
                           <li>• Ensure the logo is legible in all sizes.</li>
                        </ul>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <XCircle className="w-3.5 h-3.5 text-red-500" /> Don'ts
                        </h4>
                        <ul className="text-xs space-y-2 text-muted-foreground font-medium">
                           <li>• Do not stretch, distort, or rotate the logo.</li>
                           <li>• Do not add shadows, glows, or gradients.</li>
                           <li>• Do not place on busy or low-contrast backgrounds.</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </section>

            {/* Section: Colors */}
            <section id="colors" className="flex flex-col gap-8 scroll-mt-24">
               <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">Color Palette</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">Our curated colors convey our brand's personality and purpose.</p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Primary Color */}
                  <div className="flex flex-col gap-4 group">
                     <div className="aspect-square bg-primary rounded-3xl shadow-xl shadow-primary/20 border-4 border-white relative overflow-hidden">
                        <button 
                          onClick={() => copyToClipboard("#c5a059", "color-primary")}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                           {copiedId === "color-primary" ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </button>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Primary Color</p>
                        <p className="text-sm font-bold font-mono">#c5a059</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">CMYK: 20 40 70 0</p>
                     </div>
                  </div>
                  {/* Extracted Colors */}
                  {assets.filter(a => a.aiColors && a.aiColors.length > 0).slice(0, 3).map((asset, i) => {
                    const hex = (asset.aiColors[0] as any).hex;
                    return (
                      <div key={i} className="flex flex-col gap-4 group">
                         <div 
                           className="aspect-square rounded-3xl border border-border/50 relative overflow-hidden" 
                           style={{ backgroundColor: hex }}
                         >
                            <button 
                              onClick={() => copyToClipboard(hex, `color-${i}`)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                               {copiedId === `color-${i}` ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                            </button>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Secondary {i+1}</p>
                            <p className="text-sm font-bold font-mono">{hex}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5 truncate">Extracted from {asset.fileName}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </section>

            {/* Section: Typography */}
            <section id="typography" className="flex flex-col gap-10 scroll-mt-24">
               <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">Typography</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">Type is a fundamental part of our brand's personality.</p>
               </div>

               <div className="grid grid-cols-1 gap-8">
                  <div className="p-10 bg-white border border-border/40 rounded-[2.5rem] flex flex-col gap-6 relative group overflow-hidden">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Primary Heading Font</p>
                        <h3 className="text-6xl font-black font-outfit tracking-tighter text-neutral-900 leading-none">Outfit</h3>
                        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                          Used for all high-level headlines, Outfit provides a modern, geometric look that aligns with our technological edge.
                        </p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard("font-family: 'Outfit', sans-serif;", "font-heading")}
                       className="w-fit flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-muted/50 px-4 py-2 rounded-lg hover:bg-muted transition-all"
                     >
                       {copiedId === "font-heading" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                       Copy CSS Rule
                     </button>
                  </div>

                  <div className="p-10 bg-white border border-border/40 rounded-[2.5rem] flex flex-col gap-6 relative group overflow-hidden">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Body Font</p>
                        <h3 className="text-6xl font-black tracking-tighter text-neutral-900 leading-none font-sans">Inter</h3>
                        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                          Inter is optimized for screen readability and provides a clean, neutral balance to our expressive headings.
                        </p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard("font-family: 'Inter', sans-serif;", "font-body")}
                       className="w-fit flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-muted/50 px-4 py-2 rounded-lg hover:bg-muted transition-all"
                     >
                       {copiedId === "font-body" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                       Copy CSS Rule
                     </button>
                  </div>
               </div>
            </section>

            {/* Section: Style Guide Injector (Interactive Tool) */}
            <section id="injector" className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 md:p-14 flex flex-col gap-8 scroll-mt-24">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter text-indigo-900">Style Guide Injector</h2>
                    <p className="text-sm text-indigo-700/70 max-w-md">Type your content below to automatically apply brand styling. Perfect for Notion, Docs, or Emails.</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-200">
                    <MousePointer2 className="w-8 h-8 text-indigo-600" />
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-sm">
                     <textarea 
                       placeholder="Type or paste your content here..."
                       className="w-full h-32 bg-transparent border-none focus:ring-0 text-xl font-outfit font-black tracking-tighter text-neutral-900 placeholder:text-neutral-200 outline-none resize-none"
                     />
                  </div>
                  <div className="flex gap-3">
                     <button className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        <Copy className="w-4 h-4" /> Copy Formatted Text
                     </button>
                     <button 
                       onClick={copyEmbedCode}
                       className="px-6 bg-white border border-indigo-200 text-indigo-600 py-3 rounded-2xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
                     >
                        {copiedId === "embed-code" ? <Check className="w-3.5 h-3.5" /> : null}
                        {copiedId === "embed-code" ? "Code Copied!" : "Get Embed Code"}
                     </button>
                  </div>
               </div>
            </section>

            {/* Section: Verbal Expression */}
            <section id="expression" className="bg-neutral-900 text-white rounded-[2.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden scroll-mt-24">
               <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-2">
                     <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter italic">Voice & Tone</h2>
                     <p className="text-sm opacity-60 leading-relaxed max-w-lg">How we speak to the world defines who we are. Our communication is always consistent with our core DNA.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 text-primary">Tone of Voice</p>
                           <p className="text-xl font-bold font-outfit">{strategy?.toneOfVoice || "Visionary & Bold"}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 text-primary">Brand Essence</p>
                           <p className="text-sm opacity-80 leading-relaxed italic">"{strategy?.brandEssence || "Defining the future through innovation."}"</p>
                        </div>
                     </div>
                     <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 text-primary">Strategic Mantra</p>
                        <p className="text-3xl font-black font-outfit leading-tight tracking-tighter uppercase">
                           {strategy?.brandMantra || "Impact Above All"}
                        </p>
                     </div>
                  </div>
               </div>
               <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 -rotate-12 text-primary" />
            </section>

         </main>
      </div>
    </div>
  );
}
