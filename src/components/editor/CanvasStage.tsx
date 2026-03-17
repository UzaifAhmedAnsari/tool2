import React, { useRef, useState, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import type { CanvasElement } from "./EditorShell";

interface CanvasStageProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canvasSize: { width: number; height: number; label: string };
  canvasBackground: string;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  zoom,
  onZoomChange,
  canvasSize,
  canvasBackground,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 80;
    const scaleX = (clientWidth - padding) / canvasSize.width;
    const scaleY = (clientHeight - padding) / canvasSize.height;
    const fitZoom = Math.min(scaleX, scaleY) * 100;
    onZoomChange(Math.round(Math.min(fitZoom, 150)));
  }, [canvasSize, onZoomChange]);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "hsl(var(--editor-canvas-bg))" }}
      onClick={() => onSelectElement(null)}
    >
      {/* Canvas container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4 md:p-8">
        <div
          className="relative shrink-0 rounded-sm overflow-hidden"
          style={{
            width: canvasSize.width * (zoom / 100),
            height: canvasSize.height * (zoom / 100),
            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.4)",
            background: canvasBackground,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectElement(null);
          }}
        >
          {/* Transparent background pattern (checkerboard) */}
          {canvasBackground === "transparent" && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />
          )}

          {/* Canvas elements */}
          {elements.map((el) => (
            <CanvasElementRenderer
              key={el.id}
              element={el}
              isSelected={selectedElementId === el.id}
              onSelect={() => onSelectElement(el.id)}
              onUpdate={(updates) => onUpdateElement(el.id, updates)}
              zoom={zoom}
            />
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-1 bg-editor-toolbar border border-editor-toolbar-border rounded-lg shadow-lg">
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
          onClick={() => onZoomChange(Math.max(10, zoom - 10))}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <ZoomOut size={16} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
        <button
          onClick={fitToScreen}
          className="p-2 hover:bg-accent rounded-md transition-colors"
        >
          <Maximize size={16} strokeWidth={1.5} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  zoom: number;
}

const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  zoom,
}) => {
  const scale = zoom / 100;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, handle: "" });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: element.x, elY: element.y };

    const handleMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - dragStart.current.x) / scale;
      const dy = (ev.clientY - dragStart.current.y) / scale;
      onUpdate({ x: Math.round(dragStart.current.elX + dx), y: Math.round(dragStart.current.elY + dy) });
    };
    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: element.width, h: element.height, handle };

    const handleMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - resizeStart.current.x) / scale;
      const dy = (ev.clientY - resizeStart.current.y) / scale;
      let newW = resizeStart.current.w;
      let newH = resizeStart.current.h;

      if (handle.includes("right")) newW = Math.max(20, resizeStart.current.w + dx);
      if (handle.includes("left")) newW = Math.max(20, resizeStart.current.w - dx);
      if (handle.includes("bottom")) newH = Math.max(20, resizeStart.current.h + dy);
      if (handle.includes("top")) newH = Math.max(20, resizeStart.current.h - dy);

      const updates: Partial<CanvasElement> = { width: Math.round(newW), height: Math.round(newH) };
      if (handle.includes("left")) updates.x = Math.round(element.x + (element.width - newW));
      if (handle.includes("top")) updates.y = Math.round(element.y + (element.height - newH));
      onUpdate(updates);
    };
    const handleUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onUpdate({ content: e.currentTarget.textContent || "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const commonStyle: React.CSSProperties = {
    left: element.x * scale,
    top: element.y * scale,
    width: element.width * scale,
    height: element.height * scale,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    opacity: element.opacity != null ? element.opacity / 100 : 1,
  };

  const renderContent = () => {
    if (element.type === "text") {
      return (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            fontSize: (element.fontSize || 24) * scale,
            fontFamily: element.fontFamily || "sans-serif",
            fontWeight: element.fontWeight || "400",
            color: element.color || "#000000",
            lineHeight: element.lineHeight || 1.2,
            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
            textAlign: element.textAlign || "center",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            width: "100%",
            height: "100%",
            outline: isEditing ? "2px solid hsl(var(--editor-active))" : "none",
            cursor: isEditing ? "text" : "move",
            display: "flex",
            alignItems: "center",
            justifyContent: element.textAlign === "left" ? "flex-start" : element.textAlign === "right" ? "flex-end" : "center",
          }}
        >
          {element.content}
        </div>
      );
    }

    if (element.type === "shape") {
      const shapeStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        backgroundColor: element.backgroundColor || "#4488FF",
        borderRadius: element.shapeType === "circle" ? "50%" : element.borderRadius ? `${element.borderRadius}px` : undefined,
        border: element.borderWidth ? `${element.borderWidth * scale}px solid ${element.borderColor || "#000"}` : undefined,
      };

      if (element.shapeType === "triangle") {
        return (
          <div style={{ width: "100%", height: "100%" }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <polygon
                points="50,0 100,100 0,100"
                fill={element.backgroundColor || "#4488FF"}
                stroke={element.borderColor}
                strokeWidth={element.borderWidth || 0}
              />
            </svg>
          </div>
        );
      }

      if (element.shapeType === "line") {
        return (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", height: `${Math.max(2, element.borderWidth || 2) * scale}px`, backgroundColor: element.backgroundColor || "#000" }} />
          </div>
        );
      }

      return <div style={shapeStyle} />;
    }

    if (element.type === "image") {
      return (
        <img
          src={element.src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
          }}
          draggable={false}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="absolute"
      style={{
        ...commonStyle,
        cursor: isEditing ? "text" : isDragging ? "grabbing" : "grab",
        zIndex: isSelected ? 100 : undefined,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderContent()}

      {/* Selection outline & handles */}
      {isSelected && !isEditing && (
        <div
          className="absolute -inset-[2px] border-2 pointer-events-none"
          style={{ borderColor: "hsl(var(--editor-active))" }}
        >
          {/* Corner handles */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((handle) => {
            const pos: React.CSSProperties = {};
            if (handle.includes("top")) pos.top = -5;
            if (handle.includes("bottom")) pos.bottom = -5;
            if (handle.includes("left")) pos.left = -5;
            if (handle.includes("right")) pos.right = -5;
            return (
              <div
                key={handle}
                className="absolute w-[10px] h-[10px] rounded-sm pointer-events-auto"
                style={{
                  ...pos,
                  backgroundColor: "hsl(var(--editor-active))",
                  cursor: handle === "top-left" || handle === "bottom-right" ? "nwse-resize" : "nesw-resize",
                }}
                onMouseDown={(e) => handleResizeMouseDown(e, handle)}
              />
            );
          })}
          {/* Edge handles */}
          {["top", "bottom", "left", "right"].map((handle) => {
            const pos: React.CSSProperties = { position: "absolute" };
            if (handle === "top") { pos.top = -3; pos.left = "30%"; pos.right = "30%"; pos.height = 6; pos.cursor = "ns-resize"; }
            if (handle === "bottom") { pos.bottom = -3; pos.left = "30%"; pos.right = "30%"; pos.height = 6; pos.cursor = "ns-resize"; }
            if (handle === "left") { pos.left = -3; pos.top = "30%"; pos.bottom = "30%"; pos.width = 6; pos.cursor = "ew-resize"; }
            if (handle === "right") { pos.right = -3; pos.top = "30%"; pos.bottom = "30%"; pos.width = 6; pos.cursor = "ew-resize"; }
            return (
              <div
                key={handle}
                className="pointer-events-auto rounded-sm"
                style={pos}
                onMouseDown={(e) => handleResizeMouseDown(e, handle)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
