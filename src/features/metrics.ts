import type { DemoState } from '../domain/types';
import { isPaid } from '../domain/rules';
export function contributionMetrics(state:DemoState,month:string='todos') {
 const paid=state.donations.filter(d=>isPaid(d)&&(month==='todos'||(d.paidAt??d.createdAt).slice(0,7)===month));
 return {paid,total:(currency:'COP'|'USD')=>paid.filter(d=>d.currency===currency).reduce((sum,d)=>sum+d.amountMinor,0),weeks:[0,1,2,3,4].map(i=>paid.filter(d=>d.currency==='COP'&&Math.floor((new Date(d.paidAt??d.createdAt).getUTCDate()-1)/7)===i).reduce((sum,d)=>sum+d.amountMinor,0)),months:[...new Set(state.donations.filter(isPaid).map(d=>(d.paidAt??d.createdAt).slice(0,7)))].sort().reverse()};
}
