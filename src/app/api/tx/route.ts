import { NextResponse } from 'next/server';
import { Translate } from '@noves/noves-sdk';

export async function GET() {
  try {
    const evmTranslate = Translate.evm(process.env.NOVES_API_KEY!);
    const txDesc = await evmTranslate.getTransaction("polygon", "0xe2b05d52bece20f940e9e85549663abd7daf7010a004d568dfac4095d871594f");
    
    return NextResponse.json(txDesc);
  } catch (error: unknown) {
    console.error('Transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction details' },
      { status: 400 }
    );
  }
} 