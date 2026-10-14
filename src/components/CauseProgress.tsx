import { Users } from 'lucide-react';
import type { Cause } from '../domain/types';
import { useDemo } from '../features/DemoContext';
import { causeMetrics } from '../features/causeMetrics';
import { money } from '../domain/rules';

const percent = (value: number) => `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(value)}%`;
export function CauseProgress({ cause, compact = false }: { cause: Cause; compact?: boolean }) {
  const { state } = useDemo();
  const metrics = causeMetrics(state, cause);
  return <section className={`cause-funding ${compact ? 'compact' : ''}`} aria-label={`Recaudación de ${cause.title}`}>
    <div className="funding-heading"><span>Juntos vamos avanzando</span><b>{percent(metrics.percentage)} <small>alcanzado</small></b></div>
    <div className="progress" role="progressbar" aria-label="Porcentaje recaudado en COP" aria-valuenow={Number(metrics.percentage.toFixed(1))} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${metrics.percentage}%` }}/></div>
    <div className="funding-numbers"><div><strong>{money(metrics.raised)}</strong><span>recaudados en COP</span></div><div><strong>{money(cause.goalMinor)}</strong><span>meta en COP</span></div></div>
    <div className="funding-remaining">Faltan <b>{money(metrics.remaining)} COP</b> <span>· {percent(metrics.remainingPercentage)}</span></div>
    <div className="funding-supporters"><span className="supporter-dots" aria-hidden="true">{metrics.donorIds.slice(0,3).map(id => <i key={id}>{state.users.find(u => u.id === id)?.name.slice(0,1)}</i>)}</span><span><Users size={15}/><b>{metrics.donors}</b> {metrics.donors === 1 ? 'aportante' : 'aportantes'}</span><small>Ya son parte del cambio</small></div>
    {metrics.raisedUsd > 0 && <p className="funding-usd">Además, {money(metrics.raisedUsd, 'USD')} USD en aportes internacionales. No se convierten a COP.</p>}
  </section>;
}
