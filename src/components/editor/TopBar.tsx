import React from "react";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  Share2,
  Download,
  Send,
  HelpCircle,
} from "lucide-react";

export const TopBar: React.FC = () => {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-editor-topbar border-b border-editor-topbar-border shrink-0 z-20">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-accent transition-colors duration-100">
          <ArrowLeft size={18} strokeWidth={1.5} className="text-foreground" />
        </button>

        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            postermywall
          </span>
        </div>

        <div className="h-5 w-px bg-editor-topbar-border mx-1" />

        <button className="text-[13px] font-medium text-foreground hover:bg-accent px-3 py-1.5 rounded-md transition-colors duration-100">
          File
        </button>
        <button className="text-[13px] font-medium text-foreground hover:bg-accent px-3 py-1.5 rounded-md transition-colors duration-100">
          Resize
        </button>

        <div className="h-5 w-px bg-editor-topbar-border mx-1" />

        <button className="p-2 rounded-md hover:bg-accent transition-colors duration-100">
          <Undo2 size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors duration-100">
          <Redo2 size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-accent transition-colors duration-100">
          <HelpCircle size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </button>

        <button className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-[13px] font-semibold px-4 py-2 rounded-md transition-colors duration-100">
          ✦ Upgrade
        </button>

        <button className="inline-flex items-center gap-1.5 border border-editor-topbar-border hover:bg-accent text-foreground text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100">
          <Save size={15} strokeWidth={1.5} />
          Save
        </button>

        <button className="inline-flex items-center gap-1.5 border border-editor-topbar-border hover:bg-accent text-foreground text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100">
          <Share2 size={15} strokeWidth={1.5} />
          Share
        </button>

        <button className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100">
          <Download size={15} strokeWidth={1.5} />
          Download
        </button>

        <button className="inline-flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background text-[13px] font-semibold px-4 py-2 rounded-md transition-colors duration-100">
          Publish
          <Send size={14} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};
