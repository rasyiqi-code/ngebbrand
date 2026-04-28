import { Sidebar } from "@/components/dashboard/Sidebar";
import { AICortexSidebar } from "@/components/dashboard/AICortexSidebar";
import { Search, Bell, Plus, LayoutGrid, ChevronDown } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col p-2 pl-0">
        <main className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border border-border/40">
          {/* Top Bar inside main container */}
          <header className="px-6 py-3 flex items-center justify-between border-b border-border/40">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder='Search "insights"' 
                className="w-full bg-muted/40 border-none rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                <LayoutGrid className="w-4 h-4" />
                <span>Grid View</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-orange-200" />
              <button className="bg-primary text-white p-1.5 rounded-lg shadow-sm hover:scale-105 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </div>
      <AICortexSidebar />
    </div>
  );
}
