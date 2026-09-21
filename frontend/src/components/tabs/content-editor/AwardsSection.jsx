import React, { useState } from 'react';
import {
  Award,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/frontend/src/components/ui/button';
import { Badge } from '@/frontend/src/components/ui/badge';
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
import { useCv } from '@/frontend/src/context/index.jsx';

export default function AwardsSection() {
  const { cvData, handleUpdateCvData } = useCv();
  const awardsData = cvData?.awards || [];

  const addAward = () => {
    const newAward = {
      id: `aw-${Date.now()}`,
      title: "Premiu / Recunoaștere Profesională",
      issuer: "Organizație Emitentă",
      date: "2024",
      description: "Descriere succinctă a distincției obținute și a meritului premiat."
    };
    handleUpdateCvData(prev => ({
      ...prev,
      awards: [...(prev?.awards || []), newAward]
    }));
  };

  const deleteAward = (idx) => {
    handleUpdateCvData(prev => ({
      ...prev,
      awards: (prev?.awards || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAwardChange = (idx, field, value) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.awards || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, awards: list };
    });
  };

  const moveItem = (_sectionKey, index, direction) => {
    const targetIdx = index + direction;
    handleUpdateCvData(prev => {
      const list = [...(prev?.awards || [])];
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [removed] = list.splice(index, 1);
      list.splice(targetIdx, 0, removed);
      return { ...prev, awards: list };
    });
  };
  return (
    <AccordionItem value="awards" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <Award className="size-5 text-yellow-400" />
          <span className="text-sm font-bold text-slate-100">Honors & Awards</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {awardsData.length} items
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-slate-400 italic">Drag handle to reorder or delete</span>
          <Button size="xs" onClick={addAward} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
            <Plus className="size-3.5" /> Add
          </Button>
        </div>

        {awardsData.length === 0 ? (
          <Empty className="py-8 bg-slate-900/40 border-slate-800">
            <EmptyMedia variant="icon">
              <Award className="size-4 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-slate-200">No honors or awards added yet</EmptyTitle>
              <EmptyDescription className="text-slate-400">
                Add accolades, certifications, patents, or recognitions to highlight your achievements.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="xs" onClick={addAward} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Plus className="size-3.5" /> Add
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          awardsData.map((award, awdIdx) => (
            <AwardCard
              key={award.id || `award-${awdIdx}`}
              award={award}
              awdIdx={awdIdx}
              totalItems={awardsData.length}
              handleAwardChange={handleAwardChange}
              deleteAward={deleteAward}
              moveItem={moveItem}
            />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

function AwardCard({
  award,
  awdIdx,
  totalItems,
  handleAwardChange,
  deleteAward,
  moveItem
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sortableId = award.id || `award-${awdIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: awdIdx,
    group: 'awards',
    data: { sectionKey: 'awards', index: awdIdx }
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
              disabled={awdIdx === 0}
              onClick={() => moveItem('awards', awdIdx, -1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={awdIdx === totalItems - 1}
              onClick={() => moveItem('awards', awdIdx, 1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <strong className="text-xs font-semibold truncate">{award.title || 'Award Title'}</strong>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-4 space-y-5 border-t border-slate-800/80">
          {/* Award Title */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">Award Title</FieldLabel>
            <Editable
              value={award.title || ''}
              autoResize
              onValueChange={(details) => handleAwardChange(awdIdx, 'title', details.value)}
              onValueRevert={(details) => handleAwardChange(awdIdx, 'title', details.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
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

          {/* 2-Column Grid with Continuous Vertical Separator */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
            <Field className="md:col-start-1 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Issuer / Organization</FieldLabel>
              <Editable
                value={award.issuer || ''}
                autoResize
                onValueChange={(details) => handleAwardChange(awdIdx, 'issuer', details.value)}
                onValueRevert={(details) => handleAwardChange(awdIdx, 'issuer', details.value)}
                placeholder="e.g. Amazon Web Services, Tech Summit"
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

            <Separator
              orientation="vertical"
              className="hidden md:block md:col-start-2 md:row-start-1 bg-slate-800/80 self-stretch my-1"
            />

            <DatePicker
              value={award.date ? [award.date] : []}
              onValueChange={(details) => handleAwardChange(awdIdx, 'date', details.valueAsString[0] || '')}
              selectionMode="single"
              className="md:col-start-3 md:row-start-1 flex flex-col gap-1.5"
            >
              <DatePickerLabel className="text-xs font-semibold text-slate-400">Date Received</DatePickerLabel>
              <DatePickerInput />
              <DatePickerCalendar />
            </DatePicker>
          </div>

          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">Award Description</FieldLabel>
            <Textarea
              rows={2}
              placeholder="Brief summary of why award was conferred..."
              value={award.description || ''}
              onChange={(e) => handleAwardChange(awdIdx, 'description', e.target.value)}
            />
          </Field>
        </div>
      )}
    </div>
  );
}
