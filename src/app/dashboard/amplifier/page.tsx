import { 
  Megaphone, 
  Calendar, 
  BarChart2, 
  Globe, 
  Share2, 
  Plus,
  MoreHorizontal,
  LucideIcon
} from "lucide-react";
import { BrandAmplifierService } from "@/modules/pilar4-amplifier/services";

interface ScheduleItem {
  id: string;
  type: string;
  icon: LucideIcon;
  status: string;
  time: string;
  title: string;
  color: string;
  bg: string;
}

export default async function AmplifierDashboard() {
  const dbQueue = await BrandAmplifierService.getContentQueue();
  
  const schedule: ScheduleItem[] = dbQueue.length > 0 ? dbQueue.map(item => ({
    id: item.id,
    type: item.platform,
    icon: item.platform.toLowerCase().includes('linkedin') ? Share2 : Globe,
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    time: item.scheduledFor ? item.scheduledFor.toLocaleString() : "No date set",
    title: item.content.substring(0, 30) + "...",
    color: "text-blue-600",
    bg: "bg-blue-50"
  })) : [
    { id: '1', type: "Instagram", icon: Globe, status: "Published", time: "Today, 09:00 AM", title: "Brand Launch Carousel", color: "text-pink-500", bg: "bg-pink-50" },
    { id: '2', type: "LinkedIn", icon: Share2, status: "Scheduled", time: "Tomorrow, 10:00 AM", title: "CEO Thought Leadership", color: "text-blue-600", bg: "bg-blue-50" },
    { id: '3', type: "Twitter", icon: Globe, status: "Draft", time: "No date set", title: "Product Teaser Thread", color: "text-sky-500", bg: "bg-sky-50" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold font-outfit">Brand Amplifier</h1>
          <p className="text-xs text-muted-foreground">Omnichannel Publishing & Resonance Analytics.</p>
        </div>
        <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/80 transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          Create Campaign
        </button>
      </header>

      {/* Analytics Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Reach", value: "24.5K", diff: "+12.5%", isUp: true },
          { label: "Brand Resonance Score", value: "82/100", diff: "+4.2%", isUp: true },
          { label: "Engagement Rate", value: "4.8%", diff: "-0.5%", isUp: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-xl font-bold font-outfit">{stat.value}</span>
              <span className={`text-[10px] font-bold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>{stat.diff}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content Calendar Queue */}
        <section className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-muted/30 p-2 rounded-xl border border-border/50">
            <h2 className="text-xs font-bold flex items-center gap-2 ml-1">
              <Calendar className="w-4 h-4 text-muted-foreground" /> Upcoming Content
            </h2>
            <button className="text-[10px] font-bold text-primary mr-1 hover:underline">View Full Calendar</button>
          </div>

          <div className="flex flex-col gap-2">
            {schedule.map((item) => (
              <div key={item.id} className="bg-white border border-border/50 rounded-xl p-3 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{item.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Published' ? 'bg-green-100 text-green-700' :
                    item.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status}
                  </span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insight Sidebar */}
        <section className="flex flex-col gap-3">
           <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 flex flex-col h-full relative overflow-hidden">
             <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-3">
                 <div className="p-1.5 bg-orange-200 rounded-md text-orange-600">
                   <Megaphone className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-bold text-orange-900">Resonance Insight</span>
               </div>
               
               <p className="text-[11px] text-orange-800/80 leading-relaxed flex-1">
                 &quot;Audiens LinkedIn merespon sangat positif terhadap topik &apos;Sustainability&apos; yang Anda sebutkan di Aaker Canvas. Sangat disarankan untuk mempublikasikan lebih banyak konten tipe ini di hari Selasa pagi.&quot;
               </p>

               <button className="mt-4 bg-orange-600 text-white text-[10px] font-bold py-2 rounded-lg shadow-sm hover:bg-orange-700 transition-all w-full text-center">
                 Generate Topic Ideas
               </button>
             </div>
             <BarChart2 className="absolute -right-4 -bottom-4 w-24 h-24 text-orange-500 opacity-5" />
           </div>
        </section>
      </div>
    </div>
  );
}
