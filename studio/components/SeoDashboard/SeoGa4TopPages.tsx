import { useState, useMemo } from 'react';
import { Stack, Flex, Badge } from '@sanity/ui';
import styled from 'styled-components';
import type { Ga4PageRow, Ga4PagesSnapshot } from './lib/types';
import { loadGa4Pages } from './lib/loadSnapshot';
import { formatNumber, formatDuration } from './lib/formatters';
import {
  LocaleFilter,
  type LocaleFilterValue,
  filterByLocale,
  countByLocale,
} from './LocaleFilter';
import { SortableTable, type ColumnDef } from './SortableTable';
import { useSortableData } from './lib/useSortableData';
import { SectionHeader } from './SectionHeader';

const data: Ga4PagesSnapshot = loadGa4Pages();
const LOCALE_COUNTS = countByLocale(data.rows);

const PathText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.825rem;
  font-weight: 500;
  word-break: break-word;
`;

const COLUMNS: ColumnDef<Ga4PageRow>[] = [
  {
    key: 'page',
    label: 'Page',
    align: 'left',
    numeric: false,
    defaultSort: 'asc',
    render: (r) => <PathText>{r.page}</PathText>,
    tooltip: 'Page path on the site, including the locale segment.',
  },
  {
    key: 'locale',
    label: 'Locale',
    align: 'left',
    numeric: false,
    defaultSort: 'asc',
    render: (r) => (
      <Badge tone="default" fontSize={0}>
        {r.locale.toUpperCase()}
      </Badge>
    ),
    tooltip: 'Language segment of the path (/en, /es, /id).',
  },
  {
    key: 'views',
    label: 'Views',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.views),
    tooltip: 'Number of times this page was viewed.',
  },
  {
    key: 'users',
    label: 'Users',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatNumber(r.users),
    tooltip: 'Distinct visitors who viewed this page.',
  },
  {
    key: 'avgEngagementSeconds',
    label: 'Avg. engagement',
    align: 'right',
    numeric: true,
    defaultSort: 'desc',
    render: (r) => formatDuration(r.avgEngagementSeconds),
    tooltip:
      'Average engaged time on this page — how well the content holds attention.',
  },
];

export function SeoGa4TopPages() {
  const [locale, setLocale] = useState<LocaleFilterValue>('all');
  const filteredRows = useMemo(() => filterByLocale(data.rows, locale), [locale]);
  const { sortKey, sortDir, sortedRows, toggleSort } = useSortableData(
    filteredRows,
    'views',
    COLUMNS,
  );

  return (
    <Stack space={4}>
      <SectionHeader
        title="Top Pages"
        subtitle="Pages ranked by views, with how long visitors actually engage on each. Where Search › Top Pages ranks by search clicks, this ranks by real on-site behaviour — high views but low engagement time means people arrive and leave."
        rangeDays={data.meta.rangeDays}
        visibleCount={sortedRows.length}
        totalCount={data.rows.length}
        countNoun="pages"
      />
      <Flex align="center" gap={3} wrap="wrap">
        <LocaleFilter value={locale} onChange={setLocale} counts={LOCALE_COUNTS} />
      </Flex>
      <SortableTable
        rows={sortedRows}
        columns={COLUMNS}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        rowKey={(r, i) => `${r.page}-${i}`}
        pageSize={10}
      />
    </Stack>
  );
}
