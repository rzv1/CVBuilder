import React, {useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AccordionItem, AccordionTrigger, AccordionPanel } from '@/src/components/ui/accordion';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/src/components/ui/empty';
import {
  DatePicker,
  DatePickerInput,
  DatePickerCalendar,
} from '@/src/components/ui/date-picker';
import { Field, FieldLabel } from '@/src/components/ui/field';
import { Separator } from '@/src/components/ui/separator';
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from '@/src/components/ui/editable';
import { useSortable } from '@dnd-kit/react/sortable';
import { useCv } from '@/src/context/index.jsx';

export default function ExperienceSection() {
  const { cvData, handleUpdateCvData } = useCv();
  const experienceData = cvData?.experience || [];

  const addExperience = () => {
    const newEntry = {
      id: `exp-${Date.now()}`,
      role: "Software Developer",
      company: "Company Name",
      location: "Remote",
      start: "2023",
      end: "Prezent",
      variant: "all",
      description: "Brief summary of role responsibilities.",
      bullets: ["Accelerated load times by 40% through code splitting and asset optimization."],
      skills: ["React", "TypeScript"]
    };
    handleUpdateCvData(prev => ({
      ...prev,
      experience: [...(prev?.experience || []), newEntry]
    }));
  };

  const deleteExperience = (idx) => {
    handleUpdateCvData(prev => ({
      ...prev,
      experience: (prev?.experience || []).filter((_, i) => i !== idx)
    }));
  };

  const handleExpChange = (idx, field, value) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.experience || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, experience: list };
    });
  };

  const handleBulletChange = (expIdx, bulletIdx, value) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.experience || [])];
      const bullets = [...(list[expIdx]?.bullets || [])];
      bullets[bulletIdx] = value;
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  const addBulletPoint = (expIdx) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.experience || [])];
      const bullets = [...(list[expIdx]?.bullets || []), "Accomplished [X] as measured by [Y], by doing [Z]"];
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  const removeBulletPoint = (expIdx, bulletIdx) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.experience || [])];
      const bullets = (list[expIdx]?.bullets || []).filter((_, i) => i !== bulletIdx);
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  const moveItem = (_sectionKey, index, direction) => {
    const targetIdx = index + direction;
    handleUpdateCvData(prev => {
      const list = [...(prev?.experience || [])];
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [removed] = list.splice(index, 1);
      list.splice(targetIdx, 0, removed);
      return { ...prev, experience: list };
    });
  };
  return (
    <AccordionItem value="experience" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <Briefcase className="size-5 text-emerald-400" />
          <span className="text-sm font-bold text-slate-100">Work Experience</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {experienceData.length} items
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <span className="text-xs text-slate-400 italic">Drag handle to reorder or delete</span>
          <Button size="xs" onClick={addExperience} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
            <Plus className="size-3.5" /> Add
          </Button>
        </div>

        {experienceData.length === 0 ? (
          <Empty className="py-8 bg-slate-900/40 border-slate-800">
            <EmptyMedia variant="icon">
              <Briefcase className="size-4 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-slate-200">No work experience added yet</EmptyTitle>
              <EmptyDescription className="text-slate-400">
                Add your previous and current roles, key accomplishments, and impact.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="xs" onClick={addExperience} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Plus className="size-3.5" /> Add
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          experienceData.map((exp, expIdx) => (
            <ExperienceCard
              key={exp.id || `exp-${expIdx}`}
              exp={exp}
              expIdx={expIdx}
              totalItems={experienceData.length}
              handleExpChange={handleExpChange}
              handleBulletChange={handleBulletChange}
              addBulletPoint={addBulletPoint}
              removeBulletPoint={removeBulletPoint}
              deleteExperience={deleteExperience}
              moveItem={moveItem}
            />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

function ExperienceCard({
  exp,
  expIdx,
  totalItems,
  handleExpChange,
  handleBulletChange,
  addBulletPoint,
  removeBulletPoint,
  deleteExperience,
  moveItem
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sortableId = exp.id || `exp-${expIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: expIdx,
    group: 'experience',
    data: { sectionKey: 'experience', index: expIdx }
  });

  const isExpanded = !isDragging && isOpen;

  return (
    <div
      ref={ref}
      className={`mb-3 rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''
      }`}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-3.5 px-4 cursor-pointer transition-colors select-none ${
          isExpanded 
            ? 'bg-slate-800/60 text-slate-100' 
            : 'hover:bg-slate-800/40 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            ref={handleRef}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-1 -ml-1 rounded select-none touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
              disabled={expIdx === totalItems - 1}
              onClick={() => moveItem('experience', expIdx, 1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <strong className="text-xs font-semibold truncate">
            {exp.role || 'New Role'} @ {exp.company || 'Company'}
          </strong>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-4 space-y-5 border-t border-slate-800/80">
          {/* 2-Column Grid with Continuous Vertical Separator */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
            {/* Row 1 */}
            <Field className="md:col-start-1 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Job Title / Role</FieldLabel>
              <Editable
                value={exp.role || ''}
                autoResize
                onValueChange={(details) => handleExpChange(expIdx, 'role', details.value)}
                onValueRevert={(details) => handleExpChange(expIdx, 'role', details.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full max-w-none"
              >
                <EditableArea>
                  <EditablePreview />
                  <EditableInput asChild className="data-autoresize:wrap-break-word">
                    <textarea rows={1} />
                  </EditableInput>
                </EditableArea>
              </Editable>
            </Field>

            {/* Continuous Vertical Separator spanning rows 1-2 */}
            <Separator
              orientation="vertical"
              className="hidden md:block w-px bg-slate-800/80 md:col-start-2 md:row-start-1 md:row-end-3 self-stretch"
            />

            <Field className="md:col-start-3 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Company / Employer</FieldLabel>
              <Editable
                value={exp.company || ''}
                autoResize
                onValueChange={(details) => handleExpChange(expIdx, 'company', details.value)}
                onValueRevert={(details) => handleExpChange(expIdx, 'company', details.value)}
                placeholder="e.g. Google"
                className="w-full max-w-none"
              >
                <EditableArea>
                  <EditablePreview />
                  <EditableInput asChild className="data-autoresize:wrap-break-word">
                    <textarea rows={1} />
                  </EditableInput>
                </EditableArea>
              </Editable>
            </Field>

            {/* Row 2 */}
            <Field className="md:col-start-1 md:row-start-2">
              <FieldLabel className="text-xs font-semibold text-slate-400">Location</FieldLabel>
              <Editable
                value={exp.location || ''}
                autoResize
                onValueChange={(details) => handleExpChange(expIdx, 'location', details.value)}
                onValueRevert={(details) => handleExpChange(expIdx, 'location', details.value)}
                placeholder="e.g. Mountain View, CA or Remote"
                className="w-full max-w-none"
              >
                <EditableArea>
                  <EditablePreview />
                  <EditableInput asChild className="data-autoresize:wrap-break-word">
                    <textarea rows={1} />
                  </EditableInput>
                </EditableArea>
              </Editable>
            </Field>

            <Field className="md:col-start-3 md:row-start-2">
              <FieldLabel className="text-xs font-semibold text-slate-400">Time Period (Dates)</FieldLabel>
              <DatePicker
                selectionMode="range"
                numOfMonths={2}
                className="w-full"
                onValueChange={(details) => {
                  if (details.value && details.value.length > 0) {
                    const startStr = details.value[0] ? details.value[0].toString() : '';
                    const endStr = details.value[1] ? details.value[1].toString() : 'Present';
                    handleExpChange(expIdx, 'start', startStr);
                    handleExpChange(expIdx, 'end', endStr);
                  }
                }}
              >
                <DatePickerInput
                  placeholder={`${exp.start || 'Start Date'} - ${exp.end || 'End Date'}`}
                />
                <DatePickerCalendar />
              </DatePicker>
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">Role Description</FieldLabel>
            <Textarea
              rows={2}
              value={exp.description || ''}
              onChange={(e) => handleExpChange(expIdx, 'description', e.target.value)}
              placeholder="High-level overview of role and impact..."
              className="text-xs bg-slate-950 border-slate-800 text-slate-200"
            />
          </Field>

          {/* Bullet Points */}
          <Field className="space-y-2">
            <FieldLabel className="text-xs font-semibold text-slate-400">Bullet Points / Achievements</FieldLabel>
            {(exp.bullets || []).map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-2">
                <Input
                  value={bullet}
                  className="text-xs h-8 bg-slate-950 border-slate-800 text-slate-200 flex-1"
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
          </Field>
        </div>
      )}
    </div>
  );
}
