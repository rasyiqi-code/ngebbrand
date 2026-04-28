import { Palette, Hexagon, Component, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { VisualIntelligenceService } from "@/modules/pilar7-visual/services";

const tools = [
  {
    id: "aaker",
    title: "Aaker Canvas",
    desc: "4 dimensions to define brand as product, org, person, symbol.",
    icon: Component,
    href: "/dashboard/visual/aaker",
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    id: "kapferer",
    title: "Identity Prism",
    desc: "Kapferer's 6-facet framework for brand personality.",
    icon: Hexagon,
    href: "/dashboard/visual/prism",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    id: "colors",
    title: "Style Engine",
    desc: "AI color palettes and typography pairings.",
    icon: Palette,
    href: "/dashboard/visual/colors",
    color: "text-amber-500",
    bg: "bg-amber-50"
  }
];

export default async function VisualDashboard() {
  const identity = await VisualIntelligenceService.getVisualIdentity();
  
  const palette = identity?.colorPalette ? (identity.colorPalette as any).colors : null;
  const defaultColors = ['#c5a059', '#1a1a1a', '#f5f3f2', '#ffffff', '#262626'];
  const displayColors = palette 
    ? [palette.primary, palette.secondary, palette.accent, palette.neutral1, palette.neutral2]
    : defaultColors;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-0.5 pb-4 border-b border-border/40">
        <h1 className="text-xl font-bold font-outfit">Visual Intelligence</h1>
        <p className="text-xs text-muted-foreground">Translate strategy into visual DNA with automated moodboards and palettes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map(tool => (
          <Link 
            key={tool.id} 
            href={tool.href}
            className="bg-white border border-border/50 rounded-xl p-5 shadow-sm transition-all group hover:border-primary/30"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tool.bg} ${tool.color}`}>
              <tool.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-outfit mb-1">{tool.title}</h3>
            <p className="text-xs text-muted-foreground">{tool.desc}</p>
          </Link>
        ))}
      </div>
      
      {/* Visual DNA Callout */}
      {identity?.visualDnaKeywords?.length > 0 && (
        <section className="bg-secondary text-white rounded-xl p-5 flex items-center justify-between overflow-hidden relative shadow-md">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-xl">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold mb-1">Active Visual DNA</h2>
              <div className="flex flex-wrap gap-1.5">
                {identity.visualDnaKeywords.map((kw: string) => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold uppercase tracking-wider">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link 
            href="/dashboard/visual/summary" 
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:scale-105 transition-all relative z-10"
          >
            Full Summary
          </Link>
          <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 text-primary" />
        </section>
      )}

      {/* Brand Color Preview */}
      <section className="bg-white border border-border/50 rounded-xl p-5 shadow-sm">
         <h2 className="text-sm font-bold font-outfit mb-4 flex items-center gap-2">
           <Palette className="w-4 h-4 text-muted-foreground" /> 
           {palette ? "Current Brand Palette" : "Default Brand Palette"}
         </h2>
         <div className="flex gap-2">
           {displayColors.map((color, i) => (
             <div key={i} className="flex-1 rounded-lg border border-border/30 overflow-hidden group">
               <div className="h-16 w-full" style={{ backgroundColor: color }} />
               <div className="p-2 bg-muted/20 text-center">
                 <span className="text-[10px] font-mono font-bold uppercase">{color}</span>
               </div>
             </div>
           ))}
         </div>
         {!palette && (
           <p className="text-[10px] text-muted-foreground mt-4 italic text-center">
             Go to <strong>Style Engine</strong> to generate a custom palette using AI.
           </p>
         )}
      </section>

      {/* Font Preview (If exists) */}
      {identity?.typography && (
        <section className="bg-white border border-border/50 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold font-outfit mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" /> Brand Typography
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/10 rounded-xl border border-border/20">
            <div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Heading Font</p>
               <h3 className="text-2xl font-bold" style={{ fontFamily: (identity.typography as any).heading.family }}>
                 {(identity.typography as any).heading.family}
               </h3>
            </div>
            <div>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Body Font</p>
               <p className="text-sm" style={{ fontFamily: (identity.typography as any).body.family }}>
                 {(identity.typography as any).body.family} — The quick brown fox jumps over the lazy dog.
               </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
