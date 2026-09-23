// Single source of truth for which sections can be reordered.
// Order here = default order for any resume that has no saved `sectionOrder` yet.
// Header and Summary are intentionally NOT listed: the paginator treats them as
// page-1-only blocks that live outside <main>.
export const SECTION_LABELS = {
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  certificates: 'Certifications',
  languages: 'Languages',
  hobbies: 'Hobbies',
  references: 'References',
};

export const DEFAULT_SECTION_ORDER = Object.keys(SECTION_LABELS);

/**
 * Always returns a complete, valid order:
 *  - no saved order (older resumes)  -> default order
 *  - unknown / duplicate ids         -> dropped
 *  - sections missing from the saved order (e.g. added later) -> appended
 */
export function normalizeSectionOrder(order) {
  const seen = new Set();
  const result = [];

  if (Array.isArray(order)) {
    for (const id of order) {
      if (Object.prototype.hasOwnProperty.call(SECTION_LABELS, id) && !seen.has(id)) {
        seen.add(id);
        result.push(id);
      }
    }
  }

  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) result.push(id);
  }

  return result;
}

/** Immutable move. Returns the same array reference if nothing changed. */
export function moveSection(order, from, to) {
  if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) {
    return order;
  }
  const next = order.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
