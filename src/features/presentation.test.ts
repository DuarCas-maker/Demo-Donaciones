import { describe, it, expect } from 'vitest';
import { createSeed, causes } from '../data/seed';
import { upgradePresentation } from '../data/presentation';
import { causeMetrics } from './causeMetrics';
import { startDonation } from '../domain/rules';

describe('Datos de presentación y recaudo', () => {
  it('deja Luna sin actividad y completa los otros dos perfiles', () => {
    const state = createSeed();
    expect(state.profiles[0].registered).toBe(false);
    expect(state.donations.filter(d => d.donorId === 'luna')).toHaveLength(0);
    for (const id of ['mateo', 'sofia']) {
      expect(state.verifications.find(v => v.userId === id)?.status).toBe('aprobado');
      const donations = state.donations.filter(d => d.donorId === id);
      expect(donations).toHaveLength(6);
      expect(state.documents.filter(doc => doc.type === 'constancia' && donations.some(d => d.id === doc.donationId))).toHaveLength(6);
    }
  });
  it('calcula recaudación, pendiente y personas únicas con pagos confirmados', () => {
    const state = createSeed();
    const metrics = causeMetrics(state, causes[0]);
    expect(metrics.raised).toBe(435000000);
    expect(metrics.percentage).toBeCloseTo(29);
    expect(metrics.remaining).toBe(1065000000);
    expect(metrics.donors).toBe(2);
    startDonation(state, 'educacion', 10000000, 'COP', 'Tarjeta simulada');
    expect(causeMetrics(state, causes[0])).toEqual(metrics);
    expect(causeMetrics(state, causes[1]).raisedUsd).toBe(15000);
  });
  it('migra datos previos sin duplicados y solo limpia el perfil de inicio', () => {
    const state = createSeed();
    state.version = 1;
    state.users[0].name = 'Luna Ejemplo';
    state.users[1].name = 'Mateo Ilustrativo';
    state.verifications[1].status = 'observado';
    startDonation(state, 'educacion', 10000000, 'COP', 'Tarjeta simulada');
    const migrated = upgradePresentation(state);
    expect(migrated.version).toBe(3);
    expect(migrated.users[0].name).toBe('Luna Restrepo');
    expect(migrated.activeDonationId).toBeNull();
    expect(migrated.donations).toHaveLength(12);
    expect(migrated.verifications[1].status).toBe('aprobado');
    expect(upgradePresentation(migrated).documents).toHaveLength(24);
  });
});
