import {NextResponse} from 'next/server';import {getCase,analyzeCase} from '../../../../lib/recovery';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const{id}=await params;const c=await getCase(id);if(!c)return NextResponse.json({error:'Recovery case not found'},{status:404});return NextResponse.json({case:c,analysis:await analyzeCase(c)});}
