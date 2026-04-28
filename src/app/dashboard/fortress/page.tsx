"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  Grid, 
  List, 
  FileCheck,
  Lock,
  Download,
  MoreVertical,
  ExternalLink,
  Loader2,
  Settings,
  BookOpen,
  Eye
} from "lucide-react";
import Link from "next/link";
import { getAssetsAction } from "@/modules/pilar2-fortress/actions";
import { FortressHeader } from "@/components/dashboard/FortressHeader";
import { BrandRulesModal } from "@/components/dashboard/BrandRulesModal";
import { UseAssetModal } from "@/components/dashboard/UseAssetModal";

interface DisplayAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  tags: string[];
  isLocked: boolean;
  aiColors?: any[];
  auditLogs?: any[];
}

import { AssetDetailModal } from "@/components/dashboard/AssetDetailModal";

export default function FortressDashboard() {
  const [assets, setAssets] = useState<DisplayAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Modals
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<DisplayAsset | null>(null);
  const [selectedAssetForRules, setSelectedAssetForRules] = useState<DisplayAsset | null>(null);
  const [selectedAssetForUse, setSelectedAssetForUse] = useState<DisplayAsset | null>(null);

  async function loadAssets() {
    setLoading(true);
    const res = await getAssetsAction();
    if (res.success) {
      setAssets(res.assets.map((a: any) => ({
        id: a.id,
        name: a.fileName,
        type: a.mimeType,
        size: a.fileSize ? `${Math.round(a.fileSize / 1024)} KB` : "Unknown",
        tags: a.tags,
        isLocked: a.isLocked,
        aiColors: a.aiColors || []
      })));
    }
    setLoading(false);
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Logos") return matchesSearch && (asset.tags.includes("LOGO") || asset.name.toLowerCase().includes("logo"));
    if (activeTab === "Imagery") return matchesSearch && (asset.type.startsWith("image") && !asset.tags.includes("LOGO"));
    if (activeTab === "Fonts") return matchesSearch && asset.type.includes("font");
    
    return matchesSearch;
  });

  useEffect(() => {
    loadAssets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <FortressHeader />

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-white border border-border/50 rounded-xl p-3 flex items-center gap-2 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground ml-1" />
          <input 
            type="text" 
            placeholder="Search assets by name, tags, or colors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs flex-1 outline-none"
          />
          <div className="flex items-center gap-1 border-l border-border/50 pl-3">
            <button className="p-1 rounded bg-muted text-primary"><Grid className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded hover:bg-muted text-muted-foreground"><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="bg-white border border-border/50 rounded-xl p-3 flex items-center justify-center gap-4 shadow-sm">
          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Storage</p>
            <p className="text-sm font-bold font-outfit">1.2 / 100 GB</p>
          </div>
          <div className="h-6 w-px bg-border/50" />
          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Assets</p>
            <p className="text-sm font-bold font-outfit">{assets.length}</p>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-outfit">Brand Assets</h2>
          <div className="flex gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
            {['All', 'Logos', 'Imagery', 'Fonts'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                  activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="bg-white border border-dashed border-border/60 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
            <div className="p-4 bg-muted/50 rounded-full">
              <ShieldCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold">{searchQuery ? "No matching assets" : "No assets found"}</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              {searchQuery ? "Try adjusting your search query or filters." : "Upload your logo, patterns, and documents to start enforcing brand consistency."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset: any) => (
              <div 
                key={asset.id} 
                onClick={() => setSelectedAssetForDetail(asset)}
                className="bg-white border border-border/50 rounded-xl overflow-hidden group shadow-sm hover:border-primary/30 transition-all flex flex-col cursor-pointer"
              >
                <div className="aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden">
                  <ShieldCheck className="w-8 h-8 text-primary/20" />
                  
                  {asset.isLocked && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded shadow-sm animate-in fade-in zoom-in">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  {/* AI Colors overlay */}
                  {asset.aiColors && asset.aiColors.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1 group-hover:translate-y-10 transition-transform">
                      {asset.aiColors.slice(0, 3).map((c: any, i: number) => (
                        <div 
                          key={i} 
                          className="w-3 h-3 rounded-full border border-white/50 shadow-sm" 
                          style={{ backgroundColor: c.hex }}
                          title={c.hex}
                        />
                      ))}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <div className="p-2 bg-white rounded-full shadow-md text-muted-foreground">
                        <Eye className="w-4 h-4" />
                     </div>
                  </div>
                </div>
                
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <h3 className="text-xs font-bold truncate">{asset.name}</h3>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{asset.type} • {asset.size}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 text-[9px] text-muted-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                    {asset.tags.length > 3 && <span className="text-[9px] text-muted-foreground">+{asset.tags.length - 3}</span>}
                  </div>

                  <div className="mt-auto pt-3 flex gap-1.5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssetForUse(asset);
                      }}
                      className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        asset.isLocked 
                        ? 'bg-secondary text-white hover:bg-secondary/90 shadow-sm' 
                        : 'bg-muted/50 hover:bg-muted text-foreground'
                      }`}
                    >
                      <Download className={`w-3 h-3 ${asset.isLocked ? 'text-primary' : ''}`} /> 
                      {asset.isLocked ? "Use Asset" : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Compliance Callout */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white shadow-sm text-indigo-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-indigo-900">Audit your brand presence</h2>
            <p className="text-[10px] text-indigo-700/80">Scan website or social media for inconsistencies in logo usage and colors.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/fortress/auditor"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          Start Scan
        </Link>
      </section>

      {/* Guidelines Quick Link */}
      <section className="bg-neutral-900 text-white rounded-xl p-5 flex items-center justify-between overflow-hidden relative group">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-outfit">Live Brand Guidelines</h2>
            <p className="text-[10px] opacity-60">Your brand book is alive. It updates as you change your strategy or assets.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/fortress/guidelines"
          className="bg-white text-neutral-900 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95 relative z-10"
        >
          View Brand Book
        </Link>
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/30 transition-all" />
      </section>

      {/* Modals */}
      {selectedAssetForDetail && (
        <AssetDetailModal 
          asset={selectedAssetForDetail} 
          onClose={() => {
            setSelectedAssetForDetail(null);
            loadAssets();
          }} 
          onOpenRules={() => {
            setSelectedAssetForRules(selectedAssetForDetail);
            setSelectedAssetForDetail(null);
          }}
          onOpenUse={() => {
            setSelectedAssetForUse(selectedAssetForDetail);
            setSelectedAssetForDetail(null);
          }}
        />
      )}

      {selectedAssetForRules && (
        <BrandRulesModal 
          asset={selectedAssetForRules} 
          onClose={() => {
            setSelectedAssetForRules(null);
            loadAssets();
          }} 
        />
      )}

      {selectedAssetForUse && (
        <UseAssetModal 
          asset={selectedAssetForUse} 
          onClose={() => setSelectedAssetForUse(null)} 
        />
      )}
    </div>
  );
}
