"use server";

import { BrandGenesisService } from "@/modules/pilar1-genesis/services";
import { getDiscoveryLogsAction } from "@/modules/pilar1-genesis/actions";
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Bot, 
  User,
  Trash2
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function clearHistoryAction() {
  "use server";
  const workspace = await BrandGenesisService.getOrCreateDefaultWorkspace();
  if (prisma.discoveryLog) {
    await prisma.discoveryLog.deleteMany({
      where: { workspaceId: workspace.id }
    });
  }
  revalidatePath("/dashboard/genesis/history");
  redirect("/dashboard/genesis");
}

export default async function DiscoveryHistoryPage() {
  const logRes = await getDiscoveryLogsAction();
  const logs = logRes.success ? logRes.data : [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/genesis"
            className="p-2 hover:bg-muted rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-outfit">Riwayat Percakapan</h1>
            <p className="text-sm text-muted-foreground">Log lengkap proses pembentukan strategi brand Anda.</p>
          </div>
        </div>

        {logs.length > 0 && (
          <form action={clearHistoryAction}>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          </form>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-white border border-dashed border-border p-20 rounded-3xl text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-1">Belum ada riwayat</h3>
          <p className="text-sm text-muted-foreground mb-6">Mulai ngobrol dengan AI Mentor untuk membangun strategi brand.</p>
          <Link 
            href="/dashboard/genesis/discovery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Mulai Discovery
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log: any) => (
            <div 
              key={log.id}
              className={`p-6 rounded-2xl border ${
                log.role === "ai" 
                ? "bg-primary/5 border-primary/10 ml-0 mr-12" 
                : "bg-white border-border/50 ml-12 mr-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${log.role === "ai" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {log.role === "ai" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {log.role === "ai" ? "Branding Mentor" : "Anda"} • {log.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-outfit">
                <ReactMarkdown>{log.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          <div className="pt-10 border-t border-dashed border-border text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Calendar className="w-3 h-3" />
              Sesi Terakhir: {logs[logs.length - 1].createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
