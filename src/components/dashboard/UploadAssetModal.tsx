"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, File as FileIcon } from "lucide-react";
import { uploadAssetAction } from "@/modules/pilar2-fortress/actions";

export function UploadAssetModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    const result = await uploadAssetAction(formData);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      alert("Failed to upload asset: " + (result as any).error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div>
            <h2 className="font-bold font-outfit">Upload Brand Asset</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Secure Digital Vault</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 flex flex-col gap-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group
              ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:border-primary/30 bg-muted/20 hover:bg-muted/30'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".svg,.png,.jpg,.jpeg,.pdf"
            />
            
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <FileIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-2 text-[10px] font-bold text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white border border-border/50 text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">Click or drag file here</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-medium">SVG, PNG, JPG, PDF (Max 50MB)</p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-muted transition-all border border-border/50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !selectedFile}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Secure Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
