import { Stack, Badge } from '@sanity/ui';
import type { Ga4EventRow, Ga4EventsSnapshot } from './lib/types';
import { loadGa4Events } from './lib/loadSnapshot';
import { formatNumber } from './lib/formatters';
import { SortableTable, type ColumnDef } from './SortableTable';
import { useSortableData } from './lib/useSortableData';
import { SectionHeader } from './SectionHeader';

const data: Ga4EventsSnapshot = loadGa4Events();

const COLUMNS: ColumnDef<Ga4EventRow>[] = [
  {
    key: 'event',
    label: 'Event',
    align: 'left',
    numeric: false,
    defaultSort: 'asc',
    render: (r) => <code style={{ fontSize: '0.8rem' }}>{r.event}</code>,
    tooltip: 'GA4 event name.',
  },
  {
    key: 'custom',
    label: 'Type',
    align: 'left',
    numeric: false,
    defaultSort: 'desc',
    render: (r) => (
      <Badge tone={r.custom ? 'primary' : 'default'} fontSize={0}>
        {r.custom ? 'Custom' : 'Auto'}
      </Badge>
    ),
    tooltip:
      'Custom = events we wired up (CTA, calculator, FAQ, language). Auto = GA4 enhanced-measurement events that come for free.',
  },
  {
    key: 'count',
    label: 'Count',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.count),
    tooltip: 'Number of times the event fired.',
  },
  {
    key: 'users',
    label: 'Users',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.users),
    tooltip: 'Distinct visitors who triggered the event.',
  },
];

export function SeoGa4Events() {
  const { sortKey, sortDir, sortedRows, toggleSort } = useSortableData(
    data.rows,
    'count',
    COLUMNS,
  );

  return (
    <Stack space={4}>
      <SectionHeader
        title="Events"
        subtitle="What visitors actually do on the site. 'Auto' events come free from GA4; 'Custom' events are the ones we wired up — Get Started clicks, calculator use, FAQ opens, language switches. This is where you see whether the CTAs and tools get used."
        rangeDays={data.meta.rangeDays}
        visibleCount={sortedRows.length}
        totalCount={data.rows.length}
        countNoun="events"
      />
      <SortableTable
        rows={sortedRows}
        columns={COLUMNS}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        rowKey={(r, i) => `${r.event}-${i}`}
      />
    </Stack>
  );
}
