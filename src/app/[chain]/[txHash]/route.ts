// @jsxImportSource react
import * as React from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { Translate } from '@noves/noves-sdk';

export const runtime = 'edge';

type RouteParams = {
  chain: string;
  txHash: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<ImageResponse> {
  const { chain, txHash } = await context.params;

  let description = 'No description available';
  if (txHash && chain) {
    try {
      const evmTranslate = Translate.evm(process.env.NOVES_API_KEY!);
      const txDesc = await evmTranslate.describeTransaction(chain, txHash);
      description = txDesc?.description || description;
    } catch {
      // fallback to default description
    }
  }

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, #101010 60%, #00ff00 100%)',
        },
      },
      React.createElement('h1', { style: { color: 'white', fontSize: 48 } }, 'Send Token'),
      React.createElement('p', { style: { color: 'yellow', fontSize: 32 } }, description),
      React.createElement('p', { style: { color: 'white', fontSize: 24 } }, `Tx: ${txHash}`),
      React.createElement('p', { style: { color: 'white', fontSize: 24 } }, `Chain: ${chain}`)
    ),
    {
      width: 1200,
      height: 628,
    }
  );
} 