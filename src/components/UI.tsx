import { ArrowUpRight, Check, ChevronRight, Leaf, X, CircleHelp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { label, money, isPaid } from '../domain/rules';
import { useDemo } from '../features/DemoContext';
import type { Cause } from '../domain/types';
import { CausePhoto } from './CausePhoto';
import { CauseProgress } from './CauseProgress';
export function Brand(){return <Link to="/" className="brand"><span className="brand-mark"><Leaf size={23}/></span><span>Fundación <b>Demo</b><small>Juntos, hacemos posible</small></span></Link>;}
export function Badge({status}:{status:string}){return <span className={`badge badge-${status}`}>{label(status)}</span>;}
export function PageTitle({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}){return <div className="page-title"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>;}
export function Empty({text,link='/donar',cta='Elegir una causa'}:{text:string;link?:string;cta?:string}){return <div className="empty"><CircleHelp size={32}/><h3>{text}</h3><Link className="btn" to={link}>{cta}<ChevronRight size={17}/></Link></div>;}
export function Notice({children}:{children:ReactNode}){return <div className="notice"><CircleHelp size={18}/><span>{children}</span></div>;}
export function Steps({current}:{current:number}){return <ol className="steps">{['Perfil','Verificación','Documento','Pago','Constancia'].map((x,i)=><li key={x} className={i<current?'done':i===current?'current':''}><span>{i<current?<Check size={15}/>:i+1}</span><b>{x}</b></li>)}</ol>;}
export function CauseCard({cause}:{cause:Cause}){return <article className="cause-card"><Link to={`/causas/${cause.slug}`} className="cause-image"><CausePhoto kind={cause.illustration}/><span>{cause.category}</span></Link><div className="cause-body"><h3><Link to={`/causas/${cause.slug}`}>{cause.title}</Link></h3><p>{cause.description}</p><CauseProgress cause={cause} compact/><Link className="card-link" to={`/donar?causa=${cause.id}`}>Aportar a esta causa<ArrowUpRight size={18}/></Link></div></article>;}
export function Toast(){const {toast,clearToast}=useDemo();return toast?<div className="toast" role="status"><span>{toast}</span><button className="icon-button" aria-label="Cerrar aviso" onClick={clearToast}><X size={18}/></button></div>:null;}
