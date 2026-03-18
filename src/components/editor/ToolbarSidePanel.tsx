import React, { useRef } from "react";
import { Search, Plus, Square, Circle, Triangle, Minus } from "lucide-react";
import type { ToolType, CanvasElement, EditorMode, CanvasSizePreset } from "./EditorShell";

interface ToolbarSidePanelProps {
  activeTool: ToolType;
  onAddElement: (el: Omit<CanvasElement, "id">) => void;
  onBackgroundChange: (bg: string) => void;
  canvasBackground: string;
  mode: EditorMode;
  onCanvasSizeChange: (preset: CanvasSizePreset) => void;
}

export const ToolbarSidePanel: React.FC<ToolbarSidePanelProps> = ({
  activeTool,
  onAddElement,
  onBackgroundChange,
  canvasBackground,
  mode,
  onCanvasSizeChange,
}) => {
  switch (activeTool) {
    case "templates":
      return <TemplatesPanel />;
    case "text":
      return <TextPanel onAddElement={onAddElement} />;
    case "media":
      return <MediaPanel onAddElement={onAddElement} mode={mode} />;
    case "uploads":
      return <UploadsPanel onAddElement={onAddElement} mode={mode} />;
    case "background":
      return <BackgroundPanel onBackgroundChange={onBackgroundChange} canvasBackground={canvasBackground} />;
    case "ai":
      return <AIPanel />;
    case "draw":
      return <DrawPanel onAddElement={onAddElement} />;
    case "layout":
      return <LayoutPanel mode={mode} onCanvasSizeChange={onCanvasSizeChange} />;
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

const TextPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const addText = (preset: "heading" | "subheading" | "body") => {
    const configs = {
      heading: { content: "Add a heading", fontSize: 48, fontWeight: "700", width: 400, height: 60 },
      subheading: { content: "Add a subheading", fontSize: 32, fontWeight: "600", width: 350, height: 45 },
      body: { content: "Add body text", fontSize: 18, fontWeight: "400", width: 300, height: 30 },
    };
    const cfg = configs[preset];
    onAddElement({
      type: "text",
      x: 100,
      y: 100 + Math.random() * 200,
      width: cfg.width,
      height: cfg.height,
      content: cfg.content,
      fontSize: cfg.fontSize,
      fontFamily: "Inter, sans-serif",
      fontWeight: cfg.fontWeight,
      color: "#000000",
      textAlign: "center",
      lineHeight: 1.2,
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => addText("heading")}
        className="w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add a heading
      </button>
      <button
        onClick={() => addText("subheading")}
        className="w-full h-10 rounded-lg border border-editor-toolbar-border text-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add a subheading
      </button>
      <button
        onClick={() => addText("body")}
        className="w-full h-9 rounded-lg border border-editor-toolbar-border text-muted-foreground text-[13px] hover:bg-accent transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Add body text
      </button>
      <div className="pt-3 border-t border-editor-toolbar-border">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Font combinations</p>
        <div className="space-y-2">
          {[
            { name: "Modern Sans", family: "Inter, sans-serif" },
            { name: "Classic Serif", family: "Georgia, serif" },
            { name: "Bold Impact", family: "Impact, sans-serif" },
            { name: "Monospace", family: "monospace" },
          ].map((combo) => (
            <div
              key={combo.name}
              className="p-3 rounded-lg border border-editor-toolbar-border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => onAddElement({
                type: "text",
                x: 100,
                y: 200,
                width: 300,
                height: 50,
                content: combo.name,
                fontSize: 32,
                fontFamily: combo.family,
                fontWeight: "700",
                color: "#000000",
                textAlign: "center",
              })}
            >
              <span className="text-[13px] text-foreground" style={{ fontFamily: combo.family }}>{combo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MediaPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void; mode: EditorMode }> = ({ onAddElement, mode }) => {
  const stockImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
  ];

  return (
    <div>
      <SearchBar placeholder={mode === "video" ? "Search photos & videos..." : "Search photos..."} />
      <div className="grid grid-cols-2 gap-2">
        {stockImages.map((src, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg border border-editor-toolbar-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
            onClick={() => onAddElement({
              type: "image",
              x: 100 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              width: 300,
              height: 225,
              src,
            })}
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadsPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void; mode: EditorMode }> = ({ onAddElement, mode }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxW = 500;
        const ratio = img.width / img.height;
        const w = Math.min(img.width, maxW);
        const h = w / ratio;
        onAddElement({
          type: "image",
          x: 100,
          y: 100,
          width: w,
          height: h,
          src: reader.result as string,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept={mode === "video" ? "image/*,video/*" : "image/*"} className="hidden" onChange={handleFileChange} />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full h-24 rounded-lg border-2 border-dashed border-editor-toolbar-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Plus size={24} strokeWidth={1.5} />
        <span className="text-[13px] font-medium">Upload files</span>
      </button>
      <p className="text-[11px] text-muted-foreground text-center">
        {mode === "video"
          ? "Drag & drop or click to upload images and videos"
          : "Drag & drop or click to upload images"}
      </p>
    </div>
  );
};

const BackgroundPanel: React.FC<{ onBackgroundChange: (bg: string) => void; canvasBackground: string }> = ({
  onBackgroundChange,
  canvasBackground,
}) => {
  const [customColor, setCustomColor] = React.useState(canvasBackground);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Colors</p>
        <div className="grid grid-cols-6 gap-2">
          {["#FFFFFF", "#000000", "#FF4444", "#FF8C00", "#FFD700", "#44BB44", "#4488FF", "#8844FF", "#FF44AA", "#666666", "#CCCCCC", "#2D1B69"].map((color) => (
            <button
              key={color}
              onClick={() => { onBackgroundChange(color); setCustomColor(color); }}
              className={`w-full aspect-square rounded-md border transition-transform hover:scale-110 ${canvasBackground === color ? "border-primary ring-2 ring-primary/30" : "border-editor-toolbar-border"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Custom Color</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); onBackgroundChange(e.target.value); }}
            className="w-10 h-10 rounded-md border border-editor-toolbar-border cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => { setCustomColor(e.target.value); if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onBackgroundChange(e.target.value); }}
            className="flex-1 h-9 px-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
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
              onClick={() => onBackgroundChange(gradient)}
              className={`w-full aspect-[4/3] rounded-md border transition-transform hover:scale-105 ${canvasBackground === gradient ? "border-primary ring-2 ring-primary/30" : "border-editor-toolbar-border"}`}
              style={{ background: gradient }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DrawPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const shapes = [
    { label: "Rectangle", icon: Square, shapeType: "rectangle" as const },
    { label: "Circle", icon: Circle, shapeType: "circle" as const },
    { label: "Triangle", icon: Triangle, shapeType: "triangle" as const },
    { label: "Line", icon: Minus, shapeType: "line" as const },
  ];

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Shapes</p>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.shapeType}
            onClick={() => onAddElement({
              type: "shape",
              x: 200,
              y: 200,
              width: shape.shapeType === "line" ? 300 : 150,
              height: shape.shapeType === "line" ? 4 : 150,
              shapeType: shape.shapeType,
              backgroundColor: "#4488FF",
              borderColor: "#000000",
              borderWidth: 0,
              borderRadius: 0,
              opacity: 100,
            })}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-editor-toolbar-border hover:border-primary/50 hover:bg-accent transition-colors cursor-pointer"
          >
            <shape.icon size={24} strokeWidth={1.5} />
            <span className="text-[11px] font-medium">{shape.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const IMAGE_SIZES: CanvasSizePreset[] = [
  { label: "Flyer (US Letter)", width: 2550, height: 3300, description: "8.5in × 11in" },
  { label: "Instagram Post", width: 1080, height: 1080, description: "1080 × 1080" },
  { label: "Facebook Post", width: 1200, height: 630, description: "1200 × 630" },
  { label: "Twitter/X Post", width: 1200, height: 675, description: "1200 × 675" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, description: "1280 × 720" },
  { label: "A4 Portrait", width: 2480, height: 3508, description: "210mm × 297mm" },
  { label: "Poster (24×36)", width: 2400, height: 3600, description: "24in × 36in" },
  { label: "Business Card", width: 1050, height: 600, description: "3.5in × 2in" },
];

const VIDEO_SIZES: CanvasSizePreset[] = [
  { label: "Instagram Reel", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "YouTube Video", width: 1920, height: 1080, description: "16:9 landscape" },
  { label: "TikTok Video", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Facebook Story", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Square Video", width: 1080, height: 1080, description: "1:1 square" },
  { label: "Twitter/X Video", width: 1200, height: 675, description: "16:9 landscape" },
];

const LayoutPanel: React.FC<{ mode: EditorMode; onCanvasSizeChange: (preset: CanvasSizePreset) => void }> = ({ mode, onCanvasSizeChange }) => {
  const sizes = mode === "video" ? VIDEO_SIZES : IMAGE_SIZES;

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Canvas Size</p>
      <div className="space-y-2">
        {sizes.map((item) => (
          <div
            key={item.label}
            onClick={() => onCanvasSizeChange(item)}
            className="flex items-center justify-between p-3 rounded-lg border border-editor-toolbar-border hover:border-primary/50 cursor-pointer transition-colors"
          >
            <span className="text-[13px] text-foreground">{item.label}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{item.description || `${item.width} × ${item.height}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
