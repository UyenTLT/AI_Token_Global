import styled from 'styled-components';

// Reusable locale filter chip strip used by every section that shows
// per-row locale data (Top Queries, Top Pages, Striking Distance, CTR Outliers).
//
// Why this lives in a shared component:
//   - Same UI on every table → consistency for the user
//   - One place to add a new locale when the site expands beyond en/es/id
//   - Filter logic (filterByLocale) is colocated with the UI so behaviour
//     never drifts between sections

export type LocaleFilterValue = 'all' | 'en' | 'es' | 'id';

const OPTIONS: Array<{ value: LocaleFilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
  { value: 'id', label: 'ID' },
];

interface Props {
  value: LocaleFilterValue;
  onChange: (next: LocaleFilterValue) => void;
  /** Optional per-locale row counts shown as small numbers next to each chip. */
  counts?: Partial<Record<Exclude<LocaleFilterValue, 'all'>, number>> & { all?: number };
}

const HAIRLINE = 'rgba(127, 127, 127, 0.25)';
const ACTIVE_BG = 'rgba(127, 127, 127, 0.14)';

const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid ${HAIRLINE};
  border-radius: 999px;
`;

const Chip = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  background: ${(p) => (p.$active ? ACTIVE_BG : 'transparent')};
  color: inherit;
  font: inherit;
  font-size: 0.78rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  opacity: ${(p) => (p.$active ? 1 : 0.72)};
  transition: opacity 0.12s ease, background-color 0.12s ease;
  &:hover { opacity: 1; }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const Count = styled.span`
  margin-left: 0.4rem;
  font-size: 0.7rem;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
`;

export function LocaleFilter({ value, onChange, counts }: Props) {
  return (
    <Wrap role="group" aria-label="Filter by locale">
      {OPTIONS.map((opt) => {
        const count = counts ? counts[opt.value] : undefined;
        return (
          <Chip
            key={opt.value}
            type="button"
            $active={value === opt.value}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {typeof count === 'number' ? <Count>{count}</Count> : null}
          </Chip>
        );
      })}
    </Wrap>
  );
}

/**
 * Filter helper used by every section that has a `locale` field on its rows.
 * Generic so it works for QueryRow, PageRow, etc. without TS contortions.
 */
export function filterByLocale<T extends { locale: 'en' | 'es' | 'id' }>(
  rows: T[],
  value: LocaleFilterValue,
): T[] {
  if (value === 'all') return rows;
  return rows.filter((r) => r.locale === value);
}

/** Helper to compute the per-locale counts the chips display. */
export function countByLocale<T extends { locale: 'en' | 'es' | 'id' }>(
  rows: T[],
): Required<NonNullable<Props['counts']>> {
  const out = { all: rows.length, en: 0, es: 0, id: 0 };
  for (const r of rows) out[r.locale]++;
  return out;
}
