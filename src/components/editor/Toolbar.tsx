import React from "react";
import {
  Upload,
  LayoutGrid,
  Image,
  Type,
  Sparkles,
  Palette,
  LayoutDashboard,
  CircleDot,
  Pencil,
  Film,
  QrCode,
  MoreHorizontal,
  Table2,
} from "lucide-react";
import type {
  ToolType,
  CanvasElement,
  EditorMode,
  CanvasSizePreset,
} from "./EditorShell";
import { ToolbarSidePanel } from "./ToolbarSidePanel";

interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ElementType;
  modes: EditorMode[];
}

const tools: ToolItem[] = [
  { id: "uploads", label: "My Uploads", icon: Upload, modes: ["image", "video"] },
  { id: "templates", label: "Templates", icon: LayoutGrid, modes: ["image", "video"] },
  { id: "media", label: "Media", icon: Image, modes: ["image", "video"] },
  { id: "text", label: "Text", icon: Type, modes: ["image", "video"] },
  { id: "ai", label: "AI", icon: Sparkles, modes: ["image", "video"] },
  { id: "background", label: "Background", icon: Palette, modes: ["image", "video"] },
  { id: "layout", label: "Layout", icon: LayoutDashboard, modes: ["image", "video"] },
  { id: "table", label: "Table", icon: Table2, modes: ["image", "video"] },
  { id: "record", label: "Record", icon: CircleDot, modes: ["video"] },
  { id: "draw", label: "Draw", icon: Pencil, modes: ["image", "video"] },
  { id: "slideshow", label: "Slideshow", icon: Film, modes: ["video"] },
  { id: "qrcode", label: "QR code", icon: QrCode, modes: ["image", "video"] },
];


