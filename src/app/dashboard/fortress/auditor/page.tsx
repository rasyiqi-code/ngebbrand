"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  Globe, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  BarChart3,
  ExternalLink,
  RefreshCcw,
  Palette,
  Type,
  MessageSquare,
  Download
} from "lucide-react";
import Link from "next/link";
import { startAuditAction, getAuditHistoryAction } from "@/modules/pilar2-fortress/auditor.actions";

export default function BrandAuditorPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const res = await getAuditHistoryAction();
    if (res.success) {
      setHistory(res.reports);
      if (res.reports.length > 0 && !selectedReport) {
        setSelectedReport(res.reports[0]);
      }
    }
    setLoading(false);
  }

  async function handleStartScan() {
    if (!url) return;
    setScanning(true);
    const res = await startAuditAction(url);
    if (res.success) {
      setUrl("");
      await loadHistory();
    } else {
      alert("Scan failed: " + res.error);
    }
    setScanning(false);
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-rose-500";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/fortress" className="p-1.5 hover:bg-muted rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-outfit">Consistency Auditor</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pilar 2 • Brand Health Scan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-border/60 rounded-lg flex items-center px-3 py-1.5 shadow-sm focus-within:ring-1 focus-within:ring-primary transition-all">
            <Globe className="w-3.5 h-3.5 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-48 md:w-64"
            />
          </div>
          <button 
            onClick={handleStartScan}
            disabled={scanning || !url}
            className="bg-secondary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Zap className="w-3.5 h-3.5 text-primary" />}
            Start Audit
          </button>
        </div>
      </header>

      {/* Health Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border/40 p-4 rounded-2xl flex flex-col gap-2">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Avg. Compliance</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black font-outfit">
              {history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) : 0}%
            </span>
            <span className="text-[9px] font-bold text-emerald-500 mb-1">+5.2%</span>
          </div>
        </div>
        <div className="md:col-span-3 bg-white border border-border/40 p-4 rounded-2xl flex flex-col gap-2 overflow-hidden">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Health Trend (Last 10 Scans)</p>
          <div className="flex items-end gap-1 h-10 mt-auto">
            {history.slice(0, 10).reverse().map((report, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-all relative group"
                style={{ height: `${report.score}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-neutral-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  {report.score}%
                </div>
              </div>
            ))}
            {history.length === 0 && <div className="text-[9px] text-muted-foreground h-full flex items-center">No data yet. Run your first audit.</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: History Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <RefreshCcw className="w-3 h-3" /> Scan History
          </h2>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2">
            {history.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedReport?.id === report.id 
                    ? 'bg-white border-primary shadow-md ring-1 ring-primary' 
                    : 'bg-muted/20 border-border/40 hover:border-primary/40'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-lg font-bold font-outfit ${getScoreColor(report.score)}`}>
                    {report.score}
                  </span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-[11px] font-bold truncate">{report.targetUrl}</h3>
                <p className="text-[9px] text-muted-foreground mt-1 capitalize">{report.targetType} Scan</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Report */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-white border border-border/50 rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Report Header */}
              <div className="p-6 bg-gradient-to-br from-muted/50 to-white border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-2xl font-bold font-outfit ${getScoreColor(selectedReport.score)}`}>
                    {selectedReport.score}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-outfit flex items-center gap-2">
                      Scan Result <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {selectedReport.targetUrl} <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Compliance Level</p>
                  <p className={`text-sm font-bold ${getScoreColor(selectedReport.score)}`}>
                    {selectedReport.score >= 90 ? 'Excellent' : selectedReport.score >= 70 ? 'Fair' : 'Needs Attention'}
                  </p>
                  <button 
                    onClick={() => window.print()}
                    className="mt-2 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline print:hidden"
                  >
                    <Download className="w-3 h-3" /> White-Label PDF
                  </button>
                </div>
              </div>

              {/* Report Content Tabs/Sections */}
              <div className="p-6 flex flex-col gap-8">
                {/* Findings Grid */}
                <section>
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                     <BarChart3 className="w-3 h-3" /> Key Findings ({selectedReport.findings.length})
                   </h3>
                   <div className="grid grid-cols-1 gap-3">
                     {selectedReport.findings.map((finding: any, i: number) => (
                       <div key={i} className="p-4 rounded-xl border border-border/40 bg-muted/10 flex gap-4">
                         <div className="mt-0.5">{getSeverityIcon(finding.severity)}</div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-border/40 uppercase tracking-widest">
                               {finding.category}
                             </span>
                             <h4 className="text-xs font-bold">{finding.description}</h4>
                           </div>
                           <p className="text-[11px] text-muted-foreground leading-relaxed">
                             <span className="font-bold text-primary">Recommendation:</span> {finding.recommendation}
                           </p>
                         </div>
                       </div>
                     ))}
                   </div>
                </section>

                {/* Analysis Deep Dive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Color Analysis */}
                   <div className="p-5 rounded-2xl border border-border/40 bg-white">
                      <div className="flex items-center gap-2 mb-4">
                        <Palette className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Color Compliance</h3>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[9px] text-muted-foreground mb-2">Detected Palette</p>
                          <div className="flex gap-1.5">
                            {selectedReport.colorAnalysis?.found?.map((c: string) => (
                              <div key={c} className="w-6 h-6 rounded shadow-inner" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                        </div>
                        {selectedReport.colorAnalysis?.violations?.length > 0 && (
                          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                             <p className="text-[9px] font-bold text-rose-700 uppercase mb-1">Violations Found</p>
                             <div className="flex gap-2">
                                {selectedReport.colorAnalysis.violations.map((c: string) => (
                                  <div key={c} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                                    <span className="text-[9px] font-mono font-bold text-rose-900">{c}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                   </div>

                   {/* Tone Analysis */}
                   <div className="p-5 rounded-2xl border border-border/40 bg-white">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Tone & Voice</h3>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-[9px] text-muted-foreground mb-1">Detected Tone</p>
                          <p className="text-xs font-bold">{selectedReport.toneAnalysis?.current || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground mb-1">Target Tone</p>
                          <p className="text-xs font-bold text-primary">{selectedReport.toneAnalysis?.target || "N/A"}</p>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${selectedReport.score}%` }} />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-border/60 rounded-2xl p-20 text-center flex flex-col items-center gap-4">
              <div className="p-4 bg-muted/50 rounded-full">
                <ShieldCheck className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Select a report to view details</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">Audit history is saved in the database for long-term consistency tracking.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
