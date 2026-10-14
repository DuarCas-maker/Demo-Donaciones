import type { DemoState, DemoUser, DonationDocument, DonorProfile, VerificationStatus } from '../domain/types';
// A future Supabase adapter must implement these ports and server-side authorization.
// The current role selector has no authentication or security guarantees.
export interface StateRepository { load(): DemoState; save(state:DemoState): void }
export interface AuthRepository { selectRole(state:DemoState,role:'donante'|'administrador'): void; selectUser(state:DemoState,id:string): void }
export interface DonorRepository { saveProfile(state:DemoState,user:DemoUser,profile:DonorProfile): void }
export interface VerificationProvider { submit(state:DemoState): void; decide(state:DemoState,userId:string,status:VerificationStatus,notes:string): void }
export interface PaymentGateway { pay(state:DemoState,id:string,outcome:'pagado'|'pago_pendiente'|'fallido'): void }
export interface DocumentService { generate(state:DemoState,id:string,type:'intencion'|'constancia'): DonationDocument; download(state:DemoState,doc:DonationDocument): Promise<void> }
export interface NotificationService { notify(message:string): void }
