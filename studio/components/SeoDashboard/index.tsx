import { Stack, Heading, Text, Badge, Flex, Container } from '@sanity/ui';
import { SeoOverview } from './SeoOverview';
import { SeoTopQueries } from './SeoTopQueries';
import { SeoTopPages } from './SeoTopPages';
import { SeoStrikingDistance } from './SeoStrikingDistance';
import { SeoByLocale } from './SeoByLocale';
import { SeoCtrOutliers } from './SeoCtrOutliers';

export function SeoDashboard() {
  return (
    <Container width={3} paddingX={5} paddingY={5}>
      <Stack space={5}>
        <Stack space={3}>
          <Flex align="center" gap={3} wrap="wrap">
            <Heading as="h1" size={4}>
              SEO Insights
            </Heading>
            <Badge tone="caution" fontSize={1}>
              Mock data
            </Badge>
          </Flex>
          <Text size={1} muted>
            Search performance dashboard for aitoken.global. Showing mock data while Google
            Search Console setup is pending — see TASK5_PROGRESS.md §1.5 Q1.
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
