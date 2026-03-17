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
  X,
} from "lucide-react";
import type { ToolType, CanvasElement } from "./EditorShell";
import { ToolbarSidePanel } from "./ToolbarSidePanel";

interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ElementType;
}

const tools: ToolItem[] = [
  { id: "uploads", label: "My Uploads", icon: Upload },
  { id: "templates", label: "Templates", icon: LayoutGrid },
  { id: "media", label: "Media", icon: Image },
  { id: "text", label: "Text", icon: Type },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "background", label: "Background", icon: Palette },
  { id: "layout", label: "Layout", icon: LayoutDashboard },
  { id: "record", label: "Record", icon: CircleDot },
  { id: "draw", label: "Draw", icon: Pencil },
  { id: "slideshow", label: "Slideshow", icon: Film },
  { id: "qrcode", label: "QR code", icon: QrCode },
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
}) => {
  // Mobile: horizontal bottom toolbar
  if (isMobile) {
    return (
      <div className="h-[60px] bg-editor-toolbar border-t border-editor-toolbar-border flex items-center px-2 gap-0.5 overflow-x-auto scrollbar-hide shrink-0 z-20">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool.id)}
            className={`
              flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-lg
              transition-colors duration-100 cursor-pointer shrink-0
              ${activeTool === tool.id ? "bg-accent text-primary" : "text-muted-foreground"}
            `}
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

  // Desktop
  return (
    <div className="flex shrink-0 h-full">
      <div className="w-[72px] bg-editor-toolbar border-r border-editor-toolbar-border flex flex-col items-center py-2 gap-0.5 overflow-y-auto scrollbar-hide">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id && sidebarExpanded;
          return (
            <button
              key={tool.id}
              onClick={() => onToolClick(tool.id)}
              className={`
                flex flex-col items-center justify-center w-[62px] h-[62px] rounded-lg
                transition-colors duration-100 cursor-pointer group
                ${isActive ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}
              `}
            >
              <tool.icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium leading-tight">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {sidebarExpanded && activeTool && (
        <div className="w-[280px] lg:w-[320px] bg-editor-toolbar border-r border-editor-toolbar-border flex flex-col relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-editor-toolbar-border">
            <h3 className="text-sm font-semibold text-foreground capitalize">
              {activeTool === "qrcode" ? "QR Code" : activeTool === "ai" ? "AI" : activeTool}
            </h3>
            <button
              onClick={onCloseSidebar}
              className="p-1 rounded hover:bg-accent transition-colors"
            >
              <X size={16} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto editor-scroll p-4">
            <ToolbarSidePanel
              activeTool={activeTool}
              onAddElement={onAddElement}
              onBackgroundChange={onBackgroundChange}
              canvasBackground={canvasBackground}
            />
          </div>
        </div>
      )}
    </div>
  );
};
