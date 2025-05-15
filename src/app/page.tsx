"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const [chainId, setChainId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [chains, setChains] = useState<{ name: string; ecosystem: string }[]>([]);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('/api/chains');
        const result = await response.json();
        setChains(result);
      } catch {
        setChains([
          { name: 'eth', ecosystem: 'evm' },
          { name: 'polygon', ecosystem: 'evm' },
        ]);
      }
    };
    fetchChains();
  }, []);

  const handleGenerate = () => {
    if (!chainId || !txHash) return;
    const url = `/${chainId}/${txHash}`;
    setOgUrl(url);
  };

  const handleShare = () => {
    if (!ogUrl) return;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + ogUrl)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Transaction Preview</h1>
          <label className="block">
            <span className="text-gray-700">Select Chain</span>
            <select
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={chainId}
              onChange={e => setChainId(e.target.value)}
            >
              <option value="">-- Select Chain --</option>
              {chains.map(chain => (
                <option key={chain.name} value={chain.name}>{chain.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Transaction Hash</span>
            <input
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              type="text"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleGenerate}
          >
            Generate Preview
          </button>
          {ogUrl && (
            <>
              <Image src={ogUrl} alt="OG Preview" className="w-full rounded border" width={1000} height={1000} />
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={window.location.origin + ogUrl}
                    readOnly
                    className="flex-1 p-2 rounded border border-gray-300 bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + ogUrl);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleShare}
                >
                  Share on X
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    
      </footer>
    </div>
  );
}
