"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { getChainIconUrl, generateDefaultIcon } from './utils/chainIcons';

// Add search and chevron icons using inline SVGs
const SearchIcon = () => (
  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg 
    className={`w-5 h-5 text-white/50 transition-transform ${open ? 'transform rotate-180' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Home() {
  const [chainId, setChainId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [chains, setChains] = useState<{ name: string; ecosystem: string; icon: string }[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchChainsAndIcons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/chains');
        const result = await response.json();
        
        // Fetch icons for all chains in parallel
        const chainsWithIcons = await Promise.all(
          result.map(async (chain: { name: string; ecosystem: string }) => {
            try {
              const url = getChainIconUrl(chain.name);
              const res = await fetch(url, { method: 'HEAD' });
              return {
                ...chain,
                icon: res.ok ? url : generateDefaultIcon(chain.name)
              };
            } catch {
              return {
                ...chain,
                icon: generateDefaultIcon(chain.name)
              };
            }
          })
        );
        
        setChains(chainsWithIcons);
      } catch {
        // Fallback with default chain and preloaded icon
        const ethereum = {
          name: 'ethereum',
          ecosystem: 'evm',
          icon: generateDefaultIcon('ethereum')
        };
        setChains([ethereum]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChainsAndIcons();
  }, []);

  const handleGenerate = () => {
    if (!chainId || !txHash) return;
    const url = `/${chainId}/${txHash}/og-image`;
    setOgUrl(url);
  };

  const handleShare = () => {
    if (!ogUrl) return;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + ogUrl.replace('/og-image', ''))}`;
    window.open(shareUrl, '_blank');
  };

  const filteredChains =
    query === ''
      ? chains
      : chains.filter(chain =>
          chain.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/home-bg.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>
      {/* Main Card */}
      <main className="flex flex-col gap-8 items-center justify-center w-full min-h-[60vh]">
        <div className={`bg-white/10 border border-white/15 backdrop-blur-4xl rounded-2xl p-10 w-full ${ogUrl ? 'max-w-6xl' : 'max-w-xl'} flex flex-col lg:flex-row gap-8 items-center transition-all duration-300`}>
          {/* Form Section */}
          <div className={`w-full ${ogUrl ? 'lg:w-1/2 pr-8 lg:border-r lg:border-white/15' : ''} flex flex-col gap-8`}>
            {/* Logo inside card */}
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded-xl shadow-lg" />
            </div>
            <label className="block w-full">
              <span className="text-white/80 font-medium">Chain:</span>
              <Combobox value={chainId} onChange={val => setChainId(val === 'eth' ? 'ethereum' : val ?? '')}>
                {({ open }) => (
                  <div className="relative mt-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <SearchIcon />
                      </div>
                      {chainId && (
                        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none z-10">
                          <div className="w-5 h-5 rounded-full overflow-hidden">
                            {chains.find(c => c.name === chainId)?.icon && (
                              <Image
                                src={chains.find(c => c.name === chainId)!.icon}
                                alt={chainId}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                          </div>
                          <span className="ml-2 text-white/90">{chainId === 'eth' ? 'ethereum' : chainId}</span>
                        </div>
                      )}
                      <Combobox.Input
                        className={`block w-full rounded-lg border-none bg-white/30 text-white/90 shadow-sm backdrop-blur ${chainId ? 'pl-32' : 'pl-8'} pr-10 py-3 focus:ring-2 focus:ring-green-400 placeholder:text-white/50`}
                        displayValue={() => ''}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={chainId ? '' : 'Search or select chain...'}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronIcon open={open} />
                      </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white/80 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {isLoading ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                          Loading chains...
                        </div>
                      ) : filteredChains.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                          No chains found.
                        </div>
                      ) : (
                        filteredChains.map(chain => (
                          <Combobox.Option
                            key={chain.name}
                            value={chain.name}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-green-500 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                  <Image
                                    src={chain.icon}
                                    alt={chain.name}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                  />
                                </div>
                                <span
                                  className={`block truncate pl-7 ${selected ? 'font-semibold' : 'font-normal'}`}
                                >
                                  {chain.name === 'eth' ? 'ethereum' : chain.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                      active ? 'text-white' : 'text-green-500'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </div>
                )}
              </Combobox>
            </label>
            <label className="block w-full">
              <span className="text-white/80 font-medium">Transaction Hash</span>
              <input
                className="mt-2 block w-full rounded-lg border-none bg-white/30 text-white/90 shadow-sm backdrop-blur px-4 py-3 focus:ring-2 focus:ring-green-400 placeholder:text-white/50"
                type="text"
                value={txHash}
                onChange={e => setTxHash(e.target.value)}
                placeholder="0x..."
              />
            </label>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-150 cursor-pointer"
              onClick={handleGenerate}
            >
              Generate Preview
            </button>
          </div>

          {/* Preview Section */}
          {ogUrl && typeof window !== 'undefined' && (
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <img
                src={window.location.origin + ogUrl}
                alt="OG Preview"
                className="w-full rounded-xl border border-white/30 shadow-lg"
                width={1200}
                height={675}
              />
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={window.location.origin + ogUrl.replace('/og-image', '')}
                    readOnly
                    className="flex-1 p-2 rounded border border-gray-300 bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + ogUrl.replace('/og-image', ''));
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/15"></div>
                  <span className="text-white">or</span>
                  <div className="flex-1 h-px bg-white/15"></div>
                </div>
                <button
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleShare}
                >
                  Share on X
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8 text-white/60 text-sm">
        Built by{' '}
        <a
          href="https://github.com/mmednik-noves/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-400 transition-colors"
        >
          @mmednik
        </a>{' '}
        with 💚 and{' '}
        <a
          href="https://docs.noves.fi/reference/api-overview"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-400 transition-colors"
        >
          Noves Translate API
        </a>
      </footer>
    </div>
  );
}
