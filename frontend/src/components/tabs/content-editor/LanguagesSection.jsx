import React from 'react';
import {
  Globe2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Input } from '@/frontend/components/ui/input';

export default function LanguagesSection({
  activeSection,
  toggleSection,
  languagesData = [],
  addLanguage,
  deleteLanguage,
  handleLanguageChange,
  draggedItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  moveItem
}) {
  const isOpen = activeSection === 'languages';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
          isOpen ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
        }`}
        onClick={() => toggleSection('languages')}
      >
        <div className="flex items-center gap-2.5">
          <Globe2 className="size-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-100">Languages</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {languagesData.length} items
          </Badge>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-400 italic">Drag handle to reorder language entries</span>
            <Button size="xs" onClick={addLanguage} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
              <Plus className="size-3.5" /> Add Language
            </Button>
          </div>

          {languagesData.map((lang, langIdx) => (
            <div
              key={lang.id}
              className={`p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4 transition-all ${
                draggedItem?.sectionKey === 'languages' && draggedItem?.index === langIdx
                  ? 'opacity-50 ring-2 ring-indigo-500'
                  : ''
              }`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, 'languages', langIdx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'languages', langIdx)}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="cursor-grab text-slate-500 hover:text-slate-300" title="Drag to reorder">
                    <GripVertical className="size-4" />
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={langIdx === 0}
                      onClick={() => moveItem('languages', langIdx, -1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={langIdx === languagesData.length - 1}
                      onClick={() => moveItem('languages', langIdx, 1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>
                  <strong className="text-xs text-slate-200">
                    {lang.name || 'Language'} — {lang.level || 'Proficiency'}
                  </strong>
                </div>

                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => deleteLanguage(langIdx)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                  title="Delete Language"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Language Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. English, French"
                    value={lang.name || ''}
                    onChange={(e) => handleLanguageChange(langIdx, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Proficiency Level</label>
                  <Input
                    type="text"
                    placeholder="e.g. Native / Full Professional / C2"
                    value={lang.level || ''}
                    onChange={(e) => handleLanguageChange(langIdx, 'level', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
