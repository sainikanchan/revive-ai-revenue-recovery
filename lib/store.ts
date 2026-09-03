import fs from 'node:fs/promises';
import path from 'node:path';

export type StoredCase = {
  id:string; customer:string; amount:number; currency:string; issue:string; reason:string; score:number;
  status:'At risk'|'Recovered'|'Stopped'; channel:string; nextAction:string; lastEvent:string;
  recoveryProbability:number; expectedRecovery:number; recoveredAmount:number;
  razorpayPaymentLinkId?:string|null; razorpayReferenceId?:string|null; recoveredAt?:string|null;
};
export type StoredPayment = {id:string;caseId:string;paymentLinkId?:string|null;razorpayPaymentId?:string|null;amount:number;status:string;idempotencyKey:string;rawPayload?:string;capturedAt?:string;createdAt:string};
export type StoredAudit = {id:string;caseId?:string|null;eventType:string;actor:string;status:string;detail:string;externalId?:string|null;idempotencyKey?:string;payload?:unknown;createdAt:string};
export type Store = {cases:StoredCase[];payments:StoredPayment[];audits:StoredAudit[]};

const file = path.join(process.cwd(),'data','revive-db.json');
let queue:Promise<unknown>=Promise.resolve();

const seed:StoredCase[]=[
{id:'RC-1042',customer:'Aarav Mehta',amount:18499,currency:'INR',issue:'Payment failed',reason:'Bank timeout',score:91,status:'At risk',channel:'UPI',nextAction:'Retry via UPI after cooldown',lastEvent:'7 min ago',recoveryProbability:.91,expectedRecovery:16834,recoveredAmount:0},
{id:'RC-1039',customer:'Neha Shah',amount:7499,currency:'INR',issue:'Checkout abandoned',reason:'Price hesitation',score:78,status:'At risk',channel:'Payment Link',nextAction:'Personalised payment link',lastEvent:'31 min ago',recoveryProbability:.78,expectedRecovery:5849,recoveredAmount:0},
{id:'RC-1037',customer:'Rohan Patel',amount:24999,currency:'INR',issue:'Invoice overdue',reason:'Promise to pay',score:84,status:'At risk',channel:'WhatsApp',nextAction:'Promise-to-pay reminder',lastEvent:'2 hr ago',recoveryProbability:.84,expectedRecovery:20999,recoveredAmount:0},
{id:'RC-1031',customer:'Ishita Rao',amount:3999,currency:'INR',issue:'Subscription failed',reason:'Insufficient funds',score:69,status:'Recovered',channel:'UPI',nextAction:'No action — recovered',lastEvent:'1 hr ago',recoveryProbability:.69,expectedRecovery:2759,recoveredAmount:3999,recoveredAt:new Date(Date.now()-3600000).toISOString()},
{id:'RC-1028',customer:'Kabir Jain',amount:11999,currency:'INR',issue:'Payment failed',reason:'Issuer decline',score:42,status:'Stopped',channel:'Email',nextAction:'Escalate — retry limit reached',lastEvent:'3 hr ago',recoveryProbability:.42,expectedRecovery:5040,recoveredAmount:0}
];

async function read():Promise<Store>{try{return JSON.parse(await fs.readFile(file,'utf8'));}catch{return {cases:structuredClone(seed),payments:[],audits:[]};}}
async function write(data:Store){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(data,null,2),'utf8');}
export async function withStore<T>(fn:(s:Store)=>Promise<T>|T):Promise<T>{const run=queue.then(async()=>{const s=await read();const result=await fn(s);await write(s);return result;});queue=run.catch(()=>undefined);return run;}
export async function getStore(){return read();}
export async function resetStore(){return withStore(s=>{s.cases=structuredClone(seed);s.payments=[];s.audits=[];});}
