// @jsxImportSource react
import * as React from 'react';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { Translate, shortenAddress } from '@noves/noves-sdk';
import { checkChainIconExists, getChainInitialsAndColor } from '../../../utils/chainIcons';

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
              background: '#fff',
              padding: '20px 30px',
              borderRadius: '0',
              border: '3px solid #000',
              minWidth: '250px',
            },
          },
          [
            React.createElement('p', { style: { color: 'black', fontSize: 20, margin: 0 } }, 'From'),
            React.createElement('p', { style: { color: 'black', fontSize: 25, margin: '5px 0 0 0', fontWeight: '500' } }, fromAddress),
          ]
        ),
        // Arrow
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              color: 'black',
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
              background: '#fff',
              padding: '20px 30px',
              borderRadius: '0',
              border: '3px solid #000',
              minWidth: '250px',
            },
          },
          [
            React.createElement('p', { style: { color: 'black', fontSize: 20, margin: 0 } }, 'To'),
            React.createElement('p', { style: { color: 'black', fontSize: 25, margin: '5px 0 0 0', fontWeight: '500' } }, toAddress),
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
  const chainIcon = await checkChainIconExists(chain);
  const { initials, color } = getChainInitialsAndColor(chain);

  // Capitalize first letter of chain name, but use 'Ethereum' for 'eth'
  const capitalizedChain = chain === 'eth' ? 'Ethereum' : chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

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
            chainIcon
              ? React.createElement('img', {
                  src: chainIcon,
                  width: 100,
                  height: 100,
                  style: {
                    objectFit: 'contain',
                    borderRadius: '50%',
                  },
                })
              : React.createElement(
                  'div',
                  {
                    style: {
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                  React.createElement(
                    'span',
                    {
                      style: {
                        color: 'white',
                        fontSize: 48,
                        fontWeight: 'bold',
                        fontFamily: 'Arial, sans-serif',
                      },
                    },
                    initials
                  )
                ),
            React.createElement('p', {
              style: {
                color: 'black',
                fontSize: 36,
                fontWeight: 'bold',
                marginLeft: '16px',
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              },
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
                color: 'black', 
                fontSize: 70, 
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
                  color: 'black', 
                  fontSize: 50,
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
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
} 