import React from 'react';
import {
  GraduationCap,
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
import { AccordionItem, AccordionTrigger, AccordionPanel } from '@/frontend/src/components/ui/accordion';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/frontend/src/components/ui/empty';
import {
  DatePicker,
  DatePickerLabel,
  DatePickerInput,
  DatePickerCalendar,
} from '@/frontend/src/components/ui/date-picker';
import { Field, FieldLabel } from '@/frontend/src/components/ui/field';
import { Separator } from '@/frontend/src/components/ui/separator';
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from '@/frontend/src/components/ui/editable';
import { useSortable } from '@dnd-kit/react/sortable';

export default function EducationSection({
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
  return (
    <AccordionItem value="education" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="size-5 text-purple-400" />
          <span className="text-sm font-bold text-slate-100">Education</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {educationData.length} items
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-slate-400 italic">Drag handle to reorder education entries</span>
          <Button size="xs" onClick={addEducation} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
            <Plus className="size-3.5" /> Add Education
          </Button>
        </div>

        {educationData.length === 0 ? (
          <Empty className="py-8 bg-slate-900/40 border-slate-800">
            <EmptyMedia variant="icon">
              <GraduationCap className="size-4 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-slate-200">No education history added yet</EmptyTitle>
              <EmptyDescription className="text-slate-400">
                Add degrees, universities, certifications, or academic honors.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="xs" onClick={addEducation} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Plus className="size-3.5" /> Add Education
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          educationData.map((edu, eduIdx) => (
            <EducationCard
              key={edu.id || `edu-${eduIdx}`}
              edu={edu}
              eduIdx={eduIdx}
              totalItems={educationData.length}
              handleEducationChange={handleEducationChange}
              deleteEducation={deleteEducation}
              moveItem={moveItem}
            />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

function EducationCard({
  edu,
  eduIdx,
  totalItems,
  handleEducationChange,
  deleteEducation,
  moveItem
}) {
  const sortableId = edu.id || `edu-${eduIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: eduIdx,
    group: 'education',
    data: { sectionKey: 'education', index: eduIdx }
  });

  return (
    <div
      ref={ref}
      className={`p-5 rounded-xl border border-slate-800 bg-slate-900/90 space-y-5 transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            ref={handleRef}
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-1 -ml-1 rounded select-none touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={eduIdx === 0}
              onClick={() => moveItem('education', eduIdx, -1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={eduIdx === totalItems - 1}
              onClick={() => moveItem('education', eduIdx, 1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
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

      {/* Degree / Qualification */}
      <Field>
        <FieldLabel className="text-xs font-semibold text-slate-400">Degree / Qualification</FieldLabel>
        <Editable
          value={edu.degree || ''}
          onValueChange={(details) => handleEducationChange(eduIdx, 'degree', details.value)}
          onValueRevert={(details) => handleEducationChange(eduIdx, 'degree', details.value)}
          placeholder="e.g. Bachelor of Science in Computer Science"
          className="w-full max-w-none"
        >
          <EditableArea>
            <EditablePreview />
            <EditableInput />
          </EditableArea>
        </Editable>
      </Field>

      {/* 2-Column Grid with Continuous Vertical Separator */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
        {/* Row 1 */}
        <Field className="md:col-start-1 md:row-start-1">
          <FieldLabel className="text-xs font-semibold text-slate-400">Institution / University</FieldLabel>
          <Editable
            value={edu.institution || ''}
            onValueChange={(details) => handleEducationChange(eduIdx, 'institution', details.value)}
            onValueRevert={(details) => handleEducationChange(eduIdx, 'institution', details.value)}
            placeholder="e.g. Stanford University"
            className="w-full max-w-none"
          >
            <EditableArea>
              <EditablePreview />
              <EditableInput />
            </EditableArea>
          </Editable>
        </Field>

        {/* Continuous Vertical Separator spanning rows 1-2 */}
        <Separator
          orientation="vertical"
          className="hidden md:block md:col-start-2 md:row-start-1 md:row-span-2 bg-slate-800/80 self-stretch my-1"
        />

        <Field className="md:col-start-3 md:row-start-1">
          <FieldLabel className="text-xs font-semibold text-slate-400">Location</FieldLabel>
          <Editable
            value={edu.location || ''}
            onValueChange={(details) => handleEducationChange(eduIdx, 'location', details.value)}
            onValueRevert={(details) => handleEducationChange(eduIdx, 'location', details.value)}
            placeholder="e.g. Stanford, CA"
            className="w-full max-w-none"
          >
            <EditableArea>
              <EditablePreview />
              <EditableInput />
            </EditableArea>
          </Editable>
        </Field>

        {/* Row 2 */}
        <DatePicker
          value={edu.start ? [edu.start] : []}
          onValueChange={(details) => handleEducationChange(eduIdx, 'start', details.valueAsString[0] || '')}
          selectionMode="single"
          className="md:col-start-1 md:row-start-2 flex flex-col gap-1.5"
        >
          <DatePickerLabel className="text-xs font-semibold text-slate-400">Start Date</DatePickerLabel>
          <DatePickerInput />
          <DatePickerCalendar />
        </DatePicker>

        <DatePicker
          value={edu.end ? [edu.end] : []}
          onValueChange={(details) => handleEducationChange(eduIdx, 'end', details.valueAsString[0] || '')}
          selectionMode="single"
          className="md:col-start-3 md:row-start-2 flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between">
            <DatePickerLabel className="text-xs font-semibold text-slate-400">End Date</DatePickerLabel>
            <button
              type="button"
              onClick={() => handleEducationChange(eduIdx, 'end', edu.end === 'Present' ? '' : 'Present')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              {edu.end === 'Present' ? 'Clear Present' : 'Set Present'}
            </button>
          </div>
          <DatePickerInput />
          <DatePickerCalendar />
        </DatePicker>
      </div>

      <Field>
        <FieldLabel className="text-xs font-semibold text-slate-400">Description & Achievements</FieldLabel>
        <Textarea
          rows={2}
          placeholder="e.g. Graduated with Honors, Thesis topic..."
          value={edu.description || ''}
          onChange={(e) => handleEducationChange(eduIdx, 'description', e.target.value)}
        />
      </Field>
    </div>
  );
}
