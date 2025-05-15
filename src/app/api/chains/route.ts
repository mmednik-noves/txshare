import { NextResponse } from 'next/server';
import { Translate } from '@noves/noves-sdk';

export async function GET() {
  try {
    const evmTranslate = Translate.evm(process.env.NOVES_API_KEY!);
    const chains = await evmTranslate.getChains();
    return NextResponse.json(chains);
  } catch (error: unknown) {
    console.error(error);
    // Fallback to basic chains if API call fails
    return NextResponse.json([
      { name: 'eth', ecosystem: 'evm' },
      { name: 'polygon', ecosystem: 'evm' },
    ]);
  }
} 