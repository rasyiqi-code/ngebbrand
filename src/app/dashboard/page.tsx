import { 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  Target,
  BarChart3,
  Globe,
  Share2,
  ArrowRight
} from "lucide-react";

export default function NexusDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Overview</span>
        <h1 className="text-2xl font-bold font-outfit">Brand Intelligence</h1>
      </header>

      {/* 1. Compact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border/50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground">Brand Equity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-outfit">$528,976</span>
            <div className="text-primary text-[10px] font-bold flex items-center">
              <ArrowUpRight className="w-2.5 h-2.5" /> 7.9%
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium text-muted-foreground">Active Pillars</span>
            <span className="text-[9px] bg-white px-1.5 py-0.5 rounded-full border border-border/50 font-bold">4 / 7</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-primary/20 border border-white" />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-4 flex flex-col justify-between text-white shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-medium opacity-70">Best Pilar</span>
          </div>
          <div className="mt-1">
            <span className="text-lg font-bold">Genesis Lab</span>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col justify-center items-center">
          <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Health Score</span>
          <span className="text-2xl font-bold text-primary">78</span>
        </div>
      </div>

      {/* 2. Charts / Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Value Card (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-xs">Platform Distribution</span>
            <div className="flex bg-muted rounded-md p-0.5 text-[9px] font-bold">
              <button className="bg-white px-2 py-0.5 rounded shadow-sm">Revenue</button>
              <button className="px-2 py-0.5">Leads</button>
            </div>
          </div>

          <div className="bg-white border border-border/50 rounded-2xl p-6 h-[240px] flex flex-col">
            <div className="flex-1 flex items-end gap-3 pb-2">
              {[60, 40, 80, 50, 70, 90, 40, 65, 55, 85, 45, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div 
                    className="w-full bg-primary/20 hover:bg-primary transition-all rounded-sm" 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[7px] text-muted-foreground font-bold uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work with Platforms (1 col) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-xs">Active Channels</span>
            <button className="text-[9px] font-bold text-primary">All</button>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { name: "Instagram", val: "45.3%", icon: Globe, color: "text-pink-500", bg: "bg-pink-50" },
              { name: "Twitter", val: "28.1%", icon: Share2, color: "text-blue-500", bg: "bg-blue-50" },
              { name: "LinkedIn", val: "12.4%", icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" }
            ].map((p) => (
              <div key={p.name} className="bg-white border border-border/50 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${p.bg} ${p.color}`}>
                    <p.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold">{p.name}</span>
                </div>
                <span className="text-xs font-bold font-outfit">{p.val}</span>
              </div>
            ))}
          </div>

          {/* Quick AI Insight */}
          <div className="mt-auto bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-[11px] font-bold mb-1">AI Suggestion</h3>
                <p className="text-[9px] opacity-90 leading-tight">Sync P1 & P3 for +12% resonance.</p>
             </div>
             <Sparkles className="absolute -right-2 -bottom-2 w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* 3. Onboarding Quick Wins (Compact) */}
      <section className="bg-muted/20 border border-dashed border-border rounded-xl p-4 mt-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Onboarding Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { t: "Verify Email", d: "Completed", done: true },
            { t: "Set Golden Circle", d: "2 mins", done: false },
            { t: "Upload Logo", d: "Fortress", done: false },
            { t: "Invite Team", d: "Hub", done: false },
          ].map(w => (
            <div key={w.t} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${w.done ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                {w.done && <Sparkles className="w-2.5 h-2.5" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${w.done ? 'line-through opacity-50' : ''}`}>{w.t}</span>
                <span className="text-[9px] text-muted-foreground">{w.d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
