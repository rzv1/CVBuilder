import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { AccordionItem, AccordionTrigger, AccordionPanel } from '@/src/components/ui/accordion';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/src/components/ui/empty';
import { Field, FieldLabel } from '@/src/components/ui/field';
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from '@/src/components/ui/editable';
import { useSortable } from '@dnd-kit/react/sortable';
import {
  TagsInput,
  TagsInputControl,
  TagsInputItem,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputInput,
  TagsInputClearTrigger
} from '@/src/components/ui/tags-input';
import { useCv } from '@/src/context/index.jsx';

export default function SkillsSection() {
  const { cvData, handleUpdateCvData } = useCv();
  const skillsData = cvData?.skills || [];

  const addSkillGroup = () => {
    const newSkill = {
      id: `sk-${Date.now()}`,
      category: "Domeniu Abilități",
      items: ["Skill 1", "Skill 2", "Skill 3"]
    };
    handleUpdateCvData(prev => ({
      ...prev,
      skills: [...(prev?.skills || []), newSkill]
    }));
  };

  const deleteSkillGroup = (idx) => {
    handleUpdateCvData(prev => ({
      ...prev,
      skills: (prev?.skills || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSkillGroupChange = (idx, field, value) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.skills || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, skills: list };
    });
  };

  const handleSkillItemsChange = (idx, value) => {
    const itemsArray = Array.isArray(value)
      ? value.map(s => String(s).trim()).filter(Boolean)
      : String(value || '').split(',').map(s => s.trim()).filter(Boolean);
    handleUpdateCvData(prev => {
      const list = [...(prev?.skills || [])];
      list[idx] = { ...list[idx], items: itemsArray, rawInput: Array.isArray(value) ? undefined : value };
      return { ...prev, skills: list };
    });
  };

  const moveItem = (_sectionKey, index, direction) => {
    const targetIdx = index + direction;
    handleUpdateCvData(prev => {
      const list = [...(prev?.skills || [])];
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [removed] = list.splice(index, 1);
      list.splice(targetIdx, 0, removed);
      return { ...prev, skills: list };
    });
  };
  return (
    <AccordionItem value="skills" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <Wrench className="size-5 text-amber-400" />
          <span className="text-sm font-bold text-slate-100">Skills & Competencies</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {skillsData.length} categories
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-slate-400 italic">Drag handle to reorder or delete</span>
          <Button size="xs" onClick={addSkillGroup} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
            <Plus className="size-3.5" /> Add
          </Button>
        </div>

        {skillsData.length === 0 ? (
          <Empty className="py-8 bg-slate-900/40 border-slate-800">
            <EmptyMedia variant="icon">
              <Wrench className="size-4 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-slate-200">No skill categories added yet</EmptyTitle>
              <EmptyDescription className="text-slate-400">
                Organize your technical abilities, tools, frameworks, and soft skills into groups.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="xs" onClick={addSkillGroup} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Plus className="size-3.5" /> Add
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          skillsData.map((skillGroup, skIdx) => (
            <SkillGroupCard
              key={skillGroup.id || `sk-${skIdx}`}
              skillGroup={skillGroup}
              skIdx={skIdx}
              totalItems={skillsData.length}
              handleSkillGroupChange={handleSkillGroupChange}
              handleSkillItemsChange={handleSkillItemsChange}
              deleteSkillGroup={deleteSkillGroup}
              moveItem={moveItem}
            />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

function SkillGroupCard({
  skillGroup,
  skIdx,
  totalItems,
  handleSkillGroupChange,
  handleSkillItemsChange,
  deleteSkillGroup,
  moveItem
}) {
  const [isOpen, setIsOpen] = useState(false);
  const items = skillGroup.items || [];
  const sortableId = skillGroup.id || `sk-${skIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: skIdx,
    group: 'skills',
    data: { sectionKey: 'skills', index: skIdx }
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
              disabled={skIdx === 0}
              onClick={() => moveItem('skills', skIdx, -1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={skIdx === totalItems - 1}
              onClick={() => moveItem('skills', skIdx, 1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <strong className="text-xs font-semibold truncate">
            {skillGroup.category || 'Category Name'}
          </strong>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-4 space-y-5 border-t border-slate-800/80">
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">Skill Category Title</FieldLabel>
            <Editable
              value={skillGroup.category || ''}
              autoResize
              onValueChange={(details) => handleSkillGroupChange(skIdx, 'category', details.value)}
              onValueRevert={(details) => handleSkillGroupChange(skIdx, 'category', details.value)}
              placeholder="e.g. Frontend Development, Databases, Cloud"
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

          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-400">
              Skills (press Enter or comma to add tags)
            </FieldLabel>
            <TagsInput
              value={items}
              onValueChange={(details) => handleSkillItemsChange(skIdx, details.value)}
            >
              <TagsInputControl className="bg-slate-950 border-slate-700/80 min-h-10 px-2 py-1.5 rounded-lg">
                {items.map((item, index) => (
                  <TagsInputItem key={`${item}-${index}`} index={index} value={item}>
                    <TagsInputItemPreview className="bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs px-2 py-0.5 rounded-md">
                      <TagsInputItemText>{item}</TagsInputItemText>
                      <TagsInputItemDeleteTrigger className="text-indigo-400 hover:text-white ml-1 cursor-pointer" />
                    </TagsInputItemPreview>
                    <TagsInputItemInput />
                  </TagsInputItem>
                ))}
                <TagsInputInput
                  placeholder="Add skill tag..."
                  className="text-xs text-slate-100 placeholder:text-slate-500"
                />
                <TagsInputClearTrigger className="text-slate-400 hover:text-white" />
              </TagsInputControl>
            </TagsInput>
          </Field>
        </div>
      )}
    </div>
  );
}
