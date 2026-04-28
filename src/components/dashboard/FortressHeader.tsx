"use client";

import { useState } from "react";
import { Upload, FileCheck, BookOpen } from "lucide-react";
import Link from "next/link";
import { UploadAssetModal } from "./UploadAssetModal";

export function FortressHeader() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold font-outfit">Brand Fortress</h1>
          <p className="text-xs text-muted-foreground">Intelligent Asset Management & Compliance.</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/fortress/auditor"
            className="bg-white border border-border/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Compliance Auditor
          </Link>
          <Link 
            href="/dashboard/fortress/guidelines"
            className="bg-white border border-border/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-muted/50 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            Brand Guidelines
          </Link>
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/80 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Asset
          </button>
        </div>
      </header>

      {showUpload && <UploadAssetModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
