import { useState } from 'react';
import styled from 'styled-components';
import {
  Stack,
  Heading,
  Text,
  Badge,
  Flex,
  Container,
  Button,
  Box,
} from '@sanity/ui';
import { SeoOverview } from './SeoOverview';
import { SeoTopQueries } from './SeoTopQueries';
import { SeoTopPages } from './SeoTopPages';
import { SeoStrikingDistance } from './SeoStrikingDistance';
import { SeoByLocale } from './SeoByLocale';
import { SeoCtrOutliers } from './SeoCtrOutliers';
import { SeoGa4Overview } from './SeoGa4Overview';
import { SeoGa4TrafficSources } from './SeoGa4TrafficSources';
import { SeoGa4TopPages } from './SeoGa4TopPages';
import { SeoGa4Events } from './SeoGa4Events';
import { SeoGa4ByLocale } from './SeoGa4ByLocale';
import { SeoCfOverview } from './SeoCfOverview';
import { SeoCfTopPages } from './SeoCfTopPages';
import { SeoCfReferrers } from './SeoCfReferrers';
import { SeoCfCountries } from './SeoCfCountries';
import { downloadFullReportAsJson } from './lib/exportReport';
import { loadOverview, loadGa4Overview, loadCloudflareOverview } from './lib/loadSnapshot';

type View = 'search' | 'behavior' | 'traffic';

// Badge reflects the real state across the three sources: all mock → "Mock data";
// some real → "Mixed"; all real → "Live data". Reads each overview's dataSource.
const GSC_OVERVIEW = loadOverview();
const DATA_SOURCES = [
  GSC_OVERVIEW.meta.dataSource,
  loadGa4Overview().meta.dataSource,
  loadCloudflareOverview().meta.dataSource,
];
const SITE_URL = GSC_OVERVIEW.meta.siteUrl;
const ALL_MOCK = DATA_SOURCES.every((s) => s === 'mock');
const DATA_BADGE = ALL_MOCK
  ? { text: 'Mock data', tone: 'caution' as const }
  : DATA_SOURCES.every((s) => s !== 'mock')
    ? { text: 'Live data', tone: 'positive' as const }
    : { text: 'Mixed: live + mock', tone: 'caution' as const };

const VIEWS: { id: View; label: string }[] = [
  { id: 'search', label: 'Search · Google Search Console' },
  { id: 'behavior', label: 'Behavior · Google Analytics 4' },
  { id: 'traffic', label: 'Traffic · Cloudflare' },
];

// Segmented control for the data-source switch. The Sanity Tab default was too
// flat — inactive tabs looked like plain text, so it wasn't obvious you could
// click them. This sits them in a bordered, tinted pill (so the group clearly
// reads as a "pick one" control), with a brand-tinted active state and a hover
// background on the others. Matches the locale-filter chip language elsewhere.
const ViewTabs = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.3rem;
  border: 1px solid rgba(127, 127, 127, 0.25);
  border-radius: 10px;
  background: rgba(127, 127, 127, 0.06);
`;

const ViewTab = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  white-space: nowrap;
  padding: 0.5rem 0.95rem;
  border-radius: 7px;
  color: ${(p) => (p.$active ? '#6155F1' : 'inherit')};
  background: ${(p) => (p.$active ? 'rgba(97, 85, 241, 0.14)' : 'transparent')};
  opacity: ${(p) => (p.$active ? 1 : 0.72)};
  transition: background-color 0.14s ease, opacity 0.14s ease, color 0.14s ease;
  &:hover {
    opacity: 1;
    background: ${(p) =>
      p.$active ? 'rgba(97, 85, 241, 0.18)' : 'rgba(127, 127, 127, 0.12)'};
  }
  &:focus-visible {
    outline: 2px solid #6155f1;
    outline-offset: 2px;
  }
`;

export function SeoDashboard() {
  // Top-level view switcher: keeps Search (GSC) and Behavior (GA4) on separate
  // screens so neither requires scrolling past the other. Defaults to Search.
  const [view, setView] = useState<View>('search');

  return (
    <Container width={3} paddingX={5} paddingY={5}>
      <Stack space={5}>
        <Stack space={4}>
          <Flex align="center" gap={3} wrap="wrap" justify="space-between">
            <Flex align="center" gap={3} wrap="wrap">
              <Heading as="h1" size={4}>
                SEO Insights
              </Heading>
              <Badge tone={DATA_BADGE.tone} fontSize={1}>
                {DATA_BADGE.text}
              </Badge>
            </Flex>
            <Button
              text="Download report (JSON)"
              mode="ghost"
              tone="primary"
              fontSize={1}
              padding={3}
              onClick={downloadFullReportAsJson}
            />
          </Flex>
          <Text size={1} muted>
            Insights for {SITE_URL} across search and on-site behaviour.{' '}
            {ALL_MOCK
              ? 'The numbers are placeholders until each source is connected — then each view swaps to real data with no code changes. '
              : 'Each view swaps from placeholder to real data automatically as its source connects. '}
            Use <strong>Download report</strong> to export the dataset as JSON.
          </Text>

          <Flex align="center" gap={3} wrap="wrap">
            <Text
              size={0}
              weight="semibold"
              muted
              style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              View
            </Text>
            <ViewTabs role="tablist" aria-label="Dashboard data source">
              {VIEWS.map((v) => (
                <ViewTab
                  key={v.id}
                  type="button"
                  role="tab"
                  id={`seo-tab-${v.id}`}
                  aria-controls={`seo-view-${v.id}`}
                  aria-selected={view === v.id}
                  $active={view === v.id}
                  onClick={() => setView(v.id)}
                >
                  {v.label}
                </ViewTab>
              ))}
            </ViewTabs>
          </Flex>
        </Stack>

        {view === 'search' && (
          <Box
            key="search"
            id="seo-view-search"
            aria-labelledby="seo-tab-search"
            role="tabpanel"
          >
            <Stack space={5}>
              <SeoOverview />
              <SeoTopQueries />
              <SeoTopPages />
              <SeoStrikingDistance />
              <SeoByLocale />
              <SeoCtrOutliers />
            </Stack>
          </Box>
        )}

        {view === 'behavior' && (
          <Box
            key="behavior"
            id="seo-view-behavior"
            aria-labelledby="seo-tab-behavior"
            role="tabpanel"
          >
            <Stack space={5}>
              <SeoGa4Overview />
              <SeoGa4TrafficSources />
              <SeoGa4TopPages />
              <SeoGa4Events />
              <SeoGa4ByLocale />
            </Stack>
          </Box>
        )}

        {view === 'traffic' && (
          <Box
            key="traffic"
            id="seo-view-traffic"
            aria-labelledby="seo-tab-traffic"
            role="tabpanel"
          >
            <Stack space={5}>
              <SeoCfOverview />
              <SeoCfTopPages />
              <SeoCfReferrers />
              <SeoCfCountries />
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
