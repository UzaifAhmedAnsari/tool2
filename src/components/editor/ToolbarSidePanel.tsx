import React from "react";
import { Search, Plus } from "lucide-react";
import type { ToolType } from "./EditorShell";

interface ToolbarSidePanelProps {
  activeTool: ToolType;
}

export const ToolbarSidePanel: React.FC<ToolbarSidePanelProps> = ({ activeTool }) => {
  switch (activeTool) {
    case "templates":
      return <TemplatesPanel />;
    case "text":
      return <TextPanel />;
    case "media":
      return <MediaPanel />;
    case "uploads":
      return <UploadsPanel />;
    case "background":
      return <BackgroundPanel />;
    case "ai":
      return <AIPanel />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-sm">Coming soon</p>
        </div>
      );
  }
};

const SearchBar: React.FC<{ placeholder?: string }> = ({ placeholder = "Search..." }) => (
  <div className="relative mb-4">
    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-9 pl-9 pr-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
    />
  </div>
);

const TemplatesPanel: React.FC = () => (
  <div>
    <SearchBar placeholder="Search templates..." />
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg bg-gradient-to-br from-accent to-muted border border-editor-toolbar-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
        >
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-[11px]">Template {i + 1}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TextPanel: React.FC = () => (
  <div className="space-y-3">
    <button className="w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
      <Plus size={16} />
      Add a heading
    </button>
    <button className="w-full h-10 rounded-lg border border-editor-toolbar-border text-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
      <Plus size={16} />
      Add a subheading
    </button>
    <button className="w-full h-9 rounded-lg border border-editor-toolbar-border text-muted-foreground text-[13px] hover:bg-accent transition-colors flex items-center justify-center gap-2">
      <Plus size={14} />
      Add body text
    </button>
    <div className="pt-3 border-t border-editor-toolbar-border">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Font combinations</p>
      <div className="space-y-2">
        {["Modern Sans", "Classic Serif", "Bold Impact", "Elegant Script"].map((combo) => (
          <div
            key={combo}
            className="p-3 rounded-lg border border-editor-toolbar-border hover:border-primary/50 cursor-pointer transition-colors"
          >
            <span className="text-[13px] text-foreground">{combo}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MediaPanel: React.FC = () => (
  <div>
    <SearchBar placeholder="Search photos & videos..." />
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-lg bg-gradient-to-br from-muted to-accent border border-editor-toolbar-border hover:border-primary/50 transition-colors cursor-pointer"
        />
      ))}
    </div>
  </div>
);

const UploadsPanel: React.FC = () => (
  <div className="space-y-4">
    <button className="w-full h-24 rounded-lg border-2 border-dashed border-editor-toolbar-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
      <Plus size={24} strokeWidth={1.5} />
      <span className="text-[13px] font-medium">Upload files</span>
    </button>
    <p className="text-[11px] text-muted-foreground text-center">
      Drag & drop or click to upload images and videos
    </p>
  </div>
);

const BackgroundPanel: React.FC = () => (
  <div className="space-y-4">
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Colors</p>
      <div className="grid grid-cols-6 gap-2">
        {["#000000", "#FFFFFF", "#FF4444", "#FF8C00", "#FFD700", "#44BB44", "#4488FF", "#8844FF", "#FF44AA", "#666666", "#CCCCCC", "#2D1B69"].map((color) => (
          <button
            key={color}
            className="w-full aspect-square rounded-md border border-editor-toolbar-border hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Gradients</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        ].map((gradient, i) => (
          <button
            key={i}
            className="w-full aspect-[4/3] rounded-md border border-editor-toolbar-border hover:scale-105 transition-transform"
            style={{ background: gradient }}
          />
        ))}
      </div>
    </div>
  </div>
);

const AIPanel: React.FC = () => (
  <div className="space-y-4">
    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent border border-primary/20">
      <p className="text-sm font-semibold text-foreground mb-1">AI Design Assistant</p>
      <p className="text-[12px] text-muted-foreground">Describe what you want to create and let AI help you design it.</p>
    </div>
    <textarea
      placeholder="Describe your design idea..."
      className="w-full h-24 p-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
    />
    <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
      Generate
    </button>
  </div>
);
