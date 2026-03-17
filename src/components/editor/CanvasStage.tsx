import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { CanvasElement } from "./EditorShell";

interface CanvasStageProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  zoom,
  onZoomChange,
}) => {
  const canvasWidth = 700;
  const canvasHeight = 700;

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "hsl(var(--editor-canvas-bg))" }}
      onClick={() => onSelectElement(null)}
    >
      {/* Canvas container - centered */}
      <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8">
        <div
          className="relative shrink-0 rounded-sm overflow-hidden"
          style={{
            width: canvasWidth * (zoom / 100),
            height: canvasHeight * (zoom / 100),
            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.4)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Canvas background */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #1a0a2e 0%, #2d1654 30%, #1a0a2e 100%)",
            }}
          />

          {/* Decorative elements to mimic the poster look */}
          <div className="absolute inset-0 opacity-20" style={{
            background: "radial-gradient(circle at 50% 60%, rgba(255,165,0,0.4) 0%, transparent 60%)"
          }} />

          {/* Canvas elements */}
          {elements.map((el) => (
            <CanvasElementRenderer
              key={el.id}
              element={el}
              isSelected={selectedElementId === el.id}
              onSelect={() => onSelectElement(el.id)}
              zoom={zoom}
            />
          ))}
        </div>
      </div>

      {/* Play button overlay (like video poster) */}
      <div className="absolute right-4 top-4 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-muted-foreground/40 border-b-[5px] border-b-transparent ml-0.5" />
        </div>
      </div>

      {/* Zoom controls - bottom right */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-editor-toolbar border border-editor-toolbar-border rounded-lg shadow-lg">
        <span className="text-[12px] font-medium text-muted-foreground px-2 tabular-nums min-w-[40px] text-center">
          {zoom}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(200, zoom + 10))}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <ZoomIn size={16} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => onZoomChange(Math.max(20, zoom - 10))}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <ZoomOut size={16} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  zoom: number;
}

const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  zoom,
}) => {
  const scale = zoom / 100;

  if (element.type === "text") {
    return (
      <div
        className="absolute cursor-pointer"
        style={{
          left: element.x * scale,
          top: element.y * scale,
          width: element.width * scale,
          transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Selection box */}
        {isSelected && (
          <div
            className="absolute -inset-1 border-2 rounded-sm pointer-events-none"
            style={{ borderColor: "hsl(var(--editor-active))" }}
          >
            {/* Corner handles */}
            {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
              (pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-2.5 h-2.5 rounded-sm`}
                  style={{ backgroundColor: "hsl(var(--editor-active))" }}
                />
              )
            )}
          </div>
        )}
        <p
          style={{
            fontSize: (element.fontSize || 16) * scale,
            fontFamily: element.fontFamily || "sans-serif",
            fontWeight: element.fontWeight || "400",
            color: element.color || "#FFFFFF",
            lineHeight: 1.1,
            textAlign: "center",
            whiteSpace: "pre-line",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {element.content}
        </p>
      </div>
    );
  }

  return null;
};
