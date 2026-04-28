"use client";

import { 
  Sparkles, 
  LayoutTemplate, 
  PenTool, 
  ChevronRight, 
  Zap,
  LayoutGrid,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function ExpressionStudioDashboard() {
  const { t } = useTranslation();

  const tools = [
    {
      title: t("expression.writer"),
      subtitle: t("expression.writerSubtitle"),
      icon: <PenTool className="w-8 h-8" />,
      href: "/dashboard/expression/writer",
      color: "from-blue-500 to-indigo-600",
      stats: "AI Copywriter",
      tags: ["Social Media", "Ads", "Blog"]
    },
    {
      title: t("expression.designer"),
      subtitle: "Generate smart post layouts based on your visual DNA (Coming Soon).",
      icon: <LayoutGrid className="w-8 h-8" />,
      href: "/dashboard/expression/designer",
      color: "from-purple-500 to-pink-600",
      stats: "Smart Designer",
      tags: ["Instagram", "Carousel", "Ads"]
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">{t("expression.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("expression.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => (
          <Link 
            key={tool.href}
            href={tool.href}
            className="group relative bg-white border border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
          >
            {/* Background Gradient Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl transition-all`} />
            
            <div className="flex flex-col h-full gap-8 relative z-10">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-3xl bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-indigo-500/20`}>
                  {tool.icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tool.stats}</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-outfit mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {tool.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted/50 rounded-lg text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-primary font-bold text-sm mt-4">
                Buka Studio <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature Highlight */}
      <div className="bg-neutral-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
         <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 border border-white/5">
              <Zap className="w-3 h-3 fill-primary" /> Multi-Pilar Sync
            </div>
            <h2 className="text-3xl font-bold font-outfit mb-4">Konsistensi Tanpa Batas</h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Studio Ekspresi menarik data langsung dari **DNA Strategi (Genesis)** dan **Panduan Visual (Visual Hub)** Anda. 
              Setiap kata yang ditulis dan setiap desain yang dibuat dijamin 100% selaras dengan identitas merek Anda.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-medium">Auto-Voice Match</span>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                  <span className="text-xs font-medium">Smart Layout Engine</span>
               </div>
            </div>
         </div>
         
         <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
         <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  );
}
