import React from "react";
import { ChevronDown, Trash2, Copy, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import type { CanvasElement } from "./EditorShell";

interface InspectorProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  canvasSize: { width: number; height: number; label: string };
  canvasBackground: string;
  onBackgroundChange: (bg: string) => void;
  isMobile?: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveLayer,
  canvasSize,
  canvasBackground,
  onBackgroundChange,
  isMobile,
}) => {
  if (isMobile) {
    // Mobile: render content directly (no wrapper)
    return selectedElement ? (
      <ElementInspector
        element={selectedElement}
        onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
        onDelete={() => onDeleteElement(selectedElement.id)}
        onDuplicate={() => onDuplicateElement(selectedElement.id)}
        onMoveLayer={(dir) => onMoveLayer(selectedElement.id, dir)}
      />
    ) : null;
  }

  return (
    <div className="w-[280px] lg:w-[300px] bg-editor-inspector border-l border-editor-inspector-border flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-editor-inspector-border">
        <h2 className="text-sm font-semibold text-foreground">
          {selectedElement
            ? selectedElement.type === "text" ? "Text" : selectedElement.type === "shape" ? "Shape" : "Image"
            : "Design"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto editor-scroll">
        {selectedElement ? (
          <ElementInspector
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
            onDelete={() => onDeleteElement(selectedElement.id)}
            onDuplicate={() => onDuplicateElement(selectedElement.id)}
            onMoveLayer={(dir) => onMoveLayer(selectedElement.id, dir)}
          />
        ) : (
          <DesignInspector canvasSize={canvasSize} canvasBackground={canvasBackground} onBackgroundChange={onBackgroundChange} />
        )}
      </div>
    </div>
  );
};

const DesignInspector: React.FC<{
  canvasSize: { width: number; height: number; label: string };
  canvasBackground: string;
  onBackgroundChange: (bg: string) => void;
}> = ({ canvasSize, canvasBackground, onBackgroundChange }) => (
  <div className="p-4 space-y-5">
    <InspectorSection title="Size">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">{canvasSize.label}</span>
        <span className="text-[12px] text-muted-foreground tabular-nums">{canvasSize.width}px × {canvasSize.height}px</span>
      </div>
    </InspectorSection>

    <InspectorSection title="Background">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">Color</span>
        <input
          type="color"
          value={canvasBackground.startsWith("#") ? canvasBackground : "#ffffff"}
          onChange={(e) => onBackgroundChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer"
        />
      </div>
    </InspectorSection>

    <InspectorSection title="Layout">
      <div className="space-y-3">
        <ToggleRow label="Grid" defaultOn={false} />
        <ToggleRow label="Alignment Guides" defaultOn={true} />
      </div>
    </InspectorSection>
  </div>
);

interface ElementInspectorProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLayer: (dir: "up" | "down" | "top" | "bottom") => void;
}

const ElementInspector: React.FC<ElementInspectorProps> = ({ element, onUpdate, onDelete, onDuplicate, onMoveLayer }) => (
  <div className="p-4 space-y-5">
    {/* Actions bar */}
    <div className="flex items-center gap-1">
      <button onClick={onDuplicate} className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Duplicate">
        <Copy size={15} strokeWidth={1.5} />
      </button>
      <button onClick={() => onMoveLayer("up")} className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Move up">
        <ArrowUp size={15} strokeWidth={1.5} />
      </button>
      <button onClick={() => onMoveLayer("down")} className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Move down">
        <ArrowDown size={15} strokeWidth={1.5} />
      </button>
      <button onClick={() => onMoveLayer("top")} className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Bring to front">
        <ChevronsUp size={15} strokeWidth={1.5} />
      </button>
      <button onClick={() => onMoveLayer("bottom")} className="p-2 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Send to back">
        <ChevronsDown size={15} strokeWidth={1.5} />
      </button>
      <div className="flex-1" />
      <button onClick={onDelete} className="p-2 rounded hover:bg-destructive/10 transition-colors text-destructive" title="Delete">
        <Trash2 size={15} strokeWidth={1.5} />
      </button>
    </div>

    {element.type === "text" && (
      <>
        <InspectorSection title="Text">
          <textarea
            value={element.content || ""}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full h-20 p-3 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </InspectorSection>

        <InspectorSection title="Font">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Family</span>
              <select
                value={element.fontFamily || "Inter, sans-serif"}
                onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                className="h-8 px-2 text-[12px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Impact, sans-serif">Impact</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Size</span>
              <input
                type="number"
                value={element.fontSize || 24}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Weight</span>
              <select
                value={element.fontWeight || "400"}
                onChange={(e) => onUpdate({ fontWeight: e.target.value })}
                className="h-8 px-2 text-[12px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Color</span>
              <input
                type="color"
                value={element.color || "#000000"}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-muted-foreground mr-2">Align</span>
              {(["left", "center", "right"] as const).map((align) => {
                const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() => onUpdate({ textAlign: align })}
                    className={`p-1.5 rounded transition-colors ${element.textAlign === align ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent"}`}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Line Height</span>
              <input
                type="number"
                step="0.1"
                value={element.lineHeight || 1.2}
                onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
        </InspectorSection>
      </>
    )}

    {element.type === "shape" && (
      <InspectorSection title="Shape">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Fill Color</span>
            <input
              type="color"
              value={element.backgroundColor || "#4488FF"}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Border Color</span>
            <input
              type="color"
              value={element.borderColor || "#000000"}
              onChange={(e) => onUpdate({ borderColor: e.target.value })}
              className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Border Width</span>
            <input
              type="number"
              value={element.borderWidth || 0}
              onChange={(e) => onUpdate({ borderWidth: Number(e.target.value) })}
              className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          {element.shapeType !== "circle" && element.shapeType !== "triangle" && element.shapeType !== "line" && (
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Border Radius</span>
              <input
                type="number"
                value={element.borderRadius || 0}
                onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          )}
        </div>
      </InspectorSection>
    )}

    {/* Position - all types */}
    <InspectorSection title="Position">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "X", value: element.x, key: "x" },
          { label: "Y", value: element.y, key: "y" },
          { label: "W", value: element.width, key: "width" },
          { label: "H", value: element.height, key: "height" },
        ].map(({ label, value, key }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium w-3">{label}</span>
            <input
              type="number"
              value={Math.round(value)}
              onChange={(e) => onUpdate({ [key]: Number(e.target.value) })}
              className="flex-1 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        ))}
      </div>
    </InspectorSection>

    {/* Effects - all types */}
    <InspectorSection title="Effects">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Opacity</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={element.opacity ?? 100}
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
              className="w-20 h-1.5 accent-primary"
            />
            <input
              type="number"
              value={element.opacity ?? 100}
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
              className="w-14 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Rotation</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="360"
              value={element.rotation || 0}
              onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
              className="w-20 h-1.5 accent-primary"
            />
            <input
              type="number"
              value={element.rotation || 0}
              onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
              className="w-14 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </InspectorSection>
  </div>
);

const InspectorSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
      {title}
    </p>
    {children}
  </div>
);

const ToggleRow: React.FC<{ label: string; defaultOn: boolean }> = ({ label, defaultOn }) => {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${on ? "bg-primary" : "bg-muted"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
};
