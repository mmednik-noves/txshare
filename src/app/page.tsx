"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { generateDefaultIcon } from './utils/chainIcons';

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

// Add chain priority order
const chainPriorityOrder = [
  'eth',           // ethereum
  'bsc',           // bsc
  'base',          // base
  'arbitrum',      // arbitrum-one
  'avalanche',     // avalanche
  'polygon',       // polygon
  'sonic',         // sonic
  'unichain',      // unichain
  'core',          // core
  'cronos',        // cronos
  'taiko-katla',   // taiko
];

// Add chain name mapping
const chainNameMapping: { [key: string]: string } = {
  'eth': 'ethereum',
  'bsc': 'bsc',
  'base': 'base',
  'arbitrum': 'arbitrum',
  'avalanche': 'avalanche',
  'polygon': 'polygon',
  'sonic': 'sonic',
  'unichain': 'unichain',
  'core': 'core',
  'cronos': 'cronos',
  'taiko-katla': 'taiko'
};

// Add chain icon mapping
const chainIconMapping: { [key: string]: string } = {
  'eth': 'ethereum',
  'bsc': 'bsc',
  'base': 'base',
  'arbitrum': 'arbitrum',
  'avalanche': 'avalanche',
  'polygon': 'polygon',
  'sonic': 'sonic',
  'unichain': 'unichain',
  'core': 'core',
  'cronos': 'cronos',
  'taiko-katla': 'taiko'
};

