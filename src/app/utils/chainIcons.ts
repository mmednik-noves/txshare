// Function to generate a deterministic color from a string
const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Function to generate an SVG icon with the chain's initials
export const generateDefaultIcon = (chainName: string): string => {
  const color = generateColorFromString(chainName);
  const initials = chainName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
    
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="${color}"/>
    <text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const getChainIconUrl = (chainName: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName.toLowerCase()}/info/logo.png`;
};

export const getChainInitialsAndColor = (chainName: string) => {
  const color = generateColorFromString(chainName);
  const initials = chainName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  return { initials, color };
};

export const checkChainIconExists = async (chainName: string): Promise<string | null> => {
  try {
    const url = getChainIconUrl(chainName);
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}; 