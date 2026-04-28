"use client";

import { 
  LayoutDashboard,
  Sparkles, 
  ShieldCheck, 
  LayoutTemplate, 
  Megaphone, 
  Users, 
  BrainCircuit, 
  Palette,
  Settings,
  Star,
  Clock,
  ChevronDown,
  Search,
  Bell,
  Plus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { 
    group: "Starred", 
    icon: Star,
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ]
  },
  { 
    group: "Pillars", 
    icon: LayoutDashboard,
    items: [
      { title: "Genesis Lab", icon: Sparkles, href: "/dashboard/genesis" },
      { title: "Fortress", icon: ShieldCheck, href: "/dashboard/fortress" },
      { title: "Expression", icon: LayoutTemplate, href: "/dashboard/expression" },
      { title: "Amplifier", icon: Megaphone, href: "/dashboard/amplifier" },
      { title: "Agency Hub", icon: Users, href: "/dashboard/agency" },
      { title: "AI Cortex", icon: BrainCircuit, href: "/dashboard/cortex" },
      { title: "Visual Hub", icon: Palette, href: "/dashboard/visual" },
    ]
  }
];

import { useTranslation } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useTranslation();

  const localizedNavItems = [
    { 
      group: "Starred", 
      icon: Star,
      items: [
        { title: t("common.dashboard"), icon: LayoutDashboard, href: "/dashboard" },
      ]
    },
    { 
      group: "Pillars", 
      icon: LayoutDashboard,
      items: [
        { title: t("genesis.title"), icon: Sparkles, href: "/dashboard/genesis" },
        { title: t("fortress.title"), icon: ShieldCheck, href: "/dashboard/fortress" },
        { title: t("expression.title"), icon: LayoutTemplate, href: "/dashboard/expression" },
        { title: "Amplifier", icon: Megaphone, href: "/dashboard/amplifier" },
        { title: "Agency Hub", icon: Users, href: "/dashboard/agency" },
        { title: "AI Cortex", icon: BrainCircuit, href: "/dashboard/cortex" },
        { title: "Visual Hub", icon: Palette, href: "/dashboard/visual" },
      ]
    }
  ];

  return (
    <div className="flex h-screen sticky top-0 overflow-hidden">
      {/* 1. Slim Icon Bar (Leftmost) */}
      <div className="w-[80px] flex flex-col items-center py-8 gap-8 border-r border-border/50">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
          C
        </div>
        
        <div className="flex flex-col gap-6">
          <button className="p-2 text-primary bg-primary/10 rounded-xl"><LayoutDashboard className="w-6 h-6" /></button>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all"><Users className="w-6 h-6" /></button>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all"><FileTextIcon className="w-6 h-6" /></button>
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all"><SettingsIcon className="w-6 h-6" /></button>
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 bg-muted rounded-full" />
        </div>
      </div>

      {/* 2. Navigation Panel */}
      <div className="w-64 py-8 px-6 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <span className="font-bold text-sm">BrandOS.com</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="space-y-8 flex-1">
          {localizedNavItems.map((group) => (
            <div key={group.group}>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <group.icon className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wider uppercase">{group.group}</span>
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                          isActive 
                            ? "bg-primary/10 text-primary font-bold" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.title}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="mt-auto pt-6 border-t border-border/50">
           <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl">
             <button 
               onClick={() => setLanguage("id")}
               className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === "id" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
             >
               BAHASA
             </button>
             <button 
               onClick={() => setLanguage("en")}
               className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === "en" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
             >
               ENGLISH
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Simple placeholders for missing icons to avoid crashes
function FileTextIcon({ className }: { className?: string }) {
  return <LayoutTemplate className={className} />
}
function SettingsIcon({ className }: { className?: string }) {
  return <Settings className={className} />
}
