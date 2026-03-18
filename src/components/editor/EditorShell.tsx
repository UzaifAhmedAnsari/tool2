import React, { useCallback, useRef } from "react";
import { TopBar } from "./TopBar";
import { Toolbar } from "./Toolbar";
import { CanvasStage } from "./CanvasStage";
import { Inspector } from "./Inspector";
import { TimelineBar } from "./TimelineBar";
import { useIsMobile } from "@/hooks/use-mobile";

export type ToolType = "uploads" | "templates" | "media" | "text" | "ai" | "background" | "layout" | "record" | "draw" | "slideshow" | "qrcode";
export type EditorMode = "image" | "video";

export interface CanvasSizePreset {
  label: string;
  width: number;
  height: number;
  description?: string;
}

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "video";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  rotation?: number;
  opacity?: number;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  shapeType?: "rectangle" | "circle" | "triangle" | "line";
  // Video-specific
  duration?: number;
  startTime?: number;
}

interface HistoryEntry {
  elements: CanvasElement[];
  canvasBackground: string;
}

let nextId = 1;
const generateId = () => String(nextId++);

interface EditorShellProps {
  mode: EditorMode;
  initialSize: CanvasSizePreset;
  onBack: () => void;
}

export const EditorShell: React.FC<EditorShellProps> = ({ mode, initialSize, onBack }) => {
  const isMobile = useIsMobile();
  const [activeTool, setActiveTool] = React.useState<ToolType | null>(null);
  const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const [zoom, setZoom] = React.useState(82);
  const [mobilePanel, setMobilePanel] = React.useState<"toolbar" | "inspector" | null>(null);
  const [canvasSize, setCanvasSize] = React.useState<CanvasSizePreset>(initialSize);
  const [canvasBackground, setCanvasBackground] = React.useState("#FFFFFF");
  const [designTitle, setDesignTitle] = React.useState("A New Design");
  const [gridEnabled, setGridEnabled] = React.useState(false);
  const [alignmentGuides, setAlignmentGuides] = React.useState(true);
  const [bleedEnabled, setBleedEnabled] = React.useState(false);
  const [folds, setFolds] = React.useState<string>("none");

  // Video-specific state
  const [videoDuration, setVideoDuration] = React.useState(10); // seconds
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);

  const [elements, setElements] = React.useState<CanvasElement[]>([]);

  // History for undo/redo
  const [history, setHistory] = React.useState<HistoryEntry[]>([{ elements: [], canvasBackground: "#FFFFFF" }]);
  const [historyIndex, setHistoryIndex] = React.useState(0);

  const pushHistory = useCallback((newElements: CanvasElement[], newBg?: string) => {
    const bg = newBg ?? canvasBackground;
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { elements: newElements, canvasBackground: bg }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex, canvasBackground]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const entry = history[newIndex];
      setElements(entry.elements);
      setCanvasBackground(entry.canvasBackground);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const entry = history[newIndex];
      setElements(entry.elements);
      setCanvasBackground(entry.canvasBackground);
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const handleToolClick = (tool: ToolType) => {
    if (isMobile) {
      setActiveTool(tool);
      setMobilePanel("toolbar");
    } else {
      if (activeTool === tool && sidebarExpanded) {
        setSidebarExpanded(false);
        setActiveTool(null);
      } else {
        setActiveTool(tool);
        setSidebarExpanded(true);
      }
    }
  };

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => {
      const next = prev.map(el => el.id === id ? { ...el, ...updates } : el);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const addElement = useCallback((element: Omit<CanvasElement, "id">) => {
    const newEl = { ...element, id: generateId() };
    setElements(prev => {
      const next = [...prev, newEl];
      pushHistory(next);
      return next;
    });
    setSelectedElementId(newEl.id);
    if (isMobile) setMobilePanel(null);
  }, [pushHistory, isMobile]);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      const next = prev.filter(el => el.id !== id);
      pushHistory(next);
      return next;
    });
    if (selectedElementId === id) setSelectedElementId(null);
  }, [pushHistory, selectedElementId]);

  const duplicateElement = useCallback((id: string) => {
    const el = elements.find(e => e.id === id);
    if (el) {
      const newEl = { ...el, id: generateId(), x: el.x + 20, y: el.y + 20 };
      setElements(prev => {
        const next = [...prev, newEl];
        pushHistory(next);
        return next;
      });
      setSelectedElementId(newEl.id);
    }
  }, [elements, pushHistory]);

  const moveElementLayer = useCallback((id: string, direction: "up" | "down" | "top" | "bottom") => {
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      switch (direction) {
        case "up": next.splice(Math.min(idx + 1, next.length), 0, item); break;
        case "down": next.splice(Math.max(idx - 1, 0), 0, item); break;
        case "top": next.push(item); break;
        case "bottom": next.unshift(item); break;
      }
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const handleBackgroundChange = useCallback((bg: string) => {
    setCanvasBackground(bg);
    pushHistory(elements, bg);
  }, [elements, pushHistory]);

  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
    if (id && isMobile) {
      setMobilePanel("inspector");
    }
  }, [isMobile]);

  const handleCanvasSizeChange = useCallback((preset: CanvasSizePreset) => {
    setCanvasSize(preset);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const contentEditable = (e.target as HTMLElement)?.getAttribute?.('contenteditable');
      if (contentEditable === 'true') return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          deleteElement(selectedElementId);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (selectedElementId) duplicateElement(selectedElementId);
      }
      // Space to play/pause for video mode
      if (mode === "video" && e.key === " " && !selectedElementId) {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectedElementId, deleteElement, duplicateElement, mode]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-editor-toolbar">
        <TopBar
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          isMobile={isMobile}
          mode={mode}
          onBack={onBack}
        />

        <div className="flex-1 relative overflow-hidden">
          <CanvasStage
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            onUpdateElement={updateElement}
            zoom={zoom}
            onZoomChange={setZoom}
            canvasSize={canvasSize}
            canvasBackground={canvasBackground}
            gridEnabled={gridEnabled}
            alignmentGuides={alignmentGuides}
            bleedEnabled={bleedEnabled}
          />
        </div>

        {/* Mobile bottom panel overlay */}
        {mobilePanel === "toolbar" && activeTool && (
          <div className="absolute bottom-[60px] left-0 right-0 z-30 bg-editor-toolbar border-t border-editor-toolbar-border max-h-[50vh] overflow-y-auto editor-scroll">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground capitalize">
                  {activeTool === "qrcode" ? "QR Code" : activeTool === "ai" ? "AI" : activeTool}
                </h3>
                <button onClick={() => setMobilePanel(null)} className="text-sm text-muted-foreground">
                  Close
                </button>
              </div>
              <MobileToolContent
                activeTool={activeTool}
                onAddElement={addElement}
                onBackgroundChange={handleBackgroundChange}
                canvasBackground={canvasBackground}
                mode={mode}
                onCanvasSizeChange={handleCanvasSizeChange}
              />
            </div>
          </div>
        )}

        {mobilePanel === "inspector" && selectedElement && (
          <div className="absolute bottom-[60px] left-0 right-0 z-30 bg-editor-toolbar border-t border-editor-toolbar-border max-h-[50vh] overflow-y-auto editor-scroll">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedElement.type === "text" ? "Text" : selectedElement.type === "shape" ? "Shape" : "Image"}
                </h3>
                <button onClick={() => setMobilePanel(null)} className="text-sm text-muted-foreground">
                  Close
                </button>
              </div>
              <Inspector
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
                onMoveLayer={moveElementLayer}
                canvasSize={canvasSize}
                canvasBackground={canvasBackground}
                onBackgroundChange={handleBackgroundChange}
                designTitle={designTitle}
                onDesignTitleChange={setDesignTitle}
                gridEnabled={gridEnabled}
                onGridToggle={setGridEnabled}
                alignmentGuides={alignmentGuides}
                onAlignmentGuidesToggle={setAlignmentGuides}
                bleedEnabled={bleedEnabled}
                onBleedToggle={setBleedEnabled}
                folds={folds}
                onFoldsChange={setFolds}
                mode={mode}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Mobile bottom toolbar */}
        <Toolbar
          activeTool={activeTool}
          onToolClick={handleToolClick}
          sidebarExpanded={false}
          onCloseSidebar={() => {}}
          isMobile
          onAddElement={addElement}
          onBackgroundChange={handleBackgroundChange}
          canvasBackground={canvasBackground}
          mode={mode}
          onCanvasSizeChange={handleCanvasSizeChange}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-editor-toolbar">
      <TopBar
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isMobile={false}
        mode={mode}
        onBack={onBack}
      />

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          activeTool={activeTool}
          onToolClick={handleToolClick}
          sidebarExpanded={sidebarExpanded}
          onCloseSidebar={() => setSidebarExpanded(false)}
          onAddElement={addElement}
          onBackgroundChange={handleBackgroundChange}
          canvasBackground={canvasBackground}
          mode={mode}
          onCanvasSizeChange={handleCanvasSizeChange}
        />

        <CanvasStage
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          onUpdateElement={updateElement}
          zoom={zoom}
          onZoomChange={setZoom}
          canvasSize={canvasSize}
          canvasBackground={canvasBackground}
          gridEnabled={gridEnabled}
          alignmentGuides={alignmentGuides}
          bleedEnabled={bleedEnabled}
        />

        <Inspector
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onDuplicateElement={duplicateElement}
          onMoveLayer={moveElementLayer}
          canvasSize={canvasSize}
          canvasBackground={canvasBackground}
          onBackgroundChange={handleBackgroundChange}
          designTitle={designTitle}
          onDesignTitleChange={setDesignTitle}
          gridEnabled={gridEnabled}
          onGridToggle={setGridEnabled}
          alignmentGuides={alignmentGuides}
          onAlignmentGuidesToggle={setAlignmentGuides}
          bleedEnabled={bleedEnabled}
          onBleedToggle={setBleedEnabled}
          folds={folds}
          onFoldsChange={setFolds}
          mode={mode}
        />
      </div>

      {mode === "video" && (
        <TimelineBar
          duration={videoDuration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTimeChange={setCurrentTime}
          onPlayPause={() => setIsPlaying(p => !p)}
          onDurationChange={setVideoDuration}
          elements={elements}
        />
      )}
    </div>
  );
};

// Mobile tool content
import { ToolbarSidePanel } from "./ToolbarSidePanel";

interface MobileToolContentProps {
  activeTool: ToolType;
  onAddElement: (el: Omit<CanvasElement, "id">) => void;
  onBackgroundChange: (bg: string) => void;
  canvasBackground: string;
  mode: EditorMode;
  onCanvasSizeChange: (preset: CanvasSizePreset) => void;
}

const MobileToolContent: React.FC<MobileToolContentProps> = ({ activeTool, onAddElement, onBackgroundChange, canvasBackground, mode, onCanvasSizeChange }) => {
  return (
    <ToolbarSidePanel
      activeTool={activeTool}
      onAddElement={onAddElement}
      onBackgroundChange={onBackgroundChange}
      canvasBackground={canvasBackground}
      mode={mode}
      onCanvasSizeChange={onCanvasSizeChange}
    />
  );
};
