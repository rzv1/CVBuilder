import React from 'react';
import {
  FolderPlus,
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

export default function CustomSections({
  activeSection,
  toggleSection,
  customSectionsList = [],
  isMaxCustomSectionsReached,
  addCustomSection,
  deleteCustomSection,
  addCustomSectionItem,
  deleteCustomSectionItem,
  handleCustomItemChange,
  setCvData,
  draggedItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  moveItem
}) {
  return (
    <>
      {customSectionsList.map((sec, secIdx) => {
        const customSecKey = `custom-${sec.id}`;
        const isOpen = activeSection === customSecKey;

        return (
          <div key={sec.id} className="border border-purple-500/30 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
            <button
              type="button"
              className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
                isOpen ? 'bg-purple-950/30 border-b border-purple-500/30' : 'hover:bg-purple-950/20'
              }`}
              onClick={() => toggleSection(customSecKey)}
            >
              <div className="flex items-center gap-2.5">
                <FolderPlus className="size-5 text-purple-400" />
                <span className="text-sm font-bold text-slate-100">{sec.title || `Custom Section ${secIdx + 1}`}</span>
                <Badge variant="purple" className="text-[11px] font-semibold">
                  {(sec.items || []).length} items
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomSection(secIdx);
                  }}
                  title="Delete Custom Section"
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <div className="text-slate-400">
                  {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="p-5 space-y-5 bg-slate-950/60">
                <div className="space-y-1.5 mb-4">
                  <label className="text-xs font-semibold text-slate-300">Section Title (as shown in CV)</label>
                  <Input
                    type="text"
                    className="font-bold text-purple-300 border-purple-500/40 bg-slate-950"
                    value={sec.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCvData(prev => {
                        const secList = [...prev.customSections];
                        secList[secIdx].title = val;
                        return { ...prev, customSections: secList };
                      });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 italic">Drag handle to reorder custom section items</span>
                  <Button size="xs" onClick={() => addCustomSectionItem(secIdx)} className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs">
                    <Plus className="size-3.5" /> Add Item
                  </Button>
                </div>

                {(sec.items || []).map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4 transition-all ${
                      draggedItem?.sectionKey === 'custom' && draggedItem?.customSecIdx === secIdx && draggedItem?.index === itemIdx
                        ? 'opacity-50 ring-2 ring-indigo-500'
                        : ''
                    }`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, 'custom', itemIdx, secIdx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'custom', itemIdx, secIdx)}
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
                            disabled={itemIdx === 0}
                            onClick={() => moveItem('custom', itemIdx, -1, secIdx)}
                            className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            disabled={itemIdx === (sec.items || []).length - 1}
                            onClick={() => moveItem('custom', itemIdx, 1, secIdx)}
                            className="h-6 w-6 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="size-3" />
                          </Button>
                        </div>
                        <strong className="text-xs text-slate-200">{item.heading || 'Item Heading'}</strong>
                      </div>

                      <Button
                        variant="destructive"
                        size="icon-xs"
                        onClick={() => deleteCustomSectionItem(secIdx, itemIdx)}
                        className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                        title="Delete Item"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Heading / Title</label>
                        <Input
                          type="text"
                          placeholder="e.g. React-Fast-Grid / Open Source Project"
                          value={item.heading || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'heading', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Subheading / Role</label>
                        <Input
                          type="text"
                          placeholder="e.g. Lead Developer / Keynote Speaker"
                          value={item.subheading || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'subheading', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Start Date</label>
                        <Input
                          type="text"
                          placeholder="e.g. 2023 / Jan 2024"
                          value={item.start || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'start', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">End Date</label>
                        <Input
                          type="text"
                          placeholder="e.g. Present / Dec 2024"
                          value={item.end || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'end', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Description / Details</label>
                      <Textarea
                        rows={2}
                        placeholder="Detail key accomplishments, technologies used, or impact..."
                        value={item.detail || ''}
                        onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'detail', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* BOTTOM ANCHORED "NEW SECTION" BUTTON */}
      <div className="pt-4 flex flex-col items-center gap-2">
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
    </>
  );
}
