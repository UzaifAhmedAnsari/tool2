import React, { useState } from "react";
import { EditorShell } from "@/components/editor/EditorShell";
import type { EditorMode, CanvasSizePreset } from "@/components/editor/EditorShell";
import { Image, Film, ArrowRight } from "lucide-react";

const IMAGE_PRESETS: CanvasSizePreset[] = [
  { label: "Flyer (US Letter)", width: 2550, height: 3300, description: "8.5in × 11in" },
  { label: "Instagram Post", width: 1080, height: 1080, description: "1080 × 1080" },
  { label: "Facebook Post", width: 1200, height: 630, description: "1200 × 630" },
  { label: "Twitter/X Post", width: 1200, height: 675, description: "1200 × 675" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, description: "1280 × 720" },
  { label: "A4 Portrait", width: 2480, height: 3508, description: "210mm × 297mm" },
  { label: "Poster (24×36)", width: 2400, height: 3600, description: "24in × 36in" },
  { label: "Business Card", width: 1050, height: 600, description: "3.5in × 2in" },
];

const VIDEO_PRESETS: CanvasSizePreset[] = [
  { label: "Instagram Reel", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "YouTube Video", width: 1920, height: 1080, description: "16:9 landscape" },
  { label: "TikTok Video", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Facebook Story", width: 1080, height: 1920, description: "9:16 vertical" },
  { label: "Square Video", width: 1080, height: 1080, description: "1:1 square" },
  { label: "Twitter/X Video", width: 1200, height: 675, description: "16:9 landscape" },
];

const Index = () => {
  const [editorState, setEditorState] = useState<{
    mode: EditorMode;
    preset: CanvasSizePreset;
  } | null>(null);

  if (editorState) {
    return (
      <EditorShell
        mode={editorState.mode}
        initialSize={editorState.preset}
        onBack={() => setEditorState(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Create a New Design
          </h1>
          <p className="text-slate-500 text-base">Choose a format to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Image size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Image Design</h2>
                <p className="text-xs text-slate-400">Posters, flyers, social media</p>
              </div>
            </div>
            <div className="p-3 space-y-1 max-h-[320px] overflow-y-auto">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setEditorState({ mode: "image", preset })}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800">{preset.label}</span>
                    <span className="text-xs text-slate-400 ml-2">{preset.description}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Film size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Video Design</h2>
                <p className="text-xs text-slate-400">Reels, stories, animations</p>
              </div>
            </div>
            <div className="p-3 space-y-1 max-h-[320px] overflow-y-auto">
              {VIDEO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setEditorState({ mode: "video", preset })}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800">{preset.label}</span>
                    <span className="text-xs text-slate-400 ml-2">{preset.description}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
