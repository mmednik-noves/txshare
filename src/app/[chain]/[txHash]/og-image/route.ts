// @jsxImportSource react
import * as React from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { Translate, shortenAddress } from '@noves/noves-sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  let transactionType = 'Send Token';
  let fromAddress = '';
  let toAddress = '';
  
  if (txHash && chain) {
    try {
      const evmTranslate = Translate.evm(process.env.NOVES_API_KEY!);
      const tx = await evmTranslate.getTransaction(chain, txHash);
      
      if (tx?.classificationData) {
        description = tx.classificationData.description || description;
        if (tx.classificationData.type) {
          transactionType = tx.classificationData.type
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
        }
      }

      if (tx?.rawTransactionData?.fromAddress) {
        fromAddress = shortenAddress(tx.rawTransactionData.fromAddress);
      }
      if (tx?.rawTransactionData?.toAddress) {
        toAddress = shortenAddress(tx.rawTransactionData.toAddress);
      }
    } catch {
      // fallback to default description
    }
  }

  // Function to create the flow visualization
  const FlowVisualization = () => {
    if (!fromAddress || !toAddress) return null;
    
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        },
      },
      [
        // From Address Box
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              minWidth: '200px',
            },
          },
          [
            React.createElement('p', { style: { color: 'white', fontSize: 16, margin: 0 } }, 'From'),
            React.createElement('p', { style: { color: 'white', fontSize: 20, margin: '4px 0 0 0', fontWeight: '500' } }, fromAddress),
          ]
        ),
        // Arrow
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontSize: 32,
              fontWeight: 'bold',
            },
          },
          '→'
        ),
        // To Address Box
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              minWidth: '200px',
            },
          },
          [
            React.createElement('p', { style: { color: 'white', fontSize: 16, margin: 0 } }, 'To'),
            React.createElement('p', { style: { color: 'white', fontSize: 20, margin: '4px 0 0 0', fontWeight: '500' } }, toAddress),
          ]
        ),
      ]
    );
  };

  // Fetch the background image from public
  const bgImageUrl = new URL('/bg.png', request.url).toString();
  const bgImageResponse = await fetch(bgImageUrl);
  const bgImageArrayBuffer = await bgImageResponse.arrayBuffer();
  const bgImageBase64 = Buffer.from(bgImageArrayBuffer).toString('base64');
  const encodedBgImage = `data:image/png;base64,${bgImageBase64}`;

  // Fetch chain icon
  let chainIcon = null;
  try {
    const chainIconUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain.toLowerCase()}/info/logo.png`;
    const chainIconResponse = await fetch(chainIconUrl);
    
    if (chainIconResponse.ok) {
      chainIcon = chainIconUrl;
    }
  } catch (error) {
    console.error('Failed to fetch chain icon:', error);
  }

  // Capitalize first letter of chain name
  const capitalizedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${encodedBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px 40px 40px 40px',
        },
      },
      [
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '40px',
            },
          },
          [
            chainIcon && React.createElement('img', {
              src: chainIcon,
              width: 100,
              height: 100,
              style: { 
                objectFit: 'contain',
              },
            }),
            React.createElement('p', { 
              style: { 
                color: 'black', 
                fontSize: 36, 
                fontWeight: 'bold',
                marginLeft: '16px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              } 
            }, capitalizedChain),
          ]
        ),
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              height: '100%',
              justifyContent: 'flex-start',
            },
          },
          [
            React.createElement('h1', { 
              style: { 
                color: 'white', 
                fontSize: 52, 
                fontWeight: 700, 
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '-0.03em',
                margin: 0
              } 
            }, transactionType),
            React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  maxWidth: '80%',
                  marginTop: '0'
                }
              },
              React.createElement('p', { 
                style: { 
                  color: 'white', 
                  fontSize: 40,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  marginBottom: '20px',
                  lineHeight: 1.4
                } 
              }, description)
            ),
            React.createElement(FlowVisualization),
          ]
        ),
      ]
    ),
    {
      width: 1200,
      height: 675,
    }
  );
} 