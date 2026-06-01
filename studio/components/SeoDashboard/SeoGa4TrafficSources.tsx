import { Stack } from '@sanity/ui';
import type { Ga4ChannelRow, Ga4ChannelsSnapshot } from './lib/types';
import { loadGa4Channels } from './lib/loadSnapshot';
import { formatNumber, formatPercent, formatDuration } from './lib/formatters';
import { SortableTable, type ColumnDef } from './SortableTable';
import { useSortableData } from './lib/useSortableData';
import { SectionHeader } from './SectionHeader';
import { ShareDonut } from './charts/ShareDonut';

const data: Ga4ChannelsSnapshot = loadGa4Channels();

const COLUMNS: ColumnDef<Ga4ChannelRow>[] = [
  {
    key: 'channel',
    label: 'Channel',
    align: 'left',
    numeric: false,
    defaultSort: 'asc',
    tooltip:
      'How the visitor arrived, grouped by GA4: Organic Search, Direct, Referral, Organic Social, Email, Paid Search.',
  },
  {
    key: 'users',
    label: 'Users',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.users),
    tooltip: 'Distinct visitors from this channel.',
  },
  {
    key: 'sessions',
    label: 'Sessions',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.sessions),
    tooltip: 'Visits from this channel.',
  },
  {
    key: 'engagementRate',
    label: 'Engagement rate',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatPercent(r.engagementRate, 1),
    tooltip: 'Engaged sessions ÷ total sessions for this channel.',
  },
  {
    key: 'avgEngagementSeconds',
    label: 'Avg. engagement',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatDuration(r.avgEngagementSeconds),
    tooltip: 'Average engaged time per session from this channel.',
  },
];

export function SeoGa4TrafficSources() {
  const { sortKey, sortDir, sortedRows, toggleSort } = useSortableData(
    data.rows,
    'users',
    COLUMNS,
  );

  return (
    <Stack space={4}>
      <SectionHeader
        title="Traffic Sources"
        subtitle="Where visitors come from, grouped into GA4 channels. Search Console only shows Google search — this shows the full picture: direct, referral, and social too. The engagement columns tell you which channels bring visitors who actually stick around."
        rangeDays={data.meta.rangeDays}
        visibleCount={sortedRows.length}
        totalCount={data.rows.length}
        countNoun="channels"
      />
      <ShareDonut
        ariaLabel="User share by channel"
        centerLabel="Users"
        items={data.rows.map((r) => ({ label: r.channel, value: r.users }))}
      />
      <SortableTable
        rows={sortedRows}
        columns={COLUMNS}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        rowKey={(r, i) => `${r.channel}-${i}`}
      />
    </Stack>
  );
}
