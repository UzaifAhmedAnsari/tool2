import React from "react";
import { TopBar } from "./TopBar";
import { Toolbar } from "./Toolbar";
import { CanvasStage } from "./CanvasStage";
import { Inspector } from "./Inspector";
import { TimelineBar } from "./TimelineBar";

export type ToolType = "uploads" | "templates" | "media" | "text" | "ai" | "background" | "layout" | "record" | "draw" | "slideshow" | "qrcode";

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape";
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
  rotation?: number;
  opacity?: number;
}

export const EditorShell: React.FC = () => {
  const [activeTool, setActiveTool] = React.useState<ToolType>("templates");
  const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const [zoom, setZoom] = React.useState(82);

  const [elements] = React.useState<CanvasElement[]>([
    {
      id: "1",
      type: "text",
      x: 200,
      y: 80,
      width: 300,
      height: 60,
      content: "CHURCH NAME",
      fontSize: 28,
      fontFamily: "serif",
      fontWeight: "700",
      color: "#FFFFFF",
    },
    {
      id: "2",
      type: "text",
      x: 280,
      y: 200,
      width: 140,
      height: 120,
      content: "21",
      fontSize: 96,
      fontFamily: "serif",
      fontWeight: "900",
      color: "#FFFFFF",
    },
    {
      id: "3",
      type: "text",
      x: 240,
      y: 310,
      width: 260,
      height: 50,
      content: "DAYS",
      fontSize: 42,
      fontFamily: "serif",
      fontWeight: "700",
      color: "#FFFFFF",
    },
    {
      id: "4",
      type: "text",
      x: 150,
      y: 370,
      width: 400,
      height: 80,
      content: "FASTING &\nPRAYERS",
      fontSize: 52,
      fontFamily: "serif",
      fontWeight: "900",
      color: "#FFD700",
    },
  ]);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(tool);
    setSidebarExpanded(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-editor-toolbar">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar
          activeTool={activeTool}
          onToolClick={handleToolClick}
          sidebarExpanded={sidebarExpanded}
          onCloseSidebar={() => setSidebarExpanded(false)}
        />

        {/* Canvas Stage */}
        <CanvasStage
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          zoom={zoom}
          onZoomChange={setZoom}
        />

        {/* Right Inspector */}
        <Inspector selectedElement={selectedElement} />
      </div>

      {/* Bottom Timeline Bar */}
      <TimelineBar />
    </div>
  );
};