export default function Home() {
  const [chainId, setChainId] = useState('eth');
  const [txHash, setTxHash] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [chains, setChains] = useState<{ name: string; ecosystem: string; icon: string }[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchChainsAndIcons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/chains');
        const result = await response.json();

        // Sort chains based on priority
        const sortedChains = [...result].sort((a, b) => {
          const aIndex = chainPriorityOrder.indexOf(a.name);
          const bIndex = chainPriorityOrder.indexOf(b.name);
          
          // If both chains are in priority list, sort by their position
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only one chain is in priority list, it comes first
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          // If neither chain is in priority list, sort alphabetically
          return a.name.localeCompare(b.name);
        });

        // Set initial chains with direct llamao.fi URLs
        const chainsWithIcons = sortedChains.map(chain => {
          const iconName = chainIconMapping[chain.name] || chain.name;
          return {
            ...chain,
            icon: `https://icons.llamao.fi/icons/chains/rsz_${iconName}.jpg`
          };
        });

        setChains(chainsWithIcons);
      } catch {
        // Fallback with default chain and preloaded icon
        const ethereum = {
          name: 'eth',
          ecosystem: 'evm',
          icon: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg'
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
    setIsImageLoaded(false);
    setOgUrl('');
    setTimeout(() => {
      const url = `/${chainId}/${txHash}/og-image`;
      setOgUrl(url);
    }, 0);
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
        (chainNameMapping[chain.name] || chain.name).toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FDF6F0]">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-8 float-y float-delay-1 z-0" width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 90 Q 50 30, 80 85 T 150 55" stroke="#FFD600" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
        <svg className="absolute bottom-0 right-1/3 float-x float-delay-2 z-0" width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 100 Q 60 40, 90 105 T 170 70" stroke="#FB7185" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
        <svg className="absolute top-32 right-32 rotate-slow float-delay-3 z-0" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="60" height="60" rx="12" stroke="#4ADE80" strokeWidth="5" fill="none"/>
        </svg>
        <svg className="absolute top-1/2 left-24 float-y float-delay-4 z-0" width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="48,12 84,84 12,84" stroke="#38BDF8" strokeWidth="5" fill="none"/>
        </svg>
        <svg className="absolute top-1/2 left-3/4 float-x float-delay-5 z-0" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="#FBBF24" strokeWidth="5" fill="none"/>
        </svg>
      </div>
      <Image src="/logo.png" alt="Logo" width={150} height={150} className="z-10" />
      {/* Main Card */}
      <main className="flex flex-col gap-8 items-center justify-center w-full min-h-[60vh] font-sans z-10">
        <div className={`bg-white border-2 border-black p-10 w-full ${ogUrl ? 'max-w-6xl' : 'max-w-xl'} flex flex-col lg:flex-row gap-8 items-center transition-all duration-300 min-h-[600px]`}>
          {/* Form Section */}
          <div className={`w-full ${ogUrl ? 'lg:w-1/2' : ''} flex flex-col gap-8`}>
            <label className="block w-full">
              <span className="text-gray-900 font-bold text-lg">Chain:</span>
              <Combobox value={chainId} onChange={val => setChainId(val ?? '')}>
                {({ open }) => (
                  <div className="relative mt-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <SearchIcon />
                      </div>
                      {chainId && (
                        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none z-10">
                          <div className="w-5 h-5 rounded-full overflow-hidden">
                            <img
                              src={chains.find(c => c.name === chainId)?.icon || `https://icons.llamao.fi/icons/chains/rsz_${chainIconMapping[chainId] || chainId}.jpg`}
                              alt={chainId}
                              width={20}
                              height={20}
                              className="rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = generateDefaultIcon(chainId);
                              }}
                            />
                          </div>
                          <span className="ml-2 text-gray-900">{chainNameMapping[chainId] || chainId}</span>
                        </div>
                      )}
                      <Combobox.Button className="w-full">
                        <Combobox.Input
                          className={`block w-full border-2 border-black bg-white text-gray-900 shadow-none pl-8 pr-10 py-3 focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 rounded-none cursor-pointer`}
                          displayValue={() => ''}
                          onChange={e => setQuery(e.target.value)}
                          placeholder={chainId ? '' : 'Search or select chain...'}
                          onClick={() => setQuery('')}
                        />
                      </Combobox.Button>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronIcon open={open} />
                      </div>
                    </div>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base border-2 border-black focus:outline-none sm:text-sm">
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
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-green-500 text-white' : 'text-gray-900'}`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                  <img
                                    src={chain.icon}
                                    alt={chain.name}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.src = generateDefaultIcon(chain.name);
                                    }}
                                  />
                                </div>
                                <span
                                  className={`block truncate pl-7 ${selected ? 'font-semibold' : 'font-normal'}`}
                                >
                                  {chainNameMapping[chain.name] || chain.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? 'text-white' : 'text-green-500'}`}
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
              <span className="text-gray-900 font-bold text-lg">Transaction hash:</span>
              <div className="mt-2 relative">
                <input
                  className="block w-full border-2 border-black bg-white text-gray-900 shadow-none pl-4 pr-20 py-3 focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 rounded-none"
                  type="text"
                  value={txHash}
                  onChange={e => setTxHash(e.target.value)}
                  placeholder="0x..."
                />
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setTxHash(text);
                    } catch (err) {
                      console.error('Failed to read clipboard:', err);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-teal-400 hover:bg-teal-300 text-gray-900 border-2 border-black transition-colors cursor-pointer font-semibold active:scale-95 rounded-none shadow-none"
                >
                  PASTE
                </button>
              </div>
            </label>
            <button
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 border-2 border-black text-lg transition-all duration-150 cursor-pointer active:scale-95 rounded-none shadow-none"
              onClick={handleGenerate}
            >
              Generate 🪄
            </button>
          </div>

          {/* Preview Section */}
          {ogUrl && (
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="relative w-full aspect-video">
                <div className="w-full h-full bg-black/10 animate-pulse" />
                {typeof window !== 'undefined' && (
                  <img
                    src={window.location.origin + ogUrl}
                    alt="OG Preview"
                    className="absolute inset-0 w-full h-full border-2 border-black object-cover"
                    width={1200}
                    height={675}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                )}
              </div>
              {!isImageLoaded && (
                <div className="flex flex-col gap-4 w-full">
                  <div className="h-10 bg-black/10 animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/15"></div>
                    <span className="text-gray-900">or</span>
                    <div className="flex-1 h-px bg-white/15"></div>
                  </div>
                  <div className="h-10 bg-black/10 animate-pulse" />
                </div>
              )}
              {isImageLoaded && (
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={window.location.origin + ogUrl.replace('/og-image', '')}
                      readOnly
                      className="flex-1 p-2 border-2 border-black bg-white text-black text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + ogUrl.replace('/og-image', ''));
                      }}
                      className="bg-purple-400 hover:bg-purple-300 text-gray-900 font-bold py-1.5 px-4 border-2 border-black cursor-pointer transition-all active:scale-95 rounded-none shadow-none"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/15"></div>
                    <span className="text-gray-900">or</span>
                    <div className="flex-1 h-px bg-white/15"></div>
                  </div>
                  <button
                    className="bg-blue-400 hover:bg-blue-300 text-gray-900 font-bold py-2 px-4 border-2 border-black cursor-pointer transition-all active:scale-95 rounded-none shadow-none"
                    onClick={handleShare}
                  >
                    Share on X
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8 text-black text-sm z-10">
        Built by{' '}
        <a
          href="https://github.com/mmednik-noves/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-green-500 transition-colors font-semibold"
        >
          @mmednik
        </a>{' '}
        with 💚 and{' '}
        <a
          href="https://docs.noves.fi/reference/api-overview"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 hover:text-green-500 transition-colors font-semibold"
        >
          Noves Translate API
        </a>
      </footer>
    </div>
  );
}
