import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/button';
import { SegmentGroupRoot, SegmentGroup, Segment } from '../ui/segment-group';
import { Slider, SliderField } from '../ui/slider';
import { Pagination, PaginationPrevTrigger, PaginationNextTrigger, PaginationItems } from '../ui/pagination';

export default function PreviewToolbar({
  previewEngine,
  setPreviewEngine,
  layoutTemplate,
  setLayoutTemplate,
  currentPage,
  setCurrentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  zoomLevel,
  setZoomLevel,
  handleZoomIn,
  handleZoomOut
}) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Layout Template Selector using SegmentGroup */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold">Layout:</span>
          <SegmentGroupRoot
            value={layoutTemplate}
            onValueChange={(details) => {
              if (details?.value) {
                setLayoutTemplate(details.value);
              }
            }}
          >
            <SegmentGroup className="h-7 text-xs bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
              <Segment value="classic" className="h-6 text-xs px-2.5">
                Clasic
              </Segment>
              <Segment value="modern" className="h-6 text-xs px-2.5">
                2 Columns
              </Segment>
            </SegmentGroup>
          </SegmentGroupRoot>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Page Navigation Controls using Ark UI Pagination */}
        <Pagination
          count={totalPages}
          pageSize={1}
          page={currentPage}
          onPageChange={(details) => {
            if (setCurrentPage) {
              setCurrentPage(details.page);
            } else if (details.page > currentPage) {
              handleNextPage();
            } else if (details.page < currentPage) {
              handlePrevPage();
            }
          }}
          className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60"
        >
          <PaginationPrevTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 p-0 text-slate-300 hover:text-white disabled:opacity-40"
              disabled={currentPage === 1}
            >
              ◀
            </Button>
          </PaginationPrevTrigger>

          <PaginationItems size="icon-xs" variant="ghost" />

          <PaginationNextTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 p-0 text-slate-300 hover:text-white disabled:opacity-40"
              disabled={currentPage >= totalPages}
            >
              ▶
            </Button>
          </PaginationNextTrigger>
        </Pagination>

        {/* Zoom Controls using Ark UI Slider */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
          <Button 
            type="button"
            variant="ghost" 
            size="icon-xs" 
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </Button>

          <Slider
            min={60}
            max={130}
            step={5}
            value={zoomLevel}
            onValueChange={(details) => {
              if (setZoomLevel && details?.value?.[0]) {
                setZoomLevel(details.value[0]);
              }
            }}
            className="w-24 sm:w-28"
          >
            <SliderField />
          </Slider>

          <Button 
            type="button"
            variant="ghost" 
            size="icon-xs" 
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </Button>

          <span className="text-xs font-bold text-slate-200 min-w-[38px] text-center select-none">
            {zoomLevel}%
          </span>
        </div>
      </div>
    </div>
  );
}
