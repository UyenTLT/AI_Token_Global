import { Flex, Heading, Text } from '@sanity/ui';

// Single header style for every dashboard section. Title on the left,
// small uppercase right-aligned meta on the right (range + optional count).

interface Props {
  title: string;
  rangeDays: number;
  /** Visible row count after filtering (e.g. when locale chip narrows the view). */
  visibleCount?: number;
  /** Total row count before filtering — shown only when different from visibleCount. */
  totalCount?: number;
  /** Noun for the count, e.g. "queries", "pages". */
  countNoun?: string;
}

export function SectionHeader({
  title,
  rangeDays,
  visibleCount,
  totalCount,
  countNoun,
}: Props) {
  const showCount =
    typeof visibleCount === 'number' && typeof totalCount === 'number' && countNoun;
  const countLabel = showCount
    ? visibleCount === totalCount
      ? `${totalCount} ${countNoun}`
      : `${visibleCount} of ${totalCount} ${countNoun}`
    : null;

  return (
    <Flex align="baseline" justify="space-between" gap={3} wrap="wrap">
      <Heading as="h2" size={2}>
        {title}
      </Heading>
      <Text
        size={0}
        weight="semibold"
        muted
        style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Last {rangeDays} days{countLabel ? ` · ${countLabel}` : ''}
      </Text>
    </Flex>
  );
}
