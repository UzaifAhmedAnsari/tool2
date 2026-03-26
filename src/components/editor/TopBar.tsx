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
  MoreHorizontal,
} from "lucide-react";
import type { EditorMode } from "./EditorShell";

interface TopBarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isMobile: boolean;
  mode: EditorMode;
  onBack: () => void;
  onDownload?: () => void;
  onResize?: () => void;
  onAI?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ undo, redo, canUndo, canRedo, isMobile, mode, onBack, onDownload, onResize, onAI }) => {
  if (isMobile) {
    return (
      <header className="h-12 flex items-center justify-between px-3 bg-primary shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} className="text-primary-foreground" />
          </button>
          <span className="text-sm font-semibold text-primary-foreground">
            {mode === "video" ? "Video Editor" : "Editor"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors disabled:opacity-30"
          >
            <Undo2 size={16} strokeWidth={1.5} className="text-primary-foreground/80" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors disabled:opacity-30"
          >
            <Redo2 size={16} strokeWidth={1.5} className="text-primary-foreground/80" />
          </button>
          <button className="inline-flex items-center gap-1 bg-primary-foreground text-primary text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
            <Download size={13} strokeWidth={1.5} />
            Save
          </button>
          <button className="p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors">
            <MoreHorizontal size={18} strokeWidth={1.5} className="text-primary-foreground/80" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-[52px] flex items-center justify-between px-4 bg-primary shrink-0 z-20">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors duration-100">
          <ArrowLeft size={18} strokeWidth={1.5} className="text-primary-foreground" />
        </button>

        <div className="h-5 w-px bg-primary-foreground/20 mx-1" />

        <button className="text-[13px] font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md transition-colors duration-100">
          File
        </button>
        <button className="text-[13px] font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md transition-colors duration-100" onClick={onDownload}>
          Download
        </button>
        <button className="text-[13px] font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md transition-colors duration-100" onClick={onResize}>
          Resize
        </button>
        <button className="text-[13px] font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md transition-colors duration-100" onClick={onAI}>
          AI Writer
        </button>

        <div className="h-5 w-px bg-primary-foreground/20 mx-1" />

        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors duration-100 disabled:opacity-30"
        >
          <Undo2 size={18} strokeWidth={1.5} className="text-primary-foreground/70" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors duration-100 disabled:opacity-30"
        >
          <Redo2 size={18} strokeWidth={1.5} className="text-primary-foreground/70" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors duration-100">
          <HelpCircle size={18} strokeWidth={1.5} className="text-primary-foreground/70" />
        </button>

        <button className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 text-[13px] font-semibold px-4 py-2 rounded-md transition-colors duration-100">
          ✦ Upgrade
        </button>

        <button className="inline-flex items-center gap-1.5 border border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100">
          <Save size={15} strokeWidth={1.5} />
          Save
        </button>

        <button className="inline-flex items-center gap-1.5 border border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100">
          <Share2 size={15} strokeWidth={1.5} />
          Share
        </button>

        <button className="inline-flex items-center gap-1.5 bg-primary-foreground hover:bg-primary-foreground/90 text-primary text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-100" onClick={onDownload}>
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
