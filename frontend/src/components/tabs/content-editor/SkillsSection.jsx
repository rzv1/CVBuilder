import React from 'react';
import {
  Wrench,
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

export default function SkillsSection({
  activeSection,
  toggleSection,
  skillsData = [],
  addSkillGroup,
  deleteSkillGroup,
  handleSkillGroupChange,
  handleSkillItemsChange,
  draggedItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  moveItem
}) {
  const isOpen = activeSection === 'skills';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
          isOpen ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
        }`}
        onClick={() => toggleSection('skills')}
      >
        <div className="flex items-center gap-2.5">
          <Wrench className="size-5 text-amber-400" />
          <span className="text-sm font-bold text-slate-100">Skills & Competencies</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {skillsData.length} categories
          </Badge>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-400 italic">Drag handle to reorder skill categories</span>
            <Button size="xs" onClick={addSkillGroup} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
              <Plus className="size-3.5" /> Add Skill Category
            </Button>
          </div>

          {skillsData.map((skillGroup, skIdx) => (
            <div
              key={skillGroup.id}
              className={`p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4 transition-all ${
                draggedItem?.sectionKey === 'skills' && draggedItem?.index === skIdx
                  ? 'opacity-50 ring-2 ring-indigo-500'
                  : ''
              }`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, 'skills', skIdx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'skills', skIdx)}
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
                      disabled={skIdx === 0}
                      onClick={() => moveItem('skills', skIdx, -1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={skIdx === skillsData.length - 1}
                      onClick={() => moveItem('skills', skIdx, 1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>
                  <strong className="text-xs text-slate-200">{skillGroup.category || 'Category Name'}</strong>
                </div>

                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => deleteSkillGroup(skIdx)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                  title="Delete Category"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Skill Category Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Frontend Development, Databases, Cloud"
                  value={skillGroup.category || ''}
                  onChange={(e) => handleSkillGroupChange(skIdx, 'category', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Skills List (comma-separated)</label>
                <Input
                  type="text"
                  placeholder="e.g. React, TypeScript, Next.js, Redux"
                  value={skillGroup.rawInput !== undefined ? skillGroup.rawInput : (skillGroup.items || []).join(', ')}
                  onChange={(e) => handleSkillItemsChange(skIdx, e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(skillGroup.items || []).map((item, i) => (
                  <Badge key={i} variant="blue" className="text-[11px] font-semibold px-2 py-0.5">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