interface ToolbarProps {
  activeTool: ToolType | null;
  onToolClick: (tool: ToolType) => void;
  sidebarExpanded: boolean;
  onCloseSidebar: () => void;
  isMobile?: boolean;
  onAddElement: (el: Omit<CanvasElement, "id">) => void;
  onBackgroundChange: (bg: string) => void;
  canvasBackground: string;
  mode: EditorMode;
  onCanvasSizeChange: (preset: CanvasSizePreset) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolClick,
  sidebarExpanded,
  onCloseSidebar,
  isMobile,
  onAddElement,
  onBackgroundChange,
  canvasBackground,
  mode,
  onCanvasSizeChange,
}) => {
    const filteredTools = tools.filter((t) => t.modes.includes(mode));
  const visibleTools = filteredTools.slice(0, 10);
  const hasMoreTools = filteredTools.length > 10;

  const [panelHeight, setPanelHeight] = React.useState(560);
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);

  const VIEWPORT_MARGIN = 16;

  React.useLayoutEffect(() => {
    if (!panelRef.current) return;
    const nextHeight = panelRef.current.offsetHeight;
    if (nextHeight && nextHeight !== panelHeight) {
      setPanelHeight(nextHeight);
    }
  }, [activeTool, sidebarExpanded, panelHeight]);

  React.useEffect(() => {
    if (!activeTool || !sidebarExpanded) {
      setAnchorRect(null);
      return;
    }

    const btn = buttonRefs.current[activeTool];
    if (!btn) return;

    const updateRect = () => {
      setAnchorRect(btn.getBoundingClientRect());
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [activeTool, sidebarExpanded]);

  React.useEffect(() => {
    if (!sidebarExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedToolbarButton = Object.values(buttonRefs.current).some(
        (btn) => btn && btn.contains(target)
      );

      if (clickedToolbarButton) return;
      if (panelRef.current?.contains(target)) return;

      onCloseSidebar();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarExpanded, onCloseSidebar]);

   const floatingPosition = React.useMemo(() => {
    if (!anchorRect || !sidebarExpanded || typeof window === "undefined") return null;

    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight - VIEWPORT_MARGIN * 2;
    const effectiveHeight = Math.min(panelHeight, maxHeight);

    const anchorCenterY = anchorRect.top + anchorRect.height / 2;
    const rawTop = anchorCenterY - effectiveHeight / 2;

    const minTop = VIEWPORT_MARGIN;
    const maxTop = viewportHeight - effectiveHeight - VIEWPORT_MARGIN;
    const top = Math.max(minTop, Math.min(rawTop, Math.max(minTop, maxTop)));

    const left = anchorRect.right + 16;

    const notchCenterY = anchorCenterY - top;
    const notchMin = 24;
    const notchMax = effectiveHeight - 24;
    const notchTop = Math.max(notchMin, Math.min(notchCenterY, notchMax));

    return {
      top,
      left,
      notchTop,
      maxHeight,
    };
  }, [anchorRect, sidebarExpanded, panelHeight]);



  if (isMobile) {
    
    return (
      <div className="h-[60px] bg-background border-t border-border flex items-center px-2 gap-0.5 overflow-x-auto scrollbar-hide shrink-0 z-20">
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-lg transition-colors duration-100 cursor-pointer shrink-0 ${
              activeTool === tool.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            <tool.icon size={18} strokeWidth={1.5} />
            <span className="text-[9px] mt-0.5 font-medium leading-tight whitespace-nowrap">
              {tool.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative shrink-0 h-full pl-3 pt-3 flex items-center">
        <div className="w-[82px] rounded-2xl border border-[#d8d4f7] bg-white shadow-[0_10px_30px_rgba(92,70,160,0.08)] px-2 py-3 flex flex-col items-center gap-1">
          {visibleTools.map((tool) => {
            const isActive = activeTool === tool.id && sidebarExpanded;

            return (
              <button
                key={tool.id}
                ref={(el) => {
                  buttonRefs.current[tool.id] = el;
                }}
                onClick={() => onToolClick(tool.id)}
                className={`relative flex h-[58px] w-full flex-col items-center justify-center rounded-xl transition-colors duration-150 ${
                  isActive
                    ? "bg-[#d7d7fc] text-[#7650e3]"
                    : "text-[#4f5570] hover:bg-[#f7f4ff] hover:text-[#7650e3]"
                }`}
              >
                <tool.icon size={18} strokeWidth={1.75} />
                <span className="mt-1 text-[11px] font-medium leading-tight text-center">
                  {tool.label}
                </span>
              </button>
            );
          })}

          {hasMoreTools && (
            <button
              type="button"
              className="mt-1 flex h-[58px] w-full flex-col items-center justify-center rounded-xl text-[#4f5570] transition-colors duration-150 hover:bg-[#f7f4ff] hover:text-[#7650e3]"
            >
              <MoreHorizontal size={18} strokeWidth={1.75} />
              <span className="mt-1 text-[11px] font-medium leading-tight text-center">
                More
              </span>
            </button>
          )}
        </div>
      </div>

            {sidebarExpanded && activeTool && anchorRect && floatingPosition && (
        <div
          ref={panelRef}
          className="fixed z-40 w-[320px]"
          style={{
            top: floatingPosition.top,
            left: floatingPosition.left,
            maxHeight: floatingPosition.maxHeight,
          }}
        >
          {/* notch */}
          <div
            className="absolute left-[-10px] h-5 w-5 -translate-y-1/2 rotate-45 border-b border-l border-[#d8d4f7] bg-white"
            style={{
              top: floatingPosition.notchTop,
            }}
          />

          {/* floating panel */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[#d8d4f7] bg-white shadow-[0_10px_30px_rgba(92,70,160,0.12)]"
            style={{
              maxHeight: floatingPosition.maxHeight,
            }}
          >
            <div
              className="overflow-y-auto p-4"
              style={{
                maxHeight: floatingPosition.maxHeight,
              }}
            >
              <ToolbarSidePanel
                activeTool={activeTool}
                onAddElement={onAddElement}
                onBackgroundChange={onBackgroundChange}
                canvasBackground={canvasBackground}
                mode={mode}
                onCanvasSizeChange={onCanvasSizeChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};