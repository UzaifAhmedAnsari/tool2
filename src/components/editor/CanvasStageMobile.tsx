import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import Konva from "konva";
import type { CanvasElement } from "./EditorShell";

interface CanvasStageMobileProps {
  elements: CanvasElement[];
  selectedElementIds: string[];
  onSelectElement: (id: string | null, shiftKey?: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canvasSize: { width: number; height: number; label: string };
  canvasBackground: string;
  gridEnabled?: boolean;
  alignmentGuides?: boolean;
  bleedEnabled?: boolean;
}

type InlineEditorState = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  rotation: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  lineHeight: number;
  textAlign: "left" | "center" | "right";
};

export const CanvasStageMobile: React.FC<CanvasStageMobileProps> = ({
  elements,
  selectedElementIds,
  onSelectElement,
  onUpdateElement,
  zoom,
  onZoomChange,
  canvasSize,
  canvasBackground,
  gridEnabled,
  bleedEnabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const konvaContainerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<Konva.Stage | null>(null);
  const contentLayerRef = useRef<Konva.Layer | null>(null);
  const uiLayerRef = useRef<Konva.Layer | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const shapeRefs = useRef<Map<string, Konva.Node>>(new Map());

  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [inlineEditor, setInlineEditor] = useState<InlineEditorState | null>(null);
  const [editingText, setEditingText] = useState("");

  const scale = zoom / 100;

  const editingElement = useMemo(
    () => elements.find((el) => el.id === inlineEditor?.id) || null,
    [elements, inlineEditor?.id]
  );

  const syncStageScale = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.width(canvasSize.width);
    stage.height(canvasSize.height);
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
  }, [canvasSize.width, canvasSize.height, scale]);

  const getInlineEditorState = useCallback(
    (element: CanvasElement, node: Konva.Text): InlineEditorState => {
      const pos = node.absolutePosition();
      const width = Math.max(20, node.width() * Math.abs(node.scaleX()) * scale);
      const height = Math.max(20, node.height() * Math.abs(node.scaleY()) * scale);

      return {
        id: element.id,
        x: pos.x * scale,
        y: pos.y * scale,
        width,
        height,
        fontSize: element.fontSize || 24,
        rotation: node.rotation() || 0,
        fontFamily: element.fontFamily || "sans-serif",
        fontWeight: element.fontWeight || "normal",
        color: element.color || "#000000",
        lineHeight: element.lineHeight || 1.2,
        textAlign: element.textAlign || "left",
      };
    },
    [scale]
  );

  const startInlineEditing = useCallback(
    (element: CanvasElement, node: Konva.Text) => {
      node.hide();
      contentLayerRef.current?.batchDraw();

      setEditingText(element.content || "");
      setInlineEditor(getInlineEditorState(element, node));
      onSelectElement(element.id);

      requestAnimationFrame(() => {
        if (!textInputRef.current) return;
        textInputRef.current.focus();
        const len = textInputRef.current.value.length;
        textInputRef.current.setSelectionRange(len, len);
      });
    },
    [getInlineEditorState, onSelectElement]
  );

  const closeInlineEditing = useCallback(
    (save: boolean) => {
      if (!inlineEditor) return;

      const node = shapeRefs.current.get(inlineEditor.id);
      if (node instanceof Konva.Text) {
        node.show();
      }

      if (save) {
        const textarea = textInputRef.current;
        const nextHeight =
          textarea != null
            ? Math.max(inlineEditor.height, textarea.scrollHeight)
            : inlineEditor.height;

        onUpdateElement(inlineEditor.id, {
          content: editingText,
          height: Math.max(1, Math.round(nextHeight / scale)),
        });
      }

      setInlineEditor(null);
      setEditingText("");
      contentLayerRef.current?.batchDraw();
      uiLayerRef.current?.batchDraw();
    },
    [editingText, inlineEditor, onUpdateElement, scale]
  );

  useEffect(() => {
    if (!konvaContainerRef.current) return;

    const stage = new Konva.Stage({
      container: konvaContainerRef.current,
      width: canvasSize.width,
      height: canvasSize.height,
      draggable: false,
    });

    const contentLayer = new Konva.Layer();
    const uiLayer = new Konva.Layer();

    stage.add(contentLayer);
    stage.add(uiLayer);

    const transformer = new Konva.Transformer({
      rotateEnabled: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 20 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      },
    });

    uiLayer.add(transformer);

    stageRef.current = stage;
    contentLayerRef.current = contentLayer;
    uiLayerRef.current = uiLayer;
    transformerRef.current = transformer;

    stage.on("click tap", (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target === stage) {
        onSelectElement(null);
      }
    });

    const shapeRefsToClean = shapeRefs.current;

    return () => {
      stage.destroy();
      stageRef.current = null;
      contentLayerRef.current = null;
      uiLayerRef.current = null;
      transformerRef.current = null;
      shapeRefsToClean.clear();
    };
  }, [canvasSize.width, canvasSize.height, onSelectElement]);

  useEffect(() => {
    syncStageScale();
  }, [syncStageScale]);

  useEffect(() => {
    if (!inlineEditor) return;
    const node = shapeRefs.current.get(inlineEditor.id);
    if (!(node instanceof Konva.Text)) return;

    const element = elements.find((el) => el.id === inlineEditor.id);
    if (!element) return;

    setInlineEditor(getInlineEditorState(element, node));
  }, [inlineEditor, inlineEditor?.id, elements, zoom, getInlineEditorState]);

  useEffect(() => {
    const contentLayer = contentLayerRef.current;
    const uiLayer = uiLayerRef.current;
    const transformer = transformerRef.current;
    if (!contentLayer || !uiLayer || !stageRef.current) return;

    contentLayer.destroyChildren();

    const oldUiNodes = uiLayer.getChildren((node) => node !== transformer);
    oldUiNodes.forEach((node) => node.destroy());

    shapeRefs.current.clear();

    const backgroundNode = createCanvasBackgroundNode(
      canvasBackground,
      canvasSize.width,
      canvasSize.height
    );
    if (backgroundNode) {
      contentLayer.add(backgroundNode);
      backgroundNode.moveToBottom();
    }

    elements.forEach((element) => {
      const shape = createKonvaShape(
        inlineEditor?.id === element.id
          ? { ...element, content: editingText }
          : element
      );
      if (!shape) return;

      contentLayer.add(shape as unknown as Konva.Shape | Konva.Group);
      shapeRefs.current.set(element.id, shape);

      shape.on("click tap", (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        e.cancelBubble = true;

        if (element.type === "text" && shape instanceof Konva.Text) {
          const alreadyOnlySelected =
            selectedElementIds.length === 1 && selectedElementIds[0] === element.id;

          if (alreadyOnlySelected) {
            startInlineEditing(element, shape);
            return;
          }
        }

        onSelectElement(element.id, Boolean((e.evt as MouseEvent)?.shiftKey));
      });

      if (element.type === "text" && shape instanceof Konva.Text) {
        shape.on("dblclick dbltap", () => {
          startInlineEditing(element, shape);
        });
      }

      shape.on("dragend", () => {
        const pos = shape.position();
        onUpdateElement(element.id, {
          x: Math.round(pos.x),
          y: Math.round(pos.y),
        });

        if (inlineEditor?.id === element.id && shape instanceof Konva.Text) {
          setInlineEditor(getInlineEditorState(element, shape));
        }
      });

      shape.on("transformend", () => {
        const pos = shape.position();
        const attrs: Partial<CanvasElement> = {
          x: Math.round(pos.x),
          y: Math.round(pos.y),
          rotation: Math.round(shape.rotation() || 0),
        };

        if (shape instanceof Konva.Group) {
          attrs.width = Math.round(shape.width());
          attrs.height = Math.round(shape.height());
        } else {
          attrs.width = Math.round((shape.width() || 0) * (shape.scaleX?.() || 1));
          attrs.height = Math.round((shape.height() || 0) * (shape.scaleY?.() || 1));
          shape.scaleX(1);
          shape.scaleY(1);
        }

        onUpdateElement(element.id, attrs);

        if (inlineEditor?.id === element.id && shape instanceof Konva.Text) {
          setInlineEditor(getInlineEditorState(element, shape));
        }
      });

      if (inlineEditor?.id === element.id && shape instanceof Konva.Text) {
        shape.hide();
      }
    });

    if (selectedElementIds.length > 0) {
      const selectedNodes = selectedElementIds
        .map((id) => shapeRefs.current.get(id))
        .filter(Boolean) as Konva.Node[];

      if (transformer && selectedNodes.length > 0) {
        transformer.nodes(selectedNodes);
      } else {
        transformer?.nodes([]);
      }
    } else {
      transformer?.nodes([]);
    }

    contentLayer.batchDraw();
    uiLayer.batchDraw();
  }, [
    elements,
    selectedElementIds,
    inlineEditor?.id,
    editingText,
    onSelectElement,
    onUpdateElement,
    startInlineEditing,
    getInlineEditorState,
    canvasBackground,
    canvasSize.width,
    canvasSize.height,
  ]);

  useEffect(() => {
    if (!inlineEditor || !textInputRef.current || !stageWrapperRef.current) return;

    const textarea = textInputRef.current;
    const stageWrapper = stageWrapperRef.current;
    
    // Get the position of the canvas wrapper in the viewport
    const wrapperRect = stageWrapper.getBoundingClientRect();
    
    // Position textarea at the text element's location in viewport coordinates
    // inlineEditor.x and inlineEditor.y are canvas-relative coordinates
    const viewportLeft = wrapperRect.left + inlineEditor.x;
    const viewportTop = wrapperRect.top + inlineEditor.y;
    
    textarea.style.position = "fixed";
    textarea.style.left = `${viewportLeft}px`;
    textarea.style.top = `${viewportTop}px`;
    textarea.style.width = `${inlineEditor.width}px`;
    textarea.style.maxWidth = `${inlineEditor.width}px`;
    textarea.style.minHeight = `${inlineEditor.height}px`;
    textarea.style.padding = "4px";
    textarea.style.boxSizing = "border-box";
    textarea.style.overflowY = "hidden";
    textarea.style.overflowX = "hidden";
    textarea.style.whiteSpace = "pre-wrap";
    textarea.style.wordWrap = "break-word";
    textarea.style.resize = "none";
    textarea.focus();
  }, [inlineEditor]);

  const handleEditingChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingText(e.target.value);

    const node = inlineEditor ? shapeRefs.current.get(inlineEditor.id) : null;
    if (node instanceof Konva.Text) {
      node.text(e.target.value);
      contentLayerRef.current?.batchDraw();
    }
  }, [inlineEditor]);

  const handleEditingBlur = useCallback(() => {
    closeInlineEditing(true);
  }, [closeInlineEditing]);

  const handleEditingKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      e.stopPropagation();

      if (e.key === "Escape") {
        e.preventDefault();
        closeInlineEditing(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        closeInlineEditing(true);
      }
    },
    [closeInlineEditing]
  );

  const fitMobileToScreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width <= 0 || height <= 0) return;

    const paddingX = 16;
    const paddingY = 16;

    const usableWidth = Math.max(1, width - paddingX);
    const usableHeight = Math.max(1, height - paddingY);

    const scaleX = usableWidth / canvasSize.width;
    const scaleY = usableHeight / canvasSize.height;
    const fitZoom = Math.min(scaleX, scaleY) * 100;

    const nextZoom = Math.max(8, Math.min(Math.floor(fitZoom), 100));
    onZoomChange(nextZoom);
  }, [canvasSize.width, canvasSize.height, onZoomChange]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      fitMobileToScreen();
    });

    return () => cancelAnimationFrame(raf);
  }, [fitMobileToScreen]);

  useEffect(() => {
    const rerun = () => {
      requestAnimationFrame(() => fitMobileToScreen());
    };

    const t1 = window.setTimeout(rerun, 0);
    const t2 = window.setTimeout(rerun, 120);
    const t3 = window.setTimeout(rerun, 300);

    window.addEventListener("orientationchange", rerun);
    window.addEventListener("resize", rerun);

    const vv = window.visualViewport;
    vv?.addEventListener("resize", rerun);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("orientationchange", rerun);
      window.removeEventListener("resize", rerun);
      vv?.removeEventListener("resize", rerun);
    };
  }, [fitMobileToScreen]);

  const showTransparentPreview = canvasBackground === "transparent";
  const showCssBackgroundFallback =
    !showTransparentPreview &&
    !isSupportedKonvaBackground(canvasBackground) &&
    Boolean(canvasBackground);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 min-w-0 overflow-hidden bg-gray-50"
    >
      <textarea
        ref={textInputRef}
        value={editingText}
        onChange={handleEditingChange}
        onBlur={handleEditingBlur}
        onKeyDown={handleEditingKeyDown}
        spellCheck={false}
        tabIndex={inlineEditor ? 0 : -1}
        style={{
          position: "fixed",
          left: inlineEditor ? `${inlineEditor.x}px` : "-9999px",
          top: inlineEditor ? `${inlineEditor.y}px` : "-9999px",
          width: inlineEditor ? `${inlineEditor.width}px` : "1px",
          font: inlineEditor ? `${inlineEditor.fontSize}px ${inlineEditor.fontFamily}` : "inherit",
          color: inlineEditor ? inlineEditor.color : "inherit",
          textAlign: (inlineEditor?.textAlign || "left") as any,
          padding: "4px",
          border: inlineEditor ? "2px solid #4488FF" : "none",
          borderRadius: "2px",
          zIndex: 1000,
          resize: "none",
          boxSizing: "border-box",
          opacity: inlineEditor ? 1 : 0,
          pointerEvents: inlineEditor ? "auto" : "none",
          overflowY: "hidden",
          overflowX: "hidden",
          whiteSpace: "pre-wrap" as any,
          wordWrap: "break-word" as any,
          lineHeight: inlineEditor ? inlineEditor.lineHeight : "1.2",
          fontWeight: inlineEditor ? inlineEditor.fontWeight : "normal",
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center overflow-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          padding: "8px",
        }}
      >
        <div
          ref={stageWrapperRef}
          className="relative shrink-0 rounded-lg"
          style={{
            width: canvasSize.width * scale,
            height: canvasSize.height * scale,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            overflow: "visible",
            background: showCssBackgroundFallback ? canvasBackground : undefined,
          }}
        >
          {showTransparentPreview && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #d9d9d9 25%, transparent 25%),
                  linear-gradient(-45deg, #d9d9d9 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #d9d9d9 75%),
                  linear-gradient(-45deg, transparent 75%, #d9d9d9 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />
          )}

          {gridEnabled && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: `${50 * scale}px ${50 * scale}px`,
              }}
            />
          )}

          {bleedEnabled && (
            <div
              className="absolute pointer-events-none border border-dashed"
              style={{
                top: 18 * scale,
                left: 18 * scale,
                right: 18 * scale,
                bottom: 18 * scale,
                borderColor: "rgba(255,0,0,0.28)",
              }}
            />
          )}

          <div
            ref={konvaContainerRef}
            style={{
              display: "block",
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

function isSupportedKonvaBackground(value: string): boolean {
  if (value === "transparent") return true;
  if (value.startsWith("#") || value.startsWith("rgb")) return true;
  if (value.startsWith("linear-gradient") || value.startsWith("radial-gradient")) return true;
  return false;
}

function createCanvasBackgroundNode(
  background: string,
  width: number,
  height: number
): Konva.Rect | null {
  if (!isSupportedKonvaBackground(background)) {
    return null;
  }

  return new Konva.Rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: background,
  });
}

