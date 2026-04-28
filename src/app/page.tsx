import { 
  Sparkles, 
  ShieldCheck, 
  LayoutTemplate, 
  Megaphone, 
  Users, 
  BrainCircuit, 
  Palette,
  ArrowRight,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    id: "p1",
    title: "Brand Genesis Lab",
    description: "Formulate your brand's strategic foundation with AI-guided expert frameworks.",
    icon: Sparkles,
  },
  {
    id: "p2",
    title: "Brand Fortress",
    description: "Secure Digital Asset Management with smart locking and consistency auditing.",
    icon: ShieldCheck,
  },
  {
    id: "p3",
    title: "Expression Studio",
    description: "Design on-brand content instantly with locked templates and AI copywriting.",
    icon: LayoutTemplate,
  },
  {
    id: "p4",
    title: "Brand Amplifier",
    description: "Omnichannel publishing engine with deep brand resonance analytics.",
    icon: Megaphone,
  },
  {
    id: "p5",
    title: "Agency Hub",
    description: "White-label reporting and multi-client collaboration workspace.",
    icon: Users,
  },
  {
    id: "p6",
    title: "AI Cortex",
    description: "The intelligent core powered by branding expert knowledge and multimodal AI.",
    icon: BrainCircuit,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="mx-auto max-w-7xl px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight">BrandOS</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Sign In</Link>
          <Link 
            href="/dashboard" 
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-10">
            <Zap className="w-3 h-3" /> The Operating System for Brands
          </div>
          <h1 className="font-outfit text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            Build a <span className="text-primary">Legacy</span>, <br /> Not Just a Logo.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            The world's first AI-powered OS designed to formulate strategy, protect assets, 
            and automate on-brand content creation at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="bg-secondary text-white px-10 py-4 rounded-2xl text-base font-bold hover:bg-secondary/90 transition-all flex items-center gap-2"
            >
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="glass px-10 py-4 rounded-2xl text-base font-bold hover:bg-muted/50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </header>

      {/* Pillars Section */}
      <section className="bg-white rounded-[4rem] py-32 px-6 shadow-sm border-t border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl font-bold font-outfit mb-6">Unified Brand Lifecycle</h2>
            <p className="text-lg text-muted-foreground">
              Six specialized modules working in perfect harmony, powered by the AI Cortex.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div 
                key={pillar.id}
                className="group p-10 rounded-[2.5rem] border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 bg-background/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <pillar.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {pillar.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                  LEARN MORE <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="bg-secondary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-outfit mb-8 max-w-3xl mx-auto">
              Ready to give your brand an upgrade?
            </h2>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all shadow-2xl shadow-primary/40"
            >
              Get Started for Free <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-border/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-outfit font-bold text-lg">BrandOS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 BrandOS. Developed for Next-Gen Agency Workflows.
          </p>
          <div className="flex gap-8 text-sm font-bold">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
