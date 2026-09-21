import React from 'react';
import { 
  Users, 
  Layers,
  Terminal
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { SwitchRoot, SwitchControl, SwitchLabel } from '../ui/switch';
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
} from '../ui/select';
import { useCv, useUI } from '../../context/index.jsx';

export default function HeaderCenter() {
  const { isDevMode, toggleDevMode } = useUI();
  const { 
    activeVariant, 
    setActiveVariant, 
    variants, 
    groupMembers 
  } = useCv();

  const collaborators = groupMembers ?? [];

  const selectItems = (variants || []).map((v) => ({
    value: v.id,
    label: v.label,
  }));


  return (
    <div className="flex items-center gap-4">
            {/* Mode Switcher Switch (VSCode on active) */}
      <SwitchRoot
        checked={isDevMode}
        onCheckedChange={(details) => {
          if (details.checked) {
            toggleDevMode(true);
          } else {
            toggleDevMode(false);
          }
        }}
        className="flex items-center gap-2 cursor-pointer"
        title="Comutare mod vizualizare"
      >
        <SwitchControl />
        <SwitchLabel className="text-xs font-semibold flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">

              <Terminal className="size-3.5 text-purple-400" />
              <span>VSCode</span>

        </SwitchLabel>
      </SwitchRoot>

      {/* Dynamic Tailoring Profile Select */}
      <Select
        items={selectItems}
        value={activeVariant ? [activeVariant] : []}
        onValueChange={(details) => {
          if (details?.value?.[0]) {
            setActiveVariant(details.value[0]);
          }
        }}
        positioning={{ placement: "bottom-start", sameWidth: false }}
      >
        <SelectControl className="w-auto">
          <SelectTrigger className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 outline-none cursor-pointer hover:bg-slate-700/80 transition-colors">
            <Layers className="size-3.5 text-blue-400 shrink-0" />
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Profile:</span>
            <SelectValue placeholder="Select" />
            <SelectIndicator />
          </SelectTrigger>
        </SelectControl>
        <SelectPopup className="min-w-[220px]">
          <SelectList>
            {selectItems.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectList>
        </SelectPopup>
      </Select>

      {/* Real-time Collaborators stack */}
      <div className="flex items-center gap-2 pl-1" title="Live Collaboration Room">
        {/*<div className="flex items-center -space-x-2">
          {collaborators.map(collab => (
            <img 
              key={collab.id} 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name.split(' ')[0]}`}
              alt={collab.name}
              className="h-7 w-7 rounded-full border-2 border-slate-900 object-cover"
              title={`${collab.name} - ${collab.status}`}
            />
          ))}
        </div>*/}
        <Badge variant="purple" className="text-[10px] py-0 px-1.5 gap-1 font-semibold">
          <Users className="size-2.5" /> {collaborators.length + 1} Online
        </Badge>
      </div>

    </div>
  );
}
