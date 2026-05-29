// Render-only sortable table for the SEO dashboard.
//
// State (sort key, sort direction, locale filter) is owned by the SECTION
// component so it can drive its own header counts. This component is
// "controlled" — it receives pre-sorted rows + sort state + a sort callback
// and just renders.
//
// One source of truth for table styling (hairline, hover, header) so every
// section looks identical without each one re-importing the same styles.

import type { ReactNode } from 'react';
import { Card } from '@sanity/ui';
import styled from 'styled-components';

export type Align = 'left' | 'right';
export type SortDir = 'asc' | 'desc';

export interface ColumnDef<T> {
  /** Property name on the row used both as the sort key and the React key. */
  key: keyof T & string;
  /** Header label, rendered as-is. */
  label: string;
  align: Align;
  /** True if the column's values should render with tabular-nums alignment. */
  numeric: boolean;
  /** First-click direction when this column is freshly selected for sort. */
  defaultSort: SortDir;
  /** Cell renderer. Defaults to String(row[key]) if not provided. */
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  sortKey: string;
  sortDir: SortDir;
  onSort: (col: ColumnDef<T>) => void;
  rowKey: (row: T, index: number) => string;
}

// Semi-transparent grays — read OK in both light and dark Studio themes.
const HAIRLINE = 'rgba(127, 127, 127, 0.18)';
const ROW_HOVER = 'rgba(127, 127, 127, 0.07)';

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
`;

const HeaderCell = styled.th<{ $align: Align; $active: boolean }>`
  padding: 0.8rem 1rem;
  text-align: ${(p) => p.$align};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: ${(p) => (p.$active ? 1 : 0.65)};
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid ${HAIRLINE};
  transition: opacity 0.12s ease;
  &:hover { opacity: 1; }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
    opacity: 1;
  }
`;

const BodyRow = styled.tr`
  transition: background-color 0.12s ease;
  &:hover { background-color: ${ROW_HOVER}; }
`;

const BodyCell = styled.td<{ $align: Align; $numeric: boolean }>`
  padding: 0.625rem 1rem;
  text-align: ${(p) => p.$align};
  font-size: 0.875rem;
  font-variant-numeric: ${(p) => (p.$numeric ? 'tabular-nums' : 'normal')};
  border-bottom: 1px solid ${HAIRLINE};
  vertical-align: middle;
`;

function indicator(active: boolean, sortDir: SortDir): string {
  if (!active) return '';
  return sortDir === 'desc' ? ' ↓' : ' ↑';
}

export function SortableTable<T>({
  rows,
  columns,
  sortKey,
  sortDir,
  onSort,
  rowKey,
}: Props<T>) {
  return (
    <Card padding={0} radius={3} shadow={1} style={{ overflow: 'hidden' }}>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sortKey === col.key;
                const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
                return (
                  <HeaderCell
                    key={col.key}
                    $align={col.align}
                    $active={active}
                    onClick={() => onSort(col)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSort(col);
                      }
                    }}
                    tabIndex={0}
                    role="columnheader"
                    aria-sort={ariaSort}
                    scope="col"
                  >
                    {col.label}
                    {indicator(active, sortDir)}
                  </HeaderCell>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <BodyRow key={rowKey(row, i)}>
                {columns.map((col) => (
                  <BodyCell key={col.key} $align={col.align} $numeric={col.numeric}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </BodyCell>
                ))}
              </BodyRow>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Card>
  );
}
