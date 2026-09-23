import React, { useState } from 'react';
import { SECTION_LABELS, normalizeSectionOrder, moveSection } from './resumeSections';

/**
 * Controlled editor for the order of resume sections.
 *
 *   <SectionOrderEditor
 *     order={data.sectionOrder}
 *     onChange={(sectionOrder) => setData((prev) => ({ ...prev, sectionOrder }))}
 *   />
 *
 * Drag rows to reorder (mouse), or use the arrow buttons (touch / keyboard).
 * onChange always receives a NEW array, so `data` gets a new identity and
 * PaginatedPreview's useDeferredValue / useEffect pick the change up.
 */
export default function SectionOrderEditor({ order, onChange }) {
  const items = normalizeSectionOrder(order);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const commit = (from, to) => {
    const next = moveSection(items, from, to);
    if (next !== items) onChange(next);
  };

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Resume section order">
      {items.map((id, i) => {
        const label = SECTION_LABELS[id];
        const isDragging = dragIndex === i;
        const isOver = overIndex === i && dragIndex !== null && dragIndex !== i;

        return (
          <li
            key={id}
            draggable
            onDragStart={(e) => {
              setDragIndex(i);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', id); // required by Firefox
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (overIndex !== i) setOverIndex(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) commit(dragIndex, i);
              endDrag();
            }}
            onDragEnd={endDrag}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[13px] font-semibold text-slate-700 select-none transition-colors ${
              isOver ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'
            } ${isDragging ? 'opacity-40' : ''}`}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 cursor-grab text-slate-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="7" cy="5" r="1.5" />
              <circle cx="13" cy="5" r="1.5" />
              <circle cx="7" cy="10" r="1.5" />
              <circle cx="13" cy="10" r="1.5" />
              <circle cx="7" cy="15" r="1.5" />
              <circle cx="13" cy="15" r="1.5" />
            </svg>

            <span className="flex-1 truncate">{label}</span>

            <button
              type="button"
              onClick={() => commit(i, i - 1)}
              disabled={i === 0}
              aria-label={`Move ${label} up`}
              className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5-5 5 5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => commit(i, i + 1)}
              disabled={i === items.length - 1}
              aria-label={`Move ${label} down`}
              className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