function mapFontWeightToKonvaFontStyle(fontWeight?: string): string {
  const weight = parseInt(fontWeight || "400");
  if (weight >= 700) return "bold";
  if (weight >= 600) return "600";
  if (weight <= 300) return "300";
  return "normal";
}

function createKonvaShape(element: CanvasElement): Konva.Node | null {
  try {
    const baseConfig = {
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation || 0,
      opacity: element.opacity != null ? element.opacity / 100 : 1,
      draggable: true,
    };

    if (element.type === "text") {
      return new Konva.Text({
        ...baseConfig,
        width: element.width,
        height: element.height,
        text: element.content || "",
        fontSize: element.fontSize || 24,
        fontFamily: element.fontFamily || "sans-serif",
        fontStyle: mapFontWeightToKonvaFontStyle(element.fontWeight),
        fill: element.color || "#000000",
        align: element.textAlign || "center",
        verticalAlign: "top",
        lineHeight: element.lineHeight || 1.2,
        letterSpacing: element.letterSpacing || 0,
        wrap: "word",
      });
    }

    if (element.type === "shape") {
      if (element.shapeType === "circle") {
        return new Konva.Circle({
          ...baseConfig,
          x: element.x + element.width / 2,
          y: element.y + element.height / 2,
          radius: Math.min(element.width, element.height) / 2,
          fill: element.backgroundColor || "#4488FF",
          stroke: element.borderColor || "transparent",
          strokeWidth: element.borderWidth || 0,
        });
      }

      if (element.shapeType === "triangle") {
        return new Konva.Line({
          ...baseConfig,
          points: [element.width / 2, 0, element.width, element.height, 0, element.height],
          closed: true,
          fill: element.backgroundColor || "#4488FF",
          stroke: element.borderColor || "transparent",
          strokeWidth: element.borderWidth || 0,
        });
      }

      if (element.shapeType === "line") {
        return new Konva.Line({
          ...baseConfig,
          points: [0, element.height / 2, element.width, element.height / 2],
          stroke: element.backgroundColor || "#000000",
          strokeWidth: element.borderWidth || 2,
        });
      }

      return new Konva.Rect({
        ...baseConfig,
        width: element.width,
        height: element.height,
        fill: element.backgroundColor || "#4488FF",
        stroke: element.borderColor || "transparent",
        strokeWidth: element.borderWidth || 0,
        cornerRadius: element.borderRadius || 0,
      });
    }

    if (element.type === "image" && element.src) {
      const img = new window.Image();
      img.src = element.src;

      return new Konva.Image({
        ...baseConfig,
        width: element.width,
        height: element.height,
        image: img,
      });
    }

    if (element.type === "table") {
      const group = new Konva.Group({
        ...baseConfig,
        width: element.width,
        height: element.height,
      });

      const rows = element.rows || 3;
      const cols = element.cols || 3;
      const cellWidth = element.width / cols;
      const cellHeight = element.height / rows;

      for (let i = 0; i <= rows; i++) {
        group.add(
          new Konva.Line({
            points: [0, i * cellHeight, element.width, i * cellHeight],
            stroke: element.borderColor || "#000",
            strokeWidth: element.borderWidth || 1,
          })
        );
      }

      for (let i = 0; i <= cols; i++) {
        group.add(
          new Konva.Line({
            points: [i * cellWidth, 0, i * cellWidth, element.height],
            stroke: element.borderColor || "#000",
            strokeWidth: element.borderWidth || 1,
          })
        );
      }

      if (element.tableData) {
        element.tableData.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            group.add(
              new Konva.Text({
                x: colIndex * cellWidth,
                y: rowIndex * cellHeight,
                width: cellWidth,
                height: cellHeight,
                text: cell || "",
                fontSize: element.fontSize || 14,
                fontFamily: element.fontFamily || "sans-serif",
                fill: element.color || "#000000",
                align: "center",
                verticalAlign: "middle",
              })
            );
          });
        });
      }

      return group;
    }

    if (element.type === "video") {
      const group = new Konva.Group({
        ...baseConfig,
        width: element.width,
        height: element.height,
      });

      group.add(
        new Konva.Rect({
          x: 0,
          y: 0,
          width: element.width,
          height: element.height,
          fill: "#1a1a1a",
        })
      );

      group.add(
        new Konva.Text({
          x: 0,
          y: element.height / 2 - 20,
          width: element.width,
          text: "VIDEO",
          fontSize: 24,
          fontFamily: "Arial",
          fill: "#ffffff",
          align: "center",
        })
      );

      return group;
    }

    return null;
  } catch (error) {
    console.error("Error creating Konva shape:", error);
    return null;
  }
}
