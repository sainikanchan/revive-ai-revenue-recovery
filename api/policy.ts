export type CaseInput={amount:number;attempts:number;hoursSinceLastAttempt:number;reason:string;customerOptedOut?:boolean;fraudFlag?:boolean};

export function guard(input:CaseInput){
 if(input.customerOptedOut) return {allowed:false,reason:'customer_opted_out'};
 if(input.fraudFlag) return {allowed:false,reason:'risk_escalation'};
 if(input.attempts>=3) return {allowed:false,reason:'retry_limit_reached'};
 if(input.hoursSinceLastAttempt<2) return {allowed:false,reason:'cooldown_active'};
 if(input.amount>=100000) return {allowed:false,reason:'high_value_manual_review'};
 if(['suspected_fraud','chargeback'].includes(input.reason)) return {allowed:false,reason:'risk_escalation'};
 return {allowed:true,reason:'policy_pass'};
}
