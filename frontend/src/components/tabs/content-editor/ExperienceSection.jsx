import React from 'react';
import {
  Briefcase,
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

export default function ExperienceSection({
  activeSection,
  toggleSection,
  experienceData = [],
  addExperience,
  deleteExperience,
  handleExpChange,
  handleBulletChange,
  addBulletPoint,
  removeBulletPoint,
  draggedItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  moveItem
}) {
  const isOpen = activeSection === 'experience';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
          isOpen ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
        }`}
        onClick={() => toggleSection('experience')}
      >
        <div className="flex items-center gap-2.5">
          <Briefcase className="size-5 text-emerald-400" />
          <span className="text-sm font-bold text-slate-100">Work Experience</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {experienceData.length} items
          </Badge>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-400 italic">Drag handle to reorder experience entries</span>
            <Button size="xs" onClick={addExperience} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
              <Plus className="size-3.5" /> Add Experience
            </Button>
          </div>

          {experienceData.map((exp, expIdx) => (
            <div
              key={exp.id}
              className={`p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4 transition-all ${
                draggedItem?.sectionKey === 'experience' && draggedItem?.index === expIdx
                  ? 'opacity-50 ring-2 ring-indigo-500'
                  : ''
              }`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, 'experience', expIdx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'experience', expIdx)}
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
                      disabled={expIdx === 0}
                      onClick={() => moveItem('experience', expIdx, -1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={expIdx === experienceData.length - 1}
                      onClick={() => moveItem('experience', expIdx, 1)}
                      className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="size-3" />
                    </Button>
                  </div>
                  <strong className="text-xs text-slate-200">
                    {exp.role || 'New Role'} @ {exp.company || 'Company'}
                  </strong>
                </div>

                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => deleteExperience(expIdx)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                  title="Delete Experience"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Job Title / Role</label>
                  <Input type="text" value={exp.role || ''} onChange={(e) => handleExpChange(expIdx, 'role', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Company / Organization</label>
                  <Input type="text" value={exp.company || ''} onChange={(e) => handleExpChange(expIdx, 'company', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <Input type="text" placeholder="e.g. 2022" value={exp.start || ''} onChange={(e) => handleExpChange(expIdx, 'start', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">End Date</label>
                  <Input type="text" placeholder="e.g. Present" value={exp.end || ''} onChange={(e) => handleExpChange(expIdx, 'end', e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Role Summary</label>
                <Input type="text" placeholder="Brief summary of primary responsibilities..." value={exp.description || ''} onChange={(e) => handleExpChange(expIdx, 'description', e.target.value)} />
              </div>

              {/* Bullet Points */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Quantifiable Bullet Achievements
                </label>

                {(exp.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <Textarea
                      rows={2}
                      className="text-xs"
                      value={bullet}
                      onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="h-7 w-7 mt-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                      onClick={() => removeBulletPoint(expIdx, bIdx)}
                      title="Remove Bullet"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="xs"
                  className="w-full h-8 text-xs font-semibold bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => addBulletPoint(expIdx)}
                >
                  <Plus className="size-3.5" /> Add Bullet Point
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
