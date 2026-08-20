import React from 'react';
import {
  GraduationCap,
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
import { Textarea } from '@/frontend/components/ui/textarea';

export default function EducationSection({
  activeSection,
  toggleSection,
  educationData = [],
  addEducation,
  deleteEducation,
  handleEducationChange,
  draggedItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  moveItem
}) {
  const isOpen = activeSection === 'education';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
          isOpen ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
        }`}
        onClick={() => toggleSection('education')}
      >
        <div className="flex items-center gap-2.5">
          <GraduationCap className="size-5 text-purple-400" />
          <span className="text-sm font-bold text-slate-100">Education</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {educationData.length} items
          </Badge>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-400 italic">Drag handle to reorder education entries</span>
            <Button size="xs" onClick={addEducation} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
              <Plus className="size-3.5" /> Add Education
            </Button>
          </div>

          {educationData.map((edu, eduIdx) => (
            <div
              key={edu.id}
              className={`p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4 transition-all ${
                draggedItem?.sectionKey === 'education' && draggedItem?.index === eduIdx
                  ? 'opacity-50 ring-2 ring-indigo-500'
                  : ''
              }`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, 'education', eduIdx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'education', eduIdx)}
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
                      disabled={eduIdx === 0}
                      onClick={() => moveItem('education', eduIdx, -1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={eduIdx === educationData.length - 1}
                      onClick={() => moveItem('education', eduIdx, 1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>
                  <strong className="text-xs text-slate-200">
                    {edu.degree || 'Degree'} @ {edu.institution || 'University'}
                  </strong>
                </div>

                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => deleteEducation(eduIdx)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                  title="Delete Education"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Degree / Qualification</label>
                <Input type="text" value={edu.degree || ''} onChange={(e) => handleEducationChange(eduIdx, 'degree', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Institution / University</label>
                  <Input type="text" value={edu.institution || ''} onChange={(e) => handleEducationChange(eduIdx, 'institution', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <Input type="text" placeholder="e.g. Bucharest, RO" value={edu.location || ''} onChange={(e) => handleEducationChange(eduIdx, 'location', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <Input type="text" placeholder="e.g. 2014" value={edu.start || ''} onChange={(e) => handleEducationChange(eduIdx, 'start', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">End Date</label>
                  <Input type="text" placeholder="e.g. 2018" value={edu.end || ''} onChange={(e) => handleEducationChange(eduIdx, 'end', e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description & Achievements</label>
                <Textarea rows={2} placeholder="e.g. Graduated with Honors, Thesis topic..." value={edu.description || ''} onChange={(e) => handleEducationChange(eduIdx, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
