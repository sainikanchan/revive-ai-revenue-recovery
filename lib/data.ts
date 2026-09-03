export type RecoveryCase={id:string;customer:string;amount:number;issue:string;reason:string;score:number;status:'At risk'|'Recovered'|'Stopped';channel:string;nextAction:string;lastEvent:string};
export const cases:RecoveryCase[]=[
{id:'RC-1042',customer:'Aarav Mehta',amount:18499,issue:'Payment failed',reason:'Bank timeout',score:91,status:'At risk',channel:'UPI',nextAction:'Retry via UPI after cooldown',lastEvent:'7 min ago'},
{id:'RC-1039',customer:'Neha Shah',amount:7499,issue:'Checkout abandoned',reason:'Price hesitation',score:78,status:'At risk',channel:'Payment Link',nextAction:'Personalised payment link',lastEvent:'31 min ago'},
{id:'RC-1037',customer:'Rohan Patel',amount:24999,issue:'Invoice overdue',reason:'Promise to pay',score:84,status:'At risk',channel:'WhatsApp',nextAction:'Promise-to-pay reminder',lastEvent:'2 hr ago'},
{id:'RC-1031',customer:'Ishita Rao',amount:3999,issue:'Subscription failed',reason:'Insufficient funds',score:69,status:'Recovered',channel:'UPI',nextAction:'No action — recovered',lastEvent:'1 hr ago'},
{id:'RC-1028',customer:'Kabir Jain',amount:11999,issue:'Payment failed',reason:'Issuer decline',score:42,status:'Stopped',channel:'Email',nextAction:'Escalate — retry limit reached',lastEvent:'3 hr ago'}
];
export const stats={atRisk:148720,recoverable:96400,recovered:31250,recoveryRate:32.4};
