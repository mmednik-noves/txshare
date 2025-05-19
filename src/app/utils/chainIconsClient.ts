"use client";

import { useState, useEffect } from 'react';
import { getChainIconUrl, generateDefaultIcon } from './chainIcons';

// React hook to check if an image exists and return the appropriate URL
export const useChainIcon = (chainName: string) => {
  const [iconUrl, setIconUrl] = useState(generateDefaultIcon(chainName));

  useEffect(() => {
    const checkImage = async () => {
      try {
        const url = getChainIconUrl(chainName);
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          setIconUrl(url);
        } else {
          setIconUrl(generateDefaultIcon(chainName));
        }
      } catch {
        setIconUrl(generateDefaultIcon(chainName));
      }
    };

    checkImage();
  }, [chainName]);

  return iconUrl;
}; 