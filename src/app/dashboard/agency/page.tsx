import { 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  ArrowRight,
  TrendingUp,
  Plus
} from "lucide-react";
import { AgencyHubService } from "@/modules/pilar5-agency/services";

interface ClientItem {
  id: string;
  name: string;
  industry: string;
  health: number;
  activePillars: number;
}

export default async function AgencyDashboard() {
  const dbClients = await AgencyHubService.getClients();

  const clients: ClientItem[] = dbClients.length > 0 ? dbClients.map(c => ({
    id: c.id,
    name: c.name,
    industry: c.workspaces[0]?.industry || "General",
    health: 90,
    activePillars: 5
  })) : [
    { id: '1', name: "Hening Coffee", industry: "F&B", health: 85, activePillars: 5 },
    { id: '2', name: "Nexus Tech", industry: "SaaS", health: 92, activePillars: 7 },
    { id: '3', name: "Lumina Studio", industry: "Design", health: 68, activePillars: 3 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold font-outfit">Agency Hub</h1>
          <p className="text-xs text-muted-foreground">Multi-client management and white-label reporting.</p>
        </div>
        <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/80 transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          Add Client Workspace
        </button>
      </header>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Agency Health</p>
            <h2 className="text-2xl font-bold font-outfit">Excellent</h2>
            <p className="text-[10px] mt-1 opacity-90">All clients above 65% brand resonance.</p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-20 relative z-10" />
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-white border border-border/50 rounded-xl p-3 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Workspaces</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-xl font-bold font-outfit">12</span>
            <span className="text-[10px] font-bold text-green-600">+2 this month</span>
          </div>
        </div>

        <div className="bg-white border border-border/50 rounded-xl p-3 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Reports</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-xl font-bold font-outfit">3</span>
            <span className="text-[10px] font-bold text-primary underline cursor-pointer">Generate Now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Client List (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-outfit">Client Workspaces</h2>
            <div className="flex gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
              <button className="px-2 py-0.5 rounded text-[10px] font-bold bg-white shadow-sm">Active</button>
              <button className="px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground">Archived</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {clients.map((client: ClientItem) => (
              <div key={client.id} className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{client.name}</h3>
                    <p className="text-[9px] text-muted-foreground">{client.industry}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Health</span>
                    <span className={`text-xs font-bold ${client.health >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
                      {client.health}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Pillars</span>
                    <span className="text-xs font-bold">{client.activePillars}/7</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Tools (1 col) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold font-outfit">White-Label Tools</h2>
          <div className="flex flex-col gap-2">
            <button className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex items-center gap-3 hover:border-primary/30 transition-all text-left">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Generate Report</span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">Create branded PDF analytics.</span>
              </div>
            </button>

            <button className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex items-center gap-3 hover:border-primary/30 transition-all text-left">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Client Portal</span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">Manage external view access.</span>
              </div>
            </button>

            <button className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex items-center gap-3 hover:border-primary/30 transition-all text-left">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">Agency Branding</span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">Customize logos and colors.</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
