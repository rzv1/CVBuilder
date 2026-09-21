import React from 'react';
import { User } from 'lucide-react';
import { Textarea } from '@/frontend/components/ui/textarea';
import { AccordionItem, AccordionTrigger, AccordionPanel } from '@/frontend/src/components/ui/accordion';
import { Field, FieldLabel } from '@/frontend/src/components/ui/field';
import { Separator } from '@/frontend/src/components/ui/separator';
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from '@/frontend/src/components/ui/editable';
import { useCv } from '@/frontend/src/context/index.jsx';

export default function PersonalDetailsSection() {
  const { cvData, handleUpdateCvData } = useCv();
  const personalData = cvData?.personal || {};

  const handlePersonalChange = (field, value) => {
    handleUpdateCvData((prev) => ({
      ...prev,
      personal: {
        ...(prev?.personal || {}),
        [field]: value,
      },
    }));
  };
  return (
    <AccordionItem value="personal" className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <AccordionTrigger className="w-full flex items-center justify-between p-4 px-5 text-left hover:bg-slate-800/40 data-[state=open]:bg-slate-800/80 data-[state=open]:border-b data-[state=open]:border-slate-700/60 transition-colors">
        <div className="flex items-center gap-2.5">
          <User className="size-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-100">Personal Details</span>
        </div>
      </AccordionTrigger>

      <AccordionPanel className="p-6 space-y-6 bg-slate-950" containerClassName="p-0">
        {/* 2-Column Grid with Continuous Vertical Separator */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-x-8 gap-y-6 items-start">
          {/* Row 1 */}
          <Field className="md:col-start-1 md:row-start-1">
            <FieldLabel className="text-xs font-semibold text-slate-400">Full Name</FieldLabel>
            <Editable
              value={personalData?.name || ''}
              autoResize
              onValueChange={(details) => handlePersonalChange('name', details.value)}
              onValueRevert={(details) => handlePersonalChange('name', details.value)}
              placeholder="e.g. John Doe"
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

          {/* Continuous Vertical Separator spanning rows 1-3 */}
          <Separator
            orientation="vertical"
            className="hidden md:block md:col-start-2 md:row-start-1 md:row-span-3 bg-slate-800/80 self-stretch my-1"
          />

          <Field className="md:col-start-3 md:row-start-1">
            <FieldLabel className="text-xs font-semibold text-slate-400">Professional Title</FieldLabel>
            <Editable
              value={personalData?.title || ''}
              autoResize
              onValueChange={(details) => handlePersonalChange('title', details.value)}
              onValueRevert={(details) => handlePersonalChange('title', details.value)}
              placeholder="e.g. Senior Full Stack Engineer"
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
            <FieldLabel className="text-xs font-semibold text-slate-400">Email Address</FieldLabel>
            <Editable
              value={personalData?.email || ''}
              autoResize
              onValueChange={(details) => handlePersonalChange('email', details.value)}
              onValueRevert={(details) => handlePersonalChange('email', details.value)}
              placeholder="e.g. john.doe@example.com"
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
            <FieldLabel className="text-xs font-semibold text-slate-400">Phone Number</FieldLabel>
            <Editable
              value={personalData?.phone || ''}
              autoResize
              onValueChange={(details) => handlePersonalChange('phone', details.value)}
              onValueRevert={(details) => handlePersonalChange('phone', details.value)}
              placeholder="e.g. +1 555 123 4567"
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

          {/* Row 3 */}
          <Field className="md:col-start-1 md:row-start-3">
            <FieldLabel className="text-xs font-semibold text-slate-400">Location</FieldLabel>
            <Editable
              value={personalData?.address || personalData?.location || ''}
              autoResize
              onValueChange={(details) => {
                handlePersonalChange('address', details.value);
                handlePersonalChange('location', details.value);
              }}
              onValueRevert={(details) => {
                handlePersonalChange('address', details.value);
                handlePersonalChange('location', details.value);
              }}
              placeholder="e.g. San Francisco, CA"
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

          <Field className="md:col-start-3 md:row-start-3">
            <FieldLabel className="text-xs font-semibold text-slate-400">Website / Portfolio</FieldLabel>
            <Editable
              value={personalData?.website || ''}
              autoResize
              onValueChange={(details) => handlePersonalChange('website', details.value)}
              onValueRevert={(details) => handlePersonalChange('website', details.value)}
              placeholder="e.g. https://johndoe.dev"
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
        </div>

        {/* Professional Summary */}
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-400 mt-6">Professional Summary</FieldLabel>
          <Textarea
            rows={3}
            placeholder="Write a concise overview of your technical experience, domain expertise, and core strengths..."
            value={personalData?.summary || ''}
            onChange={(e) => handlePersonalChange('summary', e.target.value)}
          />
        </Field>
      </AccordionPanel>
    </AccordionItem>
  );
}
