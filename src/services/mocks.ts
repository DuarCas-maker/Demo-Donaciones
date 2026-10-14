import type { AuthRepository, DonorRepository, VerificationProvider, PaymentGateway, StateRepository } from './ports';
import { createSeed } from '../data/seed';
import { upgradePresentation } from '../data/presentation';
import { audit, submitVerification, decideVerification, simulatePayment } from '../domain/rules';
import type { DemoState } from '../domain/types';
export const STORAGE_KEY='fundacion-demo-v1';
export class MockStateRepository implements StateRepository {
 load():DemoState {try {const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if([1,2,3].includes(data?.version)&&Array.isArray(data.users)&&Array.isArray(data.donations)&&Array.isArray(data.profiles)&&Array.isArray(data.verifications)&&Array.isArray(data.documents)&&Array.isArray(data.audit)&&data.settings&&data.users.some((u:{id:string})=>u.id===data.selectedUserId)){const upgraded=upgradePresentation(data);localStorage.setItem(STORAGE_KEY,JSON.stringify(upgraded));return upgraded;}}catch{/* Unreadable storage falls back to safe seeds. */}return createSeed();}
 save(s:DemoState){localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}
}
export const auth:AuthRepository={selectRole(s,role){s.session=role;},selectUser(s,id){if(!s.users.some(u=>u.id===id&&u.role==='donante'))throw Error('Perfil no disponible.');s.selectedUserId=id;s.activeDonationId=s.donations.find(d=>d.donorId===id&&!['pagado','certificado_disponible'].includes(d.status))?.id??null;}};
export const donors:DonorRepository={saveProfile(s,user,profile){if(!user.name.trim()||!/^[-a-z0-9._]+@example\.com$/i.test(user.email)||!profile.country.trim()||!profile.consent)throw Error('Completa nombre, correo @example.com, país y consentimiento.');s.users=s.users.map(u=>u.id===user.id?user:u);s.profiles=s.profiles.map(p=>p.userId===profile.userId?{...profile,registered:true}:p);audit(s,'Perfil guardado',user.id,'','Completo');}};
export const verification:VerificationProvider={submit:submitVerification,decide:decideVerification};
export const payments:PaymentGateway={pay:simulatePayment};
