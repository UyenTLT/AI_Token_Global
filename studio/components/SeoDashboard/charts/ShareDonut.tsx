import { Card } from '@sanity/ui';
import styled from 'styled-components';
import { formatNumber } from '../lib/formatters';
import { EmptyState } from '../EmptyState';

// Generic share-of-total donut. Pure: takes pre-shaped { label, value } items
// and renders a donut + legend — mock vs real makes no difference, so it works
// unchanged once a loader swaps in real data. Generalized from LocaleDonut so
// any section (channels, locales, …) can show a share breakdown.

export interface DonutSlice {
  label: string;
  value: number;
  /** Optional small suffix after the label in the legend, e.g. "/en". */
  sublabel?: string;
  /** Optional explicit color; otherwise assigned from the palette by order. */
  color?: string;
}

interface Props {
  ariaLabel: string;
  items: DonutSlice[];
  /** Label shown under the center total, e.g. "Users" or "Visits". */
  centerLabel: string;
}

// Brand-aligned palette. First three match the EN/ES/ID locale colors used
// elsewhere, so locale donuts come out consistent without passing colors.
const PALETTE = ['#6155F1', '#3E81E5', '#0ABFBC', '#F59E0B', '#84CC16', '#EC4899', '#06B6D4'];

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1.5rem;
  align-items: center;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const Legend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const LegendRow = styled.li`
  display: grid;
  grid-template-columns: 12px 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
`;

const Swatch = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${(p) => p.$color};
`;

const LegendLabel = styled.span`
  font-weight: 500;
`;

const LegendValue = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
`;

const LegendPercent = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
`;

const CenterText = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.55;
`;

const CenterValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  margin-top: 0.15rem;
`;

const RADIUS = 70;
const STROKE_WIDTH = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ShareDonut({ ariaLabel, items, centerLabel }: Props) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  if (total === 0) return <EmptyState message={`No ${centerLabel.toLowerCase()} in this period yet.`} />;
  let cumulative = 0;
  const segments = items.map((it, i) => {
    const fraction = total === 0 ? 0 : it.value / total;
    const start = cumulative;
    cumulative += fraction;
    return {
      label: it.label,
      sublabel: it.sublabel,
      value: it.value,
      fraction,
      start,
      color: it.color ?? PALETTE[i % PALETTE.length],
    };
  });

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Wrap>
        <svg viewBox="0 0 200 200" width="180" height="180" role="img" aria-label={ariaLabel}>
          <circle
            cx={100}
            cy={100}
            r={RADIUS}
            fill="none"
            stroke="rgba(127,127,127,0.12)"
            strokeWidth={STROKE_WIDTH}
          />
          {segments.map((seg, i) => {
            if (seg.fraction === 0) return null;
            return (
              <circle
                key={`${seg.label}-${i}`}
                cx={100}
                cy={100}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${seg.fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={-seg.start * CIRCUMFERENCE}
                transform="rotate(-90 100 100)"
                strokeLinecap="butt"
              />
            );
          })}
          <foreignObject x="50" y="74" width="100" height="52">
            <div style={{ textAlign: 'center' }}>
              <CenterText>{centerLabel}</CenterText>
              <CenterValue>{formatNumber(total)}</CenterValue>
            </div>
          </foreignObject>
        </svg>

        <Legend>
          {segments.map((seg, i) => (
            <LegendRow key={`${seg.label}-legend-${i}`}>
              <Swatch $color={seg.color} />
              <LegendLabel>
                {seg.label}
                {seg.sublabel ? (
                  <span style={{ opacity: 0.55 }}> {seg.sublabel}</span>
                ) : null}
              </LegendLabel>
              <LegendValue>{formatNumber(seg.value)}</LegendValue>
              <LegendPercent>{(seg.fraction * 100).toFixed(1)}%</LegendPercent>
            </LegendRow>
          ))}
        </Legend>
      </Wrap>
    </Card>
  );
}
