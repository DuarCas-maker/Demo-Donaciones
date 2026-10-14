import { jsPDF } from 'jspdf';
import type { DemoState, DonationDocument } from '../domain/types';
import { date, generateDocument, isPaid, money } from '../domain/rules';
import { causes, DEMO_WARNING } from '../data/seed';
import type { DocumentService } from './ports';
export function buildPdf(s:DemoState,doc:DonationDocument):jsPDF {
 const d=s.donations.find(d=>d.id===doc.donationId);if(!d)throw Error('Donación no encontrada.');
 if(doc.type==='constancia'&&!isPaid(d))throw Error('No se puede emitir una constancia sin pago confirmado.');
 const user=s.users.find(u=>u.id===d.donorId)!;const cause=causes.find(c=>c.id===d.causeId)!;
 const pdf=new jsPDF();pdf.setProperties({title:doc.type==='intencion'?'Intención de aporte demo':'Constancia de aporte demo',author:'Fundación Demo',subject:DEMO_WARNING});
 pdf.setFillColor(24,62,54);pdf.rect(0,0,210,55,'F');pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold');pdf.setFontSize(23);pdf.text('Fundación Demo',20,27);pdf.setFontSize(10);pdf.text('DOCUMENTO DE DEMOSTRACIÓN',20,40);
 pdf.setFillColor(247,233,199);pdf.roundedRect(20,65,170,25,3,3,'F');pdf.setTextColor(91,64,22);pdf.setFontSize(10);pdf.text('DEMO - SIN VALIDEZ LEGAL / TRIBUTARIA',28,75);pdf.setFont('helvetica','normal');pdf.text('No acredita una donación real ni una firma electrónica válida.',28,83);
 pdf.setTextColor(24,62,54);pdf.setFontSize(21);pdf.setFont('helvetica','bold');pdf.text(doc.type==='intencion'?'Intención de aporte':'Constancia de aporte simulado',20,110);
 pdf.setFontSize(10);pdf.setFont('helvetica','normal');pdf.setTextColor(85,99,94);pdf.text(doc.reference,20,122);
 const rows=[['Donante ficticio',user.name],['Correo de ejemplo',user.email],['Iniciativa ilustrativa',cause.title],['Monto simulado',`${money(d.amountMinor,d.currency)} ${d.currency}`],['Referencia de aporte',d.id],['Fecha de emisión',date(doc.generatedAt)],['Estado',doc.type==='constancia'?'Pago confirmado en la demo':doc.status==='aceptado_demo'?'Aceptación visual simulada':'Pendiente de aceptación simulada']];
 let y=141;for(const [key,value]of rows){pdf.setFont('helvetica','normal');pdf.setTextColor(100,110,105);pdf.text(key,20,y);pdf.setFont('helvetica','bold');pdf.setTextColor(30,55,46);pdf.text(value,85,y);pdf.setDrawColor(225,232,226);pdf.line(20,y+6,190,y+6);y+=15;}
 pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.setTextColor(80,90,85);const paragraph=doc.type==='intencion'?'Esta intención utiliza información ficticia y expresa únicamente un paso del prototipo. La aceptación visual no constituye una firma jurídica. No se transferirán recursos ni se consultarán proveedores externos.':'Este archivo refleja un resultado simulado en el prototipo local. No es un certificado tributario, recibo de pago real ni documento emitido por una entidad legal verificada.';pdf.text(pdf.splitTextToSize(paragraph,170),20,255);
 pdf.setFontSize(9);pdf.setTextColor(125,135,125);pdf.text('Fundación Demo · Datos ficticios · 1 / 1',20,284);return pdf;
}
export const documents:DocumentService={generate:generateDocument,async download(s,doc){buildPdf(s,doc).save(`${doc.reference}.pdf`);}};
