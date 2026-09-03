import { NextResponse } from 'next/server';
import { razorpayConfigured } from '../../../../api/razorpay';
export async function GET() {
  return NextResponse.json({ configured: razorpayConfigured(), mode: 'test' });
}
