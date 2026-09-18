import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/frontend/components/ui/badge';

export default function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
        <Sparkles className="size-5" />
      </div>
      <div>
        <div className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-snug">
           CV Builder space
        </div>
        <Badge variant="success" className="text-[10px] py-0 px-1.5 gap-1 font-semibold leading-normal">
          <CheckCircle2 className="size-2.5" /> Live Sync Active
        </Badge>
      </div>
    </div>
  );
}
