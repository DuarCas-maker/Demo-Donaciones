import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { DemoState } from '../domain/types';
import { MockStateRepository } from '../services/mocks';
import { MockNotificationService } from '../services/notifications';
const repo=new MockStateRepository();
interface Context { state:DemoState; act:(fn:(draft:DemoState)=>void,message?:string)=>boolean; toast:string; clearToast:()=>void }
const DemoContext=createContext<Context>(null!);
export function DemoProvider({children}:{children:ReactNode}) {
 const [state,setState]=useState(()=>repo.load());const [toast,setToast]=useState('');
 function act(fn:(draft:DemoState)=>void,message='Cambios guardados en la demo.') {try{const draft=structuredClone(state);fn(draft);repo.save(draft);setState(draft);new MockNotificationService(setToast).notify(message);return true;}catch(error){setToast(error instanceof Error?error.message:'No se pudo completar la acción.');return false;}}
 useEffect(()=>{const handler=(e:StorageEvent)=>{if(e.key==='fundacion-demo-v1')setState(repo.load());};window.addEventListener('storage',handler);return()=>window.removeEventListener('storage',handler);},[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),6000);return()=>clearTimeout(timer);},[toast]);
 return <DemoContext.Provider value={{state,act,toast,clearToast:()=>setToast('')}}>{children}</DemoContext.Provider>;
}
export const useDemo=()=>useContext(DemoContext);
