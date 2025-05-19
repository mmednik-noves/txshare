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
    
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="${color}"/>
      <text
        x="50"
        y="50"
        dy="0.35em"
        fill="white"
        font-family="Arial, sans-serif"
        font-size="40"
        text-anchor="middle"
      >${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const getChainIconUrl = (chainName: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName.toLowerCase()}/info/logo.png`;
};

// Server-side helper for checking if a chain icon exists
export const checkChainIconExists = async (chainName: string): Promise<string> => {
  try {
    const url = getChainIconUrl(chainName);
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? url : generateDefaultIcon(chainName);
  } catch {
    return generateDefaultIcon(chainName);
  }
}; 