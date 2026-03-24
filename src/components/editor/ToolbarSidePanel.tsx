import React, { useRef, useState } from "react";
import { Search, Plus, Square, Circle, Triangle, Minus, Star, Hexagon, Heart, Pen, Type, Bold, Italic, Underline } from "lucide-react";
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
      return <AIPanel onAddElement={onAddElement} />;
    case "draw":
      return <DrawPanel onAddElement={onAddElement} />;
    case "layout":
      return <LayoutPanel mode={mode} onCanvasSizeChange={onCanvasSizeChange} />;
    case "qrcode":
      return <QRCodePanel onAddElement={onAddElement} />;
    case "record":
      return <RecordPanel />;
    case "slideshow":
      return <SlideshowPanel />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <p className="text-sm">Coming soon</p>
        </div>
      );
  }
};

const SearchBar: React.FC<{ placeholder?: string; value?: string; onChange?: (v: string) => void }> = ({
  placeholder = "Search...",
  value,
  onChange,
}) => (
  <div className="relative mb-4">
    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full h-9 pl-9 pr-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
    />
  </div>
);

// ── Templates ──
const TemplatesPanel: React.FC = () => {
  const [search, setSearch] = useState("");
  const categories = ["All", "Business", "Event", "Social", "Sale", "Food", "Music", "Sports"];
  const [activeCat, setActiveCat] = useState("All");

  return (
    <div>
      <SearchBar placeholder="Search templates..." value={search} onChange={setSearch} />
      <div className="flex gap-1 mb-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${
              activeCat === cat ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
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
};

// ── Text ──
const FONT_LIST = [
  { name: "Inter", family: "'Inter', sans-serif" },
  { name: "Georgia", family: "Georgia, serif" },
  { name: "Arial", family: "Arial, sans-serif" },
  { name: "Times New Roman", family: "'Times New Roman', serif" },
  { name: "Impact", family: "Impact, sans-serif" },
  { name: "Courier New", family: "'Courier New', monospace" },
  { name: "Verdana", family: "Verdana, sans-serif" },
  { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif" },
  { name: "Palatino", family: "'Palatino Linotype', serif" },
  { name: "Garamond", family: "Garamond, serif" },
  { name: "Comic Sans MS", family: "'Comic Sans MS', cursive" },
  { name: "Lucida Console", family: "'Lucida Console', monospace" },
];

const TextPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const addText = (preset: "heading" | "subheading" | "body") => {
    const configs = {
      heading: { content: "Add a heading", fontSize: 48, fontWeight: "700", width: 400, height: 65 },
      subheading: { content: "Add a subheading", fontSize: 32, fontWeight: "600", width: 350, height: 48 },
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
      fontFamily: "'Inter', sans-serif",
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
        className="w-full h-14 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        Add a heading
      </button>
      <button
        onClick={() => addText("subheading")}
        className="w-full h-11 rounded-lg border-2 border-editor-toolbar-border text-foreground text-base font-semibold hover:bg-accent transition-colors flex items-center justify-center"
      >
        Add a subheading
      </button>
      <button
        onClick={() => addText("body")}
        className="w-full h-9 rounded-lg border border-editor-toolbar-border text-muted-foreground text-sm hover:bg-accent transition-colors flex items-center justify-center"
      >
        Add body text
      </button>

      <div className="pt-3 border-t border-editor-toolbar-border">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Font combinations</p>
        <div className="space-y-2">
          {FONT_LIST.slice(0, 6).map((font) => (
            <div
              key={font.name}
              className="p-3 rounded-lg border border-editor-toolbar-border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() =>
                onAddElement({
                  type: "text",
                  x: 100,
                  y: 200,
                  width: 350,
                  height: 55,
                  content: font.name,
                  fontSize: 36,
                  fontFamily: font.family,
                  fontWeight: "700",
                  color: "#000000",
                  textAlign: "center",
                })
              }
            >
              <span className="text-base text-foreground font-bold" style={{ fontFamily: font.family }}>
                {font.name}
              </span>
              <span className="block text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: font.family }}>
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Media ──
const MediaPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void; mode: EditorMode }> = ({
  onAddElement,
  mode,
}) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"photos" | "icons">("photos");

  const stockImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop",
  ];

  return (
    <div>
      <SearchBar
        placeholder={mode === "video" ? "Search photos & videos..." : "Search photos & icons..."}
        value={search}
        onChange={setSearch}
      />
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setTab("photos")}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
            tab === "photos" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
          }`}
        >
          Photos
        </button>
        <button
          onClick={() => setTab("icons")}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
            tab === "icons" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
          }`}
        >
          Icons & Shapes
        </button>
      </div>
      {tab === "photos" ? (
        <div className="grid grid-cols-2 gap-2">
          {stockImages.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-lg border border-editor-toolbar-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
              onClick={() =>
                onAddElement({
                  type: "image",
                  x: 100 + Math.random() * 100,
                  y: 100 + Math.random() * 100,
                  width: 300,
                  height: 225,
                  src,
                })
              }
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {[Square, Circle, Triangle, Star, Hexagon, Heart, Minus, Pen].map((Icon, i) => (
            <button
              key={i}
              onClick={() =>
                onAddElement({
                  type: "shape",
                  x: 200,
                  y: 200,
                  width: 150,
                  height: 150,
                  shapeType: i === 0 ? "rectangle" : i === 1 ? "circle" : i === 2 ? "triangle" : "rectangle",
                  backgroundColor: "#4488FF",
                  borderWidth: 0,
                  opacity: 100,
                })
              }
              className="aspect-square rounded-lg border border-editor-toolbar-border hover:border-primary/50 hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon size={20} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Uploads ──
const UploadsPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void; mode: EditorMode }> = ({
  onAddElement,
  mode,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploads((prev) => [dataUrl, ...prev]);
        const img = new window.Image();
        img.onload = () => {
          const maxW = 500;
          const ratio = img.width / img.height;
          const w = Math.min(img.width, maxW);
          const h = w / ratio;
          onAddElement({ type: "image", x: 100, y: 100, width: w, height: h, src: dataUrl });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept={mode === "video" ? "image/*,video/*" : "image/*"}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full h-28 rounded-lg border-2 border-dashed border-editor-toolbar-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Plus size={28} strokeWidth={1.5} />
        <span className="text-sm font-medium">Upload files</span>
        <span className="text-[11px] text-muted-foreground">or drag and drop</span>
      </button>

      {uploads.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Your uploads
          </p>
          <div className="grid grid-cols-2 gap-2">
            {uploads.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-lg border border-editor-toolbar-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
                onClick={() => {
                  const img = new window.Image();
                  img.onload = () => {
                    const maxW = 500;
                    const ratio = img.width / img.height;
                    const w = Math.min(img.width, maxW);
                    const h = w / ratio;
                    onAddElement({ type: "image", x: 100, y: 100, width: w, height: h, src });
                  };
                  img.src = src;
                }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Background ──
const BackgroundPanel: React.FC<{ onBackgroundChange: (bg: string) => void; canvasBackground: string }> = ({
  onBackgroundChange,
  canvasBackground,
}) => {
  const [customColor, setCustomColor] = useState(canvasBackground.startsWith("#") ? canvasBackground : "#FFFFFF");
  const [tab, setTab] = useState<"colors" | "gradients" | "patterns">("colors");

  const colors = [
    "#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD",
    "#6C757D", "#495057", "#343A40", "#212529", "#000000",
    "#FF0000", "#FF4444", "#FF6B6B", "#FF8C00", "#FFA500", "#FFD700",
    "#FFEB3B", "#8BC34A", "#4CAF50", "#00BCD4", "#2196F3", "#3F51B5",
    "#673AB7", "#9C27B0", "#E91E63", "#F44336",
  ];

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-1">
        {(["colors", "gradients", "patterns"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-[11px] font-medium rounded-md capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "colors" && (
        <>
          <div className="grid grid-cols-8 gap-1.5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => { onBackgroundChange(color); setCustomColor(color); }}
                className={`w-full aspect-square rounded-md border transition-transform hover:scale-110 ${
                  canvasBackground === color ? "border-primary ring-2 ring-primary/30 scale-110" : "border-editor-toolbar-border"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-2">Custom</p>
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
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onBackgroundChange(e.target.value);
                }}
                className="flex-1 h-9 px-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
              />
            </div>
          </div>
          <button
            onClick={() => onBackgroundChange("transparent")}
            className={`w-full h-9 rounded-lg border text-[13px] font-medium transition-colors ${
              canvasBackground === "transparent"
                ? "border-primary bg-primary/10 text-primary"
                : "border-editor-toolbar-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Transparent
          </button>
        </>
      )}

      {tab === "gradients" && (
        <div className="grid grid-cols-3 gap-2">
          {gradients.map((gradient, i) => (
            <button
              key={i}
              onClick={() => onBackgroundChange(gradient)}
              className={`w-full aspect-[4/3] rounded-md border transition-transform hover:scale-105 ${
                canvasBackground === gradient ? "border-primary ring-2 ring-primary/30" : "border-editor-toolbar-border"
              }`}
              style={{ background: gradient }}
            />
          ))}
        </div>
      )}

      {tab === "patterns" && (
        <div className="text-center py-6 text-muted-foreground text-[13px]">
          Pattern backgrounds coming soon
        </div>
      )}
    </div>
  );
};

// ── Draw / Shapes ──
const DrawPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const shapes = [
    { label: "Rectangle", icon: Square, shapeType: "rectangle" as const, w: 200, h: 150 },
    { label: "Circle", icon: Circle, shapeType: "circle" as const, w: 150, h: 150 },
    { label: "Triangle", icon: Triangle, shapeType: "triangle" as const, w: 180, h: 150 },
    { label: "Line", icon: Minus, shapeType: "line" as const, w: 300, h: 4 },
  ];

  const colors = ["#4488FF", "#FF4444", "#FFD700", "#44BB44", "#FF44AA", "#8844FF", "#000000", "#FFFFFF"];

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Basic Shapes</p>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.shapeType}
            onClick={() =>
              onAddElement({
                type: "shape",
                x: 200,
                y: 200,
                width: shape.w,
                height: shape.h,
                shapeType: shape.shapeType,
                backgroundColor: "#4488FF",
                borderColor: "#000000",
                borderWidth: 0,
                borderRadius: 0,
                opacity: 100,
              })
            }
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-editor-toolbar-border hover:border-primary/50 hover:bg-accent transition-colors cursor-pointer"
          >
            <shape.icon size={28} strokeWidth={1.5} />
            <span className="text-[11px] font-medium">{shape.label}</span>
          </button>
        ))}
      </div>

      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-4">Quick Colors</p>
      <div className="grid grid-cols-8 gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() =>
              onAddElement({
                type: "shape",
                x: 200,
                y: 200,
                width: 200,
                height: 150,
                shapeType: "rectangle",
                backgroundColor: color,
                borderWidth: 0,
                opacity: 100,
              })
            }
            className="w-full aspect-square rounded-md border border-editor-toolbar-border hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Layout ──
const IMAGE_SIZES: CanvasSizePreset[] = [
  { label: "Instagram Post", width: 1080, height: 1080, description: "1080 × 1080" },
  { label: "Instagram Story", width: 1080, height: 1920, description: "1080 × 1920" },
  { label: "Instagram Portrait", width: 1080, height: 1350, description: "1080 × 1350" },
  { label: "Flyer (US Letter)", width: 2550, height: 3300, description: "8.5 × 11in" },
  { label: "Facebook Post", width: 1200, height: 630, description: "1200 × 630" },
  { label: "Twitter/X Post", width: 1200, height: 675, description: "1200 × 675" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, description: "1280 × 720" },
  { label: "A4 Portrait", width: 2480, height: 3508, description: "210 × 297mm" },
  { label: "Poster (24×36)", width: 2400, height: 3600, description: "24 × 36in" },
  { label: "Business Card", width: 1050, height: 600, description: "3.5 × 2in" },
  { label: "Album Cover", width: 1600, height: 1600, description: "1600 × 1600" },
  { label: "Logo", width: 600, height: 600, description: "600 × 600" },
  { label: "Facebook Cover", width: 851, height: 315, description: "851 × 315" },
  { label: "LinkedIn Background", width: 1400, height: 425, description: "1400 × 425" },
  { label: "Pinterest Graphic", width: 735, height: 1102, description: "735 × 1102" },
];

const VIDEO_SIZES: CanvasSizePreset[] = [
  { label: "Instagram Reel", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "YouTube Video", width: 1920, height: 1080, description: "16:9 landscape" },
  { label: "TikTok Video", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Facebook Story", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Square Video", width: 1080, height: 1080, description: "1:1 square" },
  { label: "Twitter/X Video", width: 1200, height: 675, description: "16:9 landscape" },
];

const LayoutPanel: React.FC<{ mode: EditorMode; onCanvasSizeChange: (preset: CanvasSizePreset) => void }> = ({
  mode,
  onCanvasSizeChange,
}) => {
  const [search, setSearch] = useState("");
  const sizes = mode === "video" ? VIDEO_SIZES : IMAGE_SIZES;
  const filtered = search ? sizes.filter((s) => s.label.toLowerCase().includes(search.toLowerCase())) : sizes;

  return (
    <div className="space-y-3">
      <SearchBar placeholder="Search sizes..." value={search} onChange={setSearch} />
      <div className="space-y-1">
        {filtered.map((item) => (
          <button
            key={item.label}
            onClick={() => onCanvasSizeChange(item)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <span className="text-[13px] font-medium text-foreground">{item.label}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── AI ──
const AIPanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text" | "image">("text");

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20">
        <p className="text-sm font-semibold text-foreground mb-1">AI Design Assistant</p>
        <p className="text-[12px] text-muted-foreground">
          Describe what you want to create and let AI help you design it.
        </p>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
            mode === "text" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
          }`}
        >
          Generate Text
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
            mode === "image" ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
          }`}
        >
          Generate Image
        </button>
      </div>

      <textarea
        placeholder={
          mode === "text" ? "Describe the text content you need..." : "Describe the image you want to generate..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-24 p-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
      />
      <button
        onClick={() => {
          if (!prompt.trim()) return;
          if (mode === "text") {
            onAddElement({
              type: "text",
              x: 100,
              y: 200,
              width: 400,
              height: 60,
              content: prompt,
              fontSize: 24,
              fontFamily: "'Inter', sans-serif",
              fontWeight: "400",
              color: "#000000",
              textAlign: "center",
            });
          }
          setPrompt("");
        }}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Generate
      </button>
    </div>
  );
};

// ── QR Code ──
const QRCodePanel: React.FC<{ onAddElement: (el: Omit<CanvasElement, "id">) => void }> = ({ onAddElement }) => {
  const [url, setUrl] = useState("https://example.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const generateQR = () => {
    // Use a QR code API to generate the image
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=${fgColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;
    onAddElement({
      type: "image",
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      src: qrUrl,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          URL or Text
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL or text..."
          className="w-full h-9 px-3 text-[13px] bg-accent/50 border border-editor-toolbar-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground mb-1 block">Foreground</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-9 rounded-md border border-editor-toolbar-border cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-muted-foreground mb-1 block">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-9 rounded-md border border-editor-toolbar-border cursor-pointer"
          />
        </div>
      </div>
      <button
        onClick={generateQR}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Add QR Code
      </button>
    </div>
  );
};

// ── Record (Video only) ──
const RecordPanel: React.FC = () => (
  <div className="space-y-4">
    <div className="p-4 rounded-lg bg-accent border border-editor-toolbar-border text-center">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">Record yourself</p>
      <p className="text-[12px] text-muted-foreground">Record your camera or screen and add it to your design.</p>
    </div>
    <button className="w-full h-10 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors">
      Start Recording
    </button>
  </div>
);

// ── Slideshow (Video only) ──
const SlideshowPanel: React.FC = () => (
  <div className="space-y-4">
    <div className="p-4 rounded-lg bg-accent border border-editor-toolbar-border">
      <p className="text-sm font-medium text-foreground mb-1">Slideshow</p>
      <p className="text-[12px] text-muted-foreground">
        Create a slideshow by adding multiple slides with transitions and timing.
      </p>
    </div>
    <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
      Add Slide
    </button>
  </div>
);
