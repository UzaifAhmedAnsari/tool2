import React from "react";
import { Pencil, Music } from "lucide-react";

export const TimelineBar: React.FC = () => {
  return (
    <div className="h-11 bg-editor-toolbar border-t border-editor-toolbar-border flex items-center px-4 gap-4 shrink-0">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground tabular-nums">
        <span>00:00</span>
        <span>/</span>
        <span>01:33</span>
      </div>

      <button className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent">
        <Pencil size={13} strokeWidth={1.5} />
        Edit timeline
      </button>

      <button className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
        <Music size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
};
