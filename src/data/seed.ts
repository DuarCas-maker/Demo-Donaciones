import type { Cause, DemoState } from '../domain/types';
import { presentationHistory } from './presentation';
export const DEMO_WARNING = 'DEMOSTRACIÓN SIN VALIDEZ LEGAL / TRIBUTARIA';
export const causes: Cause[] = [
 {id:'educacion',slug:'aprender-para-crecer',title:'Aprender para crecer',category:'Educación',description:'Un lugar para descubrir, imaginar y aprender. Creamos espacios de lectura y acompañamiento para que la infancia descubra nuevas oportunidades.',impact:'Materiales educativos y espacios de aprendizaje comunitario.',goalMinor:1500000000,color:'#d9e7cc',illustration:'education'},
 {id:'alimentacion',slug:'una-mesa-para-todos',title:'Una mesa para todos',category:'Bienestar',description:'La solidaridad empieza con lo esencial. Compartimos alimentos y construimos redes de apoyo entre familias.',impact:'Canastas de alimentos y talleres de nutrición.',goalMinor:1000000000,color:'#f1dfc5',illustration:'food'},
 {id:'naturaleza',slug:'sembrar-el-manana',title:'Sembrar el mañana',category:'Medio ambiente',description:'Cuidar lo que compartimos. Unimos a las comunidades alrededor de huertos y la recuperación de espacios verdes.',impact:'Jornadas comunitarias de siembra y educación ambiental.',goalMinor:800000000,color:'#d2e3db',illustration:'nature'}
];
export function createSeed(): DemoState {
 const at = '2026-10-14T14:00:00.000Z';
 const history = presentationHistory();
 return {version:3,settings:{name:'Fundación Demo',mission:'Conectamos la generosidad con nuevas posibilidades.',contact:'contacto@example.com',presentation:false,sequence:'verificacion_documento_pago'},
 users:[{id:'luna',name:'Luna Restrepo',email:'luna@example.com',role:'donante'},{id:'mateo',name:'Mateo Rojas',email:'mateo@example.com',role:'donante'},{id:'sofia',name:'Sofía Martínez',email:'sofia@example.com',role:'donante'},{id:'admin',name:'Administrador',email:'admin@example.com',role:'administrador'}],
 profiles:[{userId:'luna',country:'',personType:'natural',consent:false,registered:false},{userId:'mateo',country:'Colombia',personType:'natural',consent:true,registered:true},{userId:'sofia',country:'España',personType:'natural',consent:true,registered:true}],
 verifications:[{id:'v-luna',userId:'luna',status:'sin_iniciar',signals:[],notes:'Completa tu perfil para iniciar.',updatedAt:at},...['mateo','sofia'].map(userId=>({id:`v-${userId}`,userId,status:'aprobado' as const,signals:['Información del perfil completa','Consentimiento registrado'],notes:'Perfil completo y aprobado. Puedes continuar con tus aportes.',updatedAt:at}))],
 ...history, audit:[{id:'a-seed',actor:'Sistema',action:'Historial inicial cargado',entityId:'demo',before:'',after:'Datos de presentación',at}],selectedUserId:'luna',activeDonationId:null,session:null};
}
