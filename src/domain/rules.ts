import type { DemoState, Donation, VerificationStatus, Scenario, Currency, PaymentMethod } from './types';
import { createSeed, causes } from '../data/seed';
export const isPaid = (d: Donation) => ['pagado','certificado_disponible'].includes(d.status);
export function parseAmountMinor(value:string):number {
 if(!/^\d+(\.\d{1,2})?$/.test(value.trim()))throw Error('Introduce un monto positivo con máximo dos decimales.');
 const [whole,fraction='']=value.trim().split('.');const minor=Number(whole)*100+Number(fraction.padEnd(2,'0'));
 if(!Number.isSafeInteger(minor)||minor<=0||minor>100000000000)throw Error('El monto debe ser mayor que cero y no superar 1.000 millones.');return minor;
}
export const money = (minor:number,currency:Currency='COP') => new Intl.NumberFormat('es-CO',{style:'currency',currency,maximumFractionDigits:currency==='COP'?0:2}).format(minor/100);
export const date = (value:string) => new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeZone:'America/Bogota'}).format(new Date(value));
export const label = (value:string) => ({sin_iniciar:'Sin iniciar',pendiente:'Pendiente',en_revision:'En revisión',aprobado:'Aprobado',observado:'Observado',rechazado:'Rechazado',borrador:'Borrador',esperando_verificacion:'Esperando verificación',esperando_documento:'Esperando documento',esperando_pago:'Listo para pagar',pago_pendiente:'Pago pendiente',pagado:'Pago confirmado',fallido:'Pago fallido',certificado_disponible:'Constancia disponible',generado:'Generado',aceptado_demo:'Aceptado'}[value] ?? value);
export const verificationFor = (s:DemoState,id=s.selectedUserId) => s.verifications.find(v=>v.userId===id)!;
export const donationFor = (s:DemoState) => s.donations.find(d=>d.id===s.activeDonationId && d.donorId===s.selectedUserId);
export function audit(s:DemoState,action:string,id:string,before:string,after:string) { s.audit.unshift({id:crypto.randomUUID(),actor:s.session==='administrador'?'Administrador':'Donante',action,entityId:id,before,after,at:new Date().toISOString()}); }
export function startDonation(s:DemoState,causeId:string,amountMinor:number,currency:Currency,method:PaymentMethod) {
 if(!causes.some(c=>c.id===causeId)||!Number.isSafeInteger(amountMinor)||amountMinor<=0||amountMinor>100000000000) throw Error('Elige una causa y un monto válido (máximo 1.000 millones).');
 const d:Donation={id:`D-${crypto.randomUUID().slice(0,8).toUpperCase()}`,donorId:s.selectedUserId,causeId,amountMinor,currency,method,status:verificationFor(s).status==='aprobado'?'esperando_documento':'esperando_verificacion',createdAt:new Date().toISOString()};
 s.donations.unshift(d);s.activeDonationId=d.id;audit(s,'Intención de aporte creada',d.id,'',d.status);
}
export function submitVerification(s:DemoState) {
 const p=s.profiles.find(p=>p.userId===s.selectedUserId)!;const v=verificationFor(s);
 if(!p.registered||!p.consent) throw Error('Guarda tu perfil y acepta el consentimiento.');
 if(!['sin_iniciar','observado'].includes(v.status)) throw Error('Este caso no admite un nuevo envío.');
 const before=v.status;v.status='pendiente';v.notes='Solicitud recibida. El administrador puede revisarla.';v.signals=['Información del perfil completa','Sin consultas a listas ni proveedores'];v.updatedAt=new Date().toISOString();audit(s,'Verificación enviada',v.id,before,v.status);
}
export function decideVerification(s:DemoState,userId:string,status:VerificationStatus,notes:string) {
 if(s.session!=='administrador') throw Error('Entra como administrador demo para decidir.');
 const v=verificationFor(s,userId);
 if(!['pendiente','en_revision','observado'].includes(v.status)||!['en_revision','aprobado','observado','rechazado'].includes(status)) throw Error('Transición de verificación no permitida.');
 if(['observado','rechazado'].includes(status)&&!notes.trim()) throw Error('Añade una nota para explicar la decisión.');
 const before=v.status;v.status=status;v.notes=notes||'Perfil aprobado.';v.updatedAt=new Date().toISOString();
 if(status==='observado')s.profiles.find(p=>p.userId===userId)!.registered=false;
 s.donations.filter(d=>d.donorId===userId&&!isPaid(d)).forEach(d=>{if(status==='aprobado'&&d.status==='esperando_verificacion')d.status='esperando_documento';});audit(s,'Decisión de verificación',v.id,before,status);
}
export function generateDocument(s:DemoState,id:string,type:'intencion'|'constancia') {
 const d=s.donations.find(d=>d.id===id);if(!d)throw Error('No se encontró la donación.');
 if(type==='intencion'&&(verificationFor(s,d.donorId).status!=='aprobado'||isPaid(d)))throw Error('Requiere verificación aprobada y un aporte sin confirmar.');
 if(type==='constancia'&&!isPaid(d))throw Error('La constancia requiere un pago confirmado.');
 let doc=s.documents.find(x=>x.donationId===id&&x.type===type);
 if(!doc){doc={id:crypto.randomUUID(),donationId:id,type,status:'generado',reference:`DEMO-${type==='intencion'?'I':'C'}-${id}`,generatedAt:new Date().toISOString()};s.documents.unshift(doc);audit(s,'Documento generado',id,'',type);}
 if(type==='constancia')d.status='certificado_disponible';return doc;
}
export function acceptDocument(s:DemoState,id:string) {
 const d=s.donations.find(d=>d.id===id)!;const doc=s.documents.find(x=>x.donationId===id&&x.type==='intencion');
 if(!d||!doc||verificationFor(s,d.donorId).status!=='aprobado'||d.status!=='esperando_documento')throw Error('Genera el documento de un aporte aprobado antes de aceptarlo.');
 doc.status='aceptado_demo';doc.acceptedAt=new Date().toISOString();d.status='esperando_pago';audit(s,'Aceptación visual simulada',id,'generado','aceptado_demo');
}
export function simulatePayment(s:DemoState,id:string,outcome:'pagado'|'pago_pendiente'|'fallido') {
 const d=s.donations.find(d=>d.id===id);
 if(!d||!['esperando_pago','fallido','pago_pendiente'].includes(d.status)||verificationFor(s,d.donorId).status!=='aprobado'||!s.documents.some(x=>x.donationId===id&&x.type==='intencion'&&x.status==='aceptado_demo'))throw Error('El pago requiere verificación aprobada y documento aceptado.');
 if(d.status==='pago_pendiente'&&s.session!=='administrador')throw Error('El administrador debe resolver el pago pendiente.');
 const before=d.status;d.status=outcome;if(outcome==='pagado')d.paidAt=new Date().toISOString();audit(s,'Resultado de pago simulado',id,before,outcome);
}
export function applyScenario(s:DemoState,scenario:Scenario) {
 const fresh=createSeed();Object.assign(s,fresh);s.session='administrador';
 if(scenario==='nuevo')return;
 const p=s.profiles[0];p.registered=true;p.consent=true;p.country='Colombia';
 const v=verificationFor(s);v.status=scenario==='observado'?'observado':scenario==='rechazado'?'rechazado':'aprobado';v.notes=scenario==='observado'?'Confirma el país de tu perfil.':scenario==='rechazado'?'Solicitud no aprobada. Consulta las observaciones.':'Perfil aprobado.';
 if(scenario==='observado')p.registered=false;
 startDonation(s,'educacion',10000000,'COP','Tarjeta simulada');
 if(v.status==='aprobado'&&scenario!=='aprobado'){generateDocument(s,s.activeDonationId!,'intencion');acceptDocument(s,s.activeDonationId!);simulatePayment(s,s.activeDonationId!,scenario==='exito'?'pagado':scenario==='pendiente'?'pago_pendiente':'fallido');if(scenario==='exito')generateDocument(s,s.activeDonationId!,'constancia');}
 audit(s,'Escenario cargado','demo','',scenario);
}
