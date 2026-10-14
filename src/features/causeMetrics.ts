import type { Cause, DemoState } from '../domain/types';
import { isPaid } from '../domain/rules';

export function causeMetrics(state: DemoState, cause: Cause) {
  const confirmed = state.donations.filter(d => d.causeId === cause.id && isPaid(d));
  const raised = confirmed.filter(d => d.currency === 'COP').reduce((sum, d) => sum + d.amountMinor, 0);
  const raisedUsd = confirmed.filter(d => d.currency === 'USD').reduce((sum, d) => sum + d.amountMinor, 0);
  const percentage = Math.min(100, raised / cause.goalMinor * 100);
  const donorIds = [...new Set(confirmed.map(d => d.donorId))];
  return { raised, raisedUsd, percentage, remaining: Math.max(0, cause.goalMinor - raised), remainingPercentage: Math.max(0, 100 - percentage), donors: donorIds.length, donorIds };
}
