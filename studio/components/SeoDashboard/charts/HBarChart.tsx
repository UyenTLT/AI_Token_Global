import { Card, Stack, Text } from '@sanity/ui';
import styled from 'styled-components';
import { formatNumber } from '../lib/formatters';

// Generic horizontal-bar chart. Pure: takes pre-shaped { label, value } items
// and renders them — it has no idea whether the numbers are mock or real, so it
// works unchanged once a loader swaps mock data for real. Same chunky/squared
// bar style as the GSC Top Queries chart, for visual consistency.

export interface BarItem {
  label: string;
  value: number;
  /** Optional per-bar color; defaults to brand purple. */
  color?: string;
}

interface Props {
  title: string;
  items: BarItem[];
  topN?: number;
  /** Formatter for the value shown on the right. Defaults to thousands-separated. */
  format?: (n: number) => string;
}

const BRAND = '#6155F1';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RowGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: baseline;
`;

const Label = styled.span`
  font-size: 0.825rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  font-size: 0.825rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
`;

const BarTrack = styled.div`
  background: rgba(127, 127, 127, 0.08);
  height: 22px;
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  width: ${(p) => p.$width}%;
  height: 100%;
  background: ${(p) => p.$color};
  border-radius: 3px;
  transition: width 0.4s ease;
`;

export function HBarChart({ title, items, topN = 10, format = formatNumber }: Props) {
  const top = [...items].sort((a, b) => b.value - a.value).slice(0, topN);
  const max = top.length === 0 ? 1 : top[0].value;

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={3}>
        <Text
          size={0}
          weight="semibold"
          muted
          style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {title}
        </Text>
        <Wrap>
          {top.map((item, i) => {
            const width = (item.value / max) * 100;
            return (
              <RowGroup key={`${item.label}-${i}`}>
                <Row>
                  <Label title={item.label}>{item.label}</Label>
                  <Count>{format(item.value)}</Count>
                </Row>
                <BarTrack>
                  <BarFill $width={width} $color={item.color ?? BRAND} />
                </BarTrack>
              </RowGroup>
            );
          })}
        </Wrap>
      </Stack>
    </Card>
  );
}
