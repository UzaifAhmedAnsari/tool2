import React from "react";
import { ChevronDown, ToggleLeft, ToggleRight } from "lucide-react";
import type { CanvasElement } from "./EditorShell";

interface InspectorProps {
  selectedElement: CanvasElement | null;
}

export const Inspector: React.FC<InspectorProps> = ({ selectedElement }) => {
  return (
    <div className="w-[280px] lg:w-[300px] bg-editor-inspector border-l border-editor-inspector-border flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-editor-inspector-border">
        <h2 className="text-sm font-semibold text-foreground">
          {selectedElement ? (selectedElement.type === "text" ? "Text" : "Element") : "Design"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto editor-scroll">
        {selectedElement ? (
          <ElementInspector element={selectedElement} />
        ) : (
          <DesignInspector />
        )}
      </div>
    </div>
  );
};

const DesignInspector: React.FC = () => (
  <div className="p-4 space-y-5">
    {/* Size */}
    <InspectorSection title="Size">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">Instagram Post</span>
        <span className="text-[12px] text-muted-foreground tabular-nums">1080px × 1080px</span>
      </div>
    </InspectorSection>

    {/* Styles */}
    <InspectorSection title="Styles">
      <div className="flex items-center gap-2">
        {["#1a0a2e", "#8B0000", "#CC0000", "#FF6347"].map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
        <button className="w-8 h-8 rounded-md border border-dashed border-editor-inspector-border flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </InspectorSection>

    {/* Background */}
    <InspectorSection title="Background">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">Solid Color</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[12px] text-muted-foreground">Color</span>
        <div className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer" style={{ backgroundColor: "#1a0a2e" }} />
      </div>
    </InspectorSection>

    {/* AI Subtitles */}
    <InspectorSection title="AI Subtitles">
      <button className="inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:text-primary/80 transition-colors">
        ✦ Generate
      </button>
    </InspectorSection>

    {/* Language */}
    <InspectorSection title="Language">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">English</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </div>
    </InspectorSection>

    {/* Animation */}
    <InspectorSection title="Animation">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-lg border border-dashed border-editor-inspector-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
          <span className="text-[10px] text-muted-foreground">Start</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-lg border border-dashed border-editor-inspector-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground border-b-transparent" />
          </div>
          <span className="text-[10px] text-muted-foreground">End</span>
        </div>
      </div>
    </InspectorSection>

    {/* Title */}
    <InspectorSection title="Title">
      <input
        type="text"
        defaultValue="Brown 21 Days Of Fasting Instagram ..."
        className="w-full h-9 px-3 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
    </InspectorSection>

    {/* Layout */}
    <InspectorSection title="Layout">
      <div className="space-y-3">
        <ToggleRow label="Grid" defaultOn={false} />
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Folds</span>
          <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
            None <ChevronDown size={12} />
          </div>
        </div>
        <ToggleRow label="Bleed" defaultOn={false} />
        <ToggleRow label="Alignment Guides" defaultOn={true} />
      </div>
    </InspectorSection>
  </div>
);

const ElementInspector: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <div className="p-4 space-y-5">
    {element.type === "text" && (
      <>
        <InspectorSection title="Text">
          <textarea
            defaultValue={element.content}
            className="w-full h-20 p-3 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </InspectorSection>

        <InspectorSection title="Font">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Family</span>
              <div className="flex items-center gap-1 text-[12px] text-foreground">
                {element.fontFamily || "Sans Serif"} <ChevronDown size={12} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Size</span>
              <input
                type="number"
                defaultValue={element.fontSize}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Weight</span>
              <div className="flex items-center gap-1 text-[12px] text-foreground">
                {element.fontWeight || "400"} <ChevronDown size={12} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Color</span>
              <div
                className="w-8 h-8 rounded-md border border-editor-inspector-border cursor-pointer"
                style={{ backgroundColor: element.color || "#FFFFFF" }}
              />
            </div>
          </div>
        </InspectorSection>

        <InspectorSection title="Position">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "X", value: element.x },
              { label: "Y", value: element.y },
              { label: "W", value: element.width },
              { label: "H", value: element.height },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-medium w-3">{label}</span>
                <input
                  type="number"
                  defaultValue={Math.round(value)}
                  className="flex-1 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
          </div>
        </InspectorSection>

        <InspectorSection title="Effects">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Opacity</span>
              <input
                type="number"
                defaultValue={100}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">Rotation</span>
              <input
                type="number"
                defaultValue={element.rotation || 0}
                className="w-16 h-8 px-2 text-[13px] bg-accent/50 border border-editor-inspector-border rounded-md text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
        </InspectorSection>
      </>
    )}
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
