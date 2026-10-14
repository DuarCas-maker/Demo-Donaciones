export type Currency = 'COP' | 'USD';
export type VerificationStatus = 'sin_iniciar' | 'pendiente' | 'en_revision' | 'aprobado' | 'observado' | 'rechazado';
export type DonationStatus = 'borrador' | 'esperando_verificacion' | 'esperando_documento' | 'esperando_pago' | 'pago_pendiente' | 'pagado' | 'fallido' | 'certificado_disponible';
export type PaymentMethod = 'Tarjeta simulada' | 'PSE simulado' | 'Transferencia simulada';
export interface FoundationSettings { name: string; mission: string; contact: string; presentation: boolean; sequence: 'verificacion_documento_pago' }
export interface Cause { id: string; slug: string; title: string; category: string; description: string; impact: string; goalMinor: number; color: string; illustration: 'education' | 'food' | 'nature' }
export interface DemoUser { id: string; name: string; email: string; role: 'donante' | 'administrador' }
export interface DonorProfile { userId: string; country: string; personType: 'natural' | 'juridica'; consent: boolean; registered: boolean }
export interface VerificationCase { id: string; userId: string; status: VerificationStatus; signals: string[]; notes: string; updatedAt: string }
export interface Donation { id: string; donorId: string; causeId: string; amountMinor: number; currency: Currency; method: PaymentMethod; status: DonationStatus; createdAt: string; paidAt?: string }
export interface DonationDocument { id: string; donationId: string; type: 'intencion' | 'constancia'; status: 'generado' | 'aceptado_demo'; reference: string; generatedAt: string; acceptedAt?: string }
export interface AuditEvent { id: string; actor: string; action: string; entityId: string; before: string; after: string; at: string }
export interface DemoState { version: 1 | 2 | 3; settings: FoundationSettings; users: DemoUser[]; profiles: DonorProfile[]; verifications: VerificationCase[]; donations: Donation[]; documents: DonationDocument[]; audit: AuditEvent[]; selectedUserId: string; activeDonationId: string | null; session: 'donante' | 'administrador' | null }
export type Scenario = 'nuevo' | 'aprobado' | 'observado' | 'rechazado' | 'pendiente' | 'fallido' | 'exito';
