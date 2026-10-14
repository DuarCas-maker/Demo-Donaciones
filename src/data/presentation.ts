import type { DemoState, Donation, DonationDocument } from '../domain/types';

export const profileNames = { luna: 'Luna Restrepo', mateo: 'Mateo Rojas', sofia: 'Sofía Martínez', admin: 'Administrador' };

export function presentationHistory(): { donations: Donation[]; documents: DonationDocument[] } {
  const records: [string, string, string, number, 'COP' | 'USD', string][] = [
    ['D-1001', 'mateo', 'educacion', 250000, 'COP', '2026-10-02'],
    ['D-1002', 'sofia', 'alimentacion', 150, 'USD', '2026-10-06'],
    ['D-1003', 'mateo', 'naturaleza', 100000, 'COP', '2026-10-11'],
    ['D-1004', 'mateo', 'educacion', 1800000, 'COP', '2026-09-18'],
    ['D-1005', 'mateo', 'alimentacion', 950000, 'COP', '2026-09-25'],
    ['D-1006', 'mateo', 'naturaleza', 1200000, 'COP', '2026-10-08'],
    ['D-1007', 'mateo', 'educacion', 600000, 'COP', '2026-10-13'],
    ['D-1008', 'sofia', 'educacion', 1250000, 'COP', '2026-09-20'],
    ['D-1009', 'sofia', 'alimentacion', 900000, 'COP', '2026-10-03'],
    ['D-1010', 'sofia', 'naturaleza', 650000, 'COP', '2026-10-09'],
    ['D-1011', 'sofia', 'educacion', 450000, 'COP', '2026-10-12'],
    ['D-1012', 'sofia', 'alimentacion', 250000, 'COP', '2026-09-29'],
  ];
  const donations: Donation[] = records.map(([id, donorId, causeId, amount, currency, day], i): Donation => ({
    id, donorId, causeId, amountMinor: amount * 100, currency,
    method: currency === 'USD' ? 'Tarjeta simulada' : i % 2 ? 'PSE simulado' : 'Transferencia simulada',
    status: 'certificado_disponible', createdAt: `${day}T14:00:00.000Z`, paidAt: `${day}T15:00:00.000Z`,
  })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const documents: DonationDocument[] = donations.flatMap(d => [
    { id: `intencion-${d.id}`, donationId: d.id, type: 'intencion', status: 'aceptado_demo', reference: `DEMO-I-${d.id}`, generatedAt: d.createdAt, acceptedAt: d.createdAt },
    { id: `constancia-${d.id}`, donationId: d.id, type: 'constancia', status: 'generado', reference: `DEMO-C-${d.id}`, generatedAt: d.paidAt! },
  ]);
  return { donations, documents };
}

// Upgrade earlier presentations and keep Luna empty, as requested.
export function upgradePresentation(state: DemoState): DemoState {
  if (state.version === 3) return state;
  const history = presentationHistory();
  state.version = 3;
  const lunaDonations = new Set(state.donations.filter(d => d.donorId === 'luna').map(d => d.id));
  state.donations = state.donations.filter(d => d.donorId !== 'luna');
  state.documents = state.documents.filter(d => !lunaDonations.has(d.donationId));
  state.audit = state.audit.filter(a => a.entityId !== 'luna' && a.entityId !== 'v-luna' && !lunaDonations.has(a.entityId));
  if (state.selectedUserId === 'luna') state.activeDonationId = null;
  const lunaProfile = state.profiles.find(p => p.userId === 'luna');
  if (lunaProfile) { lunaProfile.country = ''; lunaProfile.consent = false; lunaProfile.registered = false; }
  const lunaVerification = state.verifications.find(v => v.userId === 'luna');
  if (lunaVerification) { lunaVerification.status = 'sin_iniciar'; lunaVerification.signals = []; lunaVerification.notes = 'Completa tu perfil para iniciar.'; }
  for (const user of state.users) {
    if (/Ejemplo|Ilustrativo|Ficticia|Demo/.test(user.name)) user.name = profileNames[user.id as keyof typeof profileNames] ?? user.name;
  }
  for (const id of ['mateo', 'sofia']) {
    const profile = state.profiles.find(p => p.userId === id);
    if (profile) { profile.registered = true; profile.consent = true; }
    const verification = state.verifications.find(v => v.userId === id);
    if (verification) { verification.status = 'aprobado'; verification.notes = 'Perfil completo y aprobado. Puedes continuar con tus aportes.'; verification.signals = ['Información del perfil completa', 'Consentimiento registrado']; }
  }
  for (const donation of history.donations) if (!state.donations.some(d => d.id === donation.id)) state.donations.push(donation);
  for (const doc of history.documents) {
    const donation = state.donations.find(d => d.id === doc.donationId);
    if (donation && ['pagado', 'certificado_disponible'].includes(donation.status) && !state.documents.some(d => d.donationId === doc.donationId && d.type === doc.type)) state.documents.push(doc);
  }
  state.donations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return state;
}
