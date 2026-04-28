"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Code, 
  Copy, 
  CheckCircle2,
  Type
} from "lucide-react";
import Link from "next/link";

export default function StyleInjector() {
  const [copied, setCopied] = useState(false);
  const [testText, setTestText] = useState("Type here to test your brand font...");

  const embedCode = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
  .brand-inject { font-family: 'Outfit', sans-serif !important; color: #1a1a1a; }
</style>
<div class="brand-inject">
  Your Text Here
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      <header className="flex items-center gap-3 border-b border-border/40 pb-4">
        <Link href="/dashboard/fortress" className="p-1.5 hover:bg-muted rounded-lg transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-outfit">Style Guide Injector</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pilar 2 • Copy & Paste Widget</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border/50 rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-muted-foreground" /> Embed Code
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Copy this snippet to Notion, Google Docs, or any web platform. It forces your text to use your brand's exact font and color.
            </p>
            
            <div className="relative">
              <pre className="bg-muted/30 p-3 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto border border-border/50">
                {embedCode}
              </pre>
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-white border border-border/50 p-1.5 rounded shadow-sm hover:border-primary/50 transition-all text-muted-foreground"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-sm">
             <h3 className="text-xs font-bold text-primary mb-1">Why use this?</h3>
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               Clients often use the wrong fonts when copying content. This widget injects CSS web fonts directly, guaranteeing 100% brand consistency even if they don't have the font installed.
             </p>
          </div>
        </div>

        <div className="bg-white border border-border/50 rounded-xl p-4 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-muted-foreground" /> Live Preview
          </h2>
          
          <div className="flex-1 bg-muted/20 border border-dashed border-border/50 rounded-lg p-4 flex flex-col items-center justify-center">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-center resize-none outline-none font-outfit text-xl font-bold"
              style={{ color: "#1a1a1a" }}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
