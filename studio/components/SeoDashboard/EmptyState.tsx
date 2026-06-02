import { Card, Flex, Text } from '@sanity/ui';

// Shared "no data yet" placeholder. Used by charts/sections that legitimately
// have nothing to show with real data (e.g. a brand-new property with no traffic
// in the window, or GSC striking-distance when nothing ranks on page 2 yet).
// Without this, empty tables/charts render as bare chrome and look broken.

export function EmptyState({ message }: { message: string }) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Flex align="center" justify="center" style={{ minHeight: 88 }}>
        <Text size={1} muted style={{ textAlign: 'center', maxWidth: 360 }}>
          {message}
        </Text>
      </Flex>
    </Card>
  );
}
