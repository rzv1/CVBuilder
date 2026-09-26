import React, { useState } from 'react';
import {
  FolderPlus,
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
import { Field, FieldLabel } from '@/src/components/ui/field';
import { Separator } from '@/src/components/ui/separator';
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from '@/src/components/ui/editable';
import {
  DatePicker,
  DatePickerLabel,
  DatePickerInput,
  DatePickerCalendar,
} from '@/src/components/ui/date-picker';
import { useSortable } from '@dnd-kit/react/sortable';
import { useCv } from '@/src/context/index.jsx';

export default function CustomSections() {
  const { cvData, handleUpdateCvData } = useCv();
  const customSectionsList = cvData?.customSections || [];
  const isMaxCustomSectionsReached = customSectionsList.length >= 3;

  const addCustomSection = () => {
    if (isMaxCustomSectionsReached) return;
    const newSecNumber = customSectionsList.length + 1;
    const newSec = {
      id: `custom-sec-${Date.now()}`,
      title: `Secțiune Personalizată ${newSecNumber} (ex: Proiecte / Voluntariat)`,
      items: [
        {
          id: `csi-${Date.now()}`,
          heading: "Titlu Proiect / Rol",
          subheading: "Organizație / Tehnologii",
          start: "2024",
          end: "Prezent",
          detail: "Descrierea activităților desfășurate și a rezultatelor cheie."
        }
      ]
    };
    handleUpdateCvData(prev => ({
      ...prev,
      customSections: [...(prev?.customSections || []), newSec]
    }));
  };

  const deleteCustomSection = (secIdx) => {
    handleUpdateCvData(prev => ({
      ...prev,
      customSections: (prev?.customSections || []).filter((_, i) => i !== secIdx)
    }));
  };

  const addCustomSectionItem = (secIdx) => {
    const newItem = {
      id: `csi-${Date.now()}`,
      heading: "Titlu Intrare Nouă",
      subheading: "Subtitlu / Rol",
      start: "2024",
      end: "Prezent",
      detail: "Detalii și rezultate obținute."
    };
    handleUpdateCvData(prev => {
      const secList = [...(prev?.customSections || [])];
      if (!secList[secIdx]) return prev;
      secList[secIdx].items = [...(secList[secIdx].items || []), newItem];
      return { ...prev, customSections: secList };
    });
  };

  const deleteCustomSectionItem = (secIdx, itemIdx) => {
    handleUpdateCvData(prev => {
      const secList = [...(prev?.customSections || [])];
      if (!secList[secIdx]) return prev;
      secList[secIdx].items = (secList[secIdx].items || []).filter((_, i) => i !== itemIdx);
      return { ...prev, customSections: secList };
    });
  };

  const handleCustomItemChange = (secIdx, itemIdx, field, value) => {
    handleUpdateCvData(prev => {
      const secList = [...(prev?.customSections || [])];
      if (!secList[secIdx] || !secList[secIdx].items?.[itemIdx]) return prev;
      secList[secIdx].items[itemIdx] = {
        ...secList[secIdx].items[itemIdx],
        [field]: value
      };
      return { ...prev, customSections: secList };
    });
  };

  const moveItem = (_sectionKey, index, direction, customSecIdx = null) => {
    if (customSecIdx === null) return;
    const targetIdx = index + direction;
    handleUpdateCvData(prev => {
      const secList = [...(prev?.customSections || [])];
      const items = [...(secList[customSecIdx]?.items || [])];
      if (targetIdx < 0 || targetIdx >= items.length) return prev;
      const [removed] = items.splice(index, 1);
      items.splice(targetIdx, 0, removed);
      secList[customSecIdx].items = items;
      return { ...prev, customSections: secList };
    });
  };
  return (
    <div className="space-y-4">
      {customSectionsList.map((sec, secIdx) => {
        const items = sec.items || [];

        return (
          <AccordionItem
            key={sec.id || secIdx}
            value={`custom-${sec.id || secIdx}`}
            className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="size-5 text-purple-400" />
                <span className="text-sm font-bold text-slate-100">
                  {sec.title || `Custom Section ${secIdx + 1}`}
                </span>
                <Badge variant="outline" className="text-[11px] bg-slate-800/70 border-slate-700 text-slate-300">
                  {items.length} items
                </Badge>
              </div>
            </AccordionTrigger>

            <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Field className="flex-1 min-w-[200px] space-y-1">
                  <FieldLabel className="text-xs font-semibold text-slate-400">Section Title</FieldLabel>
                  <Input
                    type="text"
                    placeholder="e.g. Projects, Certifications, Publications"
                    value={sec.title || ''}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      handleUpdateCvData(prev => {
                        const nextSections = [...(prev?.customSections || [])];
                        if (nextSections[secIdx]) {
                          nextSections[secIdx] = { ...nextSections[secIdx], title: newTitle };
                        }
                        return { ...prev, customSections: nextSections };
                      });
                    }}
                    className="h-8 text-sm"
                  />
                </Field>
                <div className="flex items-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => deleteCustomSection(secIdx)}
                    className="h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 gap-1 text-xs cursor-pointer"
                    title="Delete entire section"
                  >
                    <Trash2 className="size-3.5" /> Delete Section
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs text-slate-400 italic">Drag handle to reorder or delete</span>
                <Button size="xs" onClick={() => addCustomSectionItem(secIdx)} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>

              {items.length === 0 ? (
                <Empty className="py-8 bg-slate-900/40 border-purple-900/30">
                  <EmptyMedia variant="icon">
                    <FolderPlus className="size-4 text-purple-400" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle className="text-slate-200">No items in this custom section yet</EmptyTitle>
                    <EmptyDescription className="text-slate-400">
                      Add entries or specific details to showcase your projects, publications, or volunteer experience.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button size="xs" onClick={() => addCustomSectionItem(secIdx)} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                      <Plus className="size-3.5" /> Add
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                items.map((item, itemIdx) => (
                  <CustomSectionItemCard
                    key={item.id || `custom-${secIdx}-${itemIdx}`}
                    item={item}
                    itemIdx={itemIdx}
                    secIdx={secIdx}
                    totalItems={items.length}
                    handleCustomItemChange={handleCustomItemChange}
                    deleteCustomSectionItem={deleteCustomSectionItem}
                    moveItem={moveItem}
                  />
                ))
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}

      {/* BOTTOM ANCHORED "NEW SECTION" BUTTON */}
      <div className="pt-2 flex flex-col items-center gap-2">
        <Button
          type="button"
          disabled={isMaxCustomSectionsReached}
          onClick={addCustomSection}
          className={`w-full h-11 border border-dashed rounded-xl font-bold gap-2 text-xs transition-all ${
            isMaxCustomSectionsReached
              ? 'border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed'
              : 'border-purple-500/50 bg-purple-950/30 text-purple-200 hover:bg-purple-900/50 hover:text-white shadow-md shadow-purple-950/20'
          }`}
        >
          <FolderPlus className="size-4 text-purple-400" />
          {isMaxCustomSectionsReached
            ? "Maximum 3 Custom Sections Reached"
            : `Add Custom Section (${customSectionsList.length}/3)`}
        </Button>
        {isMaxCustomSectionsReached && (
          <span className="text-[11px] text-slate-500 text-center">
            You can have a maximum of 3 custom sections alongside Experience, Education, Skills, Languages, and Awards.
          </span>
        )}
      </div>
    </div>
  );
}

function CustomSectionItemCard({
  item,
  itemIdx,
  secIdx,
  totalItems,
  handleCustomItemChange,
  deleteCustomSectionItem,
  moveItem
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sortableId = item.id || `custom-${secIdx}-${itemIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: itemIdx,
    group: `custom-${secIdx}`,
    data: { sectionKey: 'custom', index: itemIdx, customSecIdx: secIdx }
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
              disabled={itemIdx === 0}
              onClick={() => moveItem('custom', itemIdx, -1, secIdx)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={itemIdx === totalItems - 1}
              onClick={() => moveItem('custom', itemIdx, 1, secIdx)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <strong className="text-xs font-semibold truncate">
            {item.heading || 'New Item'} {item.subheading ? `• ${item.subheading}` : ''}
          </strong>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-4 space-y-5 border-t border-slate-800/80">
          {/* 2-Column Grid with Continuous Vertical Separator */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
            {/* Row 1 */}
            <Field className="md:col-start-1 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Heading / Title</FieldLabel>
              <Editable
                value={item.heading || ''}
                autoResize
                onValueChange={(details) => handleCustomItemChange(secIdx, itemIdx, 'heading', details.value)}
                onValueRevert={(details) => handleCustomItemChange(secIdx, itemIdx, 'heading', details.value)}
                placeholder="e.g. React-Fast-Grid / Open Source Project"
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
              className="hidden md:block md:col-start-2 md:row-start-1 md:row-span-2 bg-slate-800/80 self-stretch my-1"
            />

            <Field className="md:col-start-3 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Subheading / Role</FieldLabel>
              <Editable
                value={item.subheading || ''}
                autoResize
                onValueChange={(details) => handleCustomItemChange(secIdx, itemIdx, 'subheading', details.value)}
                onValueRevert={(details) => handleCustomItemChange(secIdx, itemIdx, 'subheading', details.value)}
                placeholder="e.g. Lead Developer / Keynote Speaker"
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
            <DatePicker
              value={item.start ? [item.start] : []}
              onValueChange={(details) => handleCustomItemChange(secIdx, itemIdx, 'start', details.valueAsString[0] || '')}
              selectionMode="single"
              className="md:col-start-1 md:row-start-2 flex flex-col gap-1.5"
            >
              <DatePickerLabel className="text-xs font-semibold text-slate-400">Start Date</DatePickerLabel>
              <DatePickerInput />
              <DatePickerCalendar />
            </DatePicker>

            <DatePicker
              value={item.end ? [item.end] : []}
              onValueChange={(details) => handleCustomItemChange(secIdx, itemIdx, 'end', details.valueAsString[0] || '')}
              selectionMode="single"
              className="md:col-start-3 md:row-start-2 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <DatePickerLabel className="text-xs font-semibold text-slate-400">End Date</DatePickerLabel>
                <button
                  type="button"
                  onClick={() => handleCustomItemChange(secIdx, itemIdx, 'end', item.end === 'Present' ? '' : 'Present')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                >
                  {item.end === 'Present' ? 'Clear Present' : 'Set Present'}
                </button>
              </div>
              <DatePickerInput />
              <DatePickerCalendar />
            </DatePicker>
          </div>

          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">Description / Details</FieldLabel>
            <Textarea
              rows={2}
              placeholder="Detail key accomplishments, technologies used, or impact..."
              value={item.detail || ''}
              onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'detail', e.target.value)}
            />
          </Field>
        </div>
      )}
    </div>
  );
}
