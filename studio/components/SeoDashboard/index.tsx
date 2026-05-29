import { Stack, Heading, Text, Badge, Flex, Container, Button } from '@sanity/ui';
import { SeoOverview } from './SeoOverview';
import { SeoTopQueries } from './SeoTopQueries';
import { SeoTopPages } from './SeoTopPages';
import { SeoStrikingDistance } from './SeoStrikingDistance';
import { SeoByLocale } from './SeoByLocale';
import { SeoCtrOutliers } from './SeoCtrOutliers';
import { downloadFullReportAsJson } from './lib/exportReport';

export function SeoDashboard() {
  return (
    <Container width={3} paddingX={5} paddingY={5}>
      <Stack space={5}>
        <Stack space={3}>
          <Flex align="center" gap={3} wrap="wrap" justify="space-between">
            <Flex align="center" gap={3} wrap="wrap">
              <Heading as="h1" size={4}>
                SEO Insights
              </Heading>
              <Badge tone="caution" fontSize={1}>
                Mock data
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
            Search performance dashboard for aitoken.global. Showing mock data while Google
            Search Console setup is pending — see TASK5_PROGRESS.md §1.5 Q1. Use{' '}
            <strong>Download report</strong> to save the full dataset as JSON for AI tools.
          </Text>
        </Stack>

        <SeoOverview />

        <SeoTopQueries />

        <SeoTopPages />

        <SeoStrikingDistance />

        <SeoByLocale />

        <SeoCtrOutliers />
      </Stack>
    </Container>
  );
}
