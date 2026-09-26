import React, {useState} from 'react';
import {
  Globe2,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
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
import { useSortable } from '@dnd-kit/react/sortable';
import {
  Select,
  SelectControl,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator
} from '@/src/components/ui/select';

const proficiencyLevels = [
  { value: 'Native / Bilingual', label: 'Native / Bilingual' },
  { value: 'Full Professional (C1 / C2)', label: 'Full Professional (C1 / C2)' },
  { value: 'Professional Working (B2)', label: 'Professional Working (B2)' },
  { value: 'Limited Working (B1)', label: 'Limited Working (B1)' },
  { value: 'Elementary (A1 / A2)', label: 'Elementary (A1 / A2)' }
];
import { useCv } from '@/src/context/index.jsx';

export default function LanguagesSection() {
  const { cvData, handleUpdateCvData } = useCv();
  const languagesData = cvData?.languages || [];

  const addLanguage = () => {
    const newLang = {
      id: `lang-${Date.now()}`,
      name: "Engleză",
      level: "Full Professional (C1 / C2)"
    };
    handleUpdateCvData(prev => ({
      ...prev,
      languages: [...(prev?.languages || []), newLang]
    }));
  };

  const deleteLanguage = (idx) => {
    handleUpdateCvData(prev => ({
      ...prev,
      languages: (prev?.languages || []).filter((_, i) => i !== idx)
    }));
  };

  const handleLanguageChange = (idx, field, value) => {
    handleUpdateCvData(prev => {
      const list = [...(prev?.languages || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, languages: list };
    });
  };

  const moveItem = (_sectionKey, index, direction) => {
    const targetIdx = index + direction;
    handleUpdateCvData(prev => {
      const list = [...(prev?.languages || [])];
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [removed] = list.splice(index, 1);
      list.splice(targetIdx, 0, removed);
      return { ...prev, languages: list };
    });
  };
  return (
    <AccordionItem value="languages" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <Globe2 className="size-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-100">Languages</span>
          <Badge variant="secondary" className="text-[11px] bg-slate-800 text-slate-300">
            {languagesData.length} items
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <span className="text-xs text-slate-400 italic">Drag handle to reorder or delete</span>
          <Button size="xs" onClick={addLanguage} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
            <Plus className="size-3.5" /> Add
          </Button>
        </div>

        {languagesData.length === 0 ? (
          <Empty className="py-8 bg-slate-900/40 border-slate-800">
            <EmptyMedia variant="icon">
              <Globe2 className="size-4 text-slate-400" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-slate-200">No languages added yet</EmptyTitle>
              <EmptyDescription className="text-slate-400">
                Add the languages you speak and proficiency levels for international opportunities.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="xs" onClick={addLanguage} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                <Plus className="size-3.5" /> Add
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          languagesData.map((lang, langIdx) => (
            <LanguageCard
              key={lang.id || `lang-${langIdx}`}
              lang={lang}
              langIdx={langIdx}
              totalItems={languagesData.length}
              handleLanguageChange={handleLanguageChange}
              deleteLanguage={deleteLanguage}
              moveItem={moveItem}
              proficiencyLevels={proficiencyLevels}
            />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

function LanguageCard({
  lang,
  langIdx,
  totalItems,
  handleLanguageChange,
  deleteLanguage,
  moveItem,
  proficiencyLevels
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sortableId = lang.id || `lang-${langIdx}`;
  const { ref, handleRef, isDragging } = useSortable({
    id: sortableId,
    index: langIdx,
    group: 'languages',
    data: { sectionKey: 'languages', index: langIdx }
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
              disabled={langIdx === 0}
              onClick={() => moveItem('languages', langIdx, -1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={langIdx === totalItems - 1}
              onClick={() => moveItem('languages', langIdx, 1)}
              className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
              title="Move Down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <strong className="text-xs font-semibold truncate">
            {lang.name || 'Language'} — {lang.level || 'Proficiency'}
          </strong>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-4 space-y-5 border-t border-slate-800/80">
          {/* 2-Column Grid with Continuous Vertical Separator */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
            <Field className="md:col-start-1 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Language Name</FieldLabel>
              <Editable
                value={lang.name || ''}
                autoResize
                onValueChange={(details) => handleLanguageChange(langIdx, 'name', details.value)}
                onValueRevert={(details) => handleLanguageChange(langIdx, 'name', details.value)}
                placeholder="e.g. English, German, French"
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

            <Field className="md:col-start-3 md:row-start-1">
              <FieldLabel className="text-xs font-semibold text-slate-400">Proficiency Level</FieldLabel>
              <Select
                items={proficiencyLevels}
                value={lang.level ? [lang.level] : []}
                onValueChange={(details) => handleLanguageChange(langIdx, 'level', details.value[0] || '')}
              >
                <SelectControl>
                  <SelectTrigger className="w-full bg-slate-950 border-slate-700/80 text-xs h-9 justify-between text-slate-200">
                    <SelectValue placeholder="Select proficiency level..." />
                    <SelectIndicator />
                  </SelectTrigger>
                </SelectControl>
                <SelectPopup>
                  <SelectList className="bg-slate-900 border-slate-800 text-slate-200">
                    {proficiencyLevels.map((lvl) => (
                      <SelectItem
                        key={lvl.value}
                        item={lvl}
                        className="text-xs hover:bg-slate-800/80 cursor-pointer data-[state=checked]:text-indigo-400 data-[state=checked]:font-semibold"
                      >
                        <SelectItemText>{lvl.label}</SelectItemText>
                        <SelectItemIndicator />
                      </SelectItem>
                    ))}
                  </SelectList>
                </SelectPopup>
              </Select>
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
