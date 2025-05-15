# Transaction Preview Generator

A Next.js application that generates beautiful transaction preview images using the [Noves SDK](https://noves.fi).
Share blockchain transactions with rich visual previews on social media.

## Features

- Generate OG images for any EVM transaction
- Support for multiple chains (Ethereum, Polygon, etc.)
- One-click sharing to X (Twitter)
- Clean, simplified URLs for easy sharing
- Beautiful gradient design for preview images

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Add your Noves API key to `.env.local`:
```
NOVES_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to start generating transaction previews

## How to Use

1. Select a blockchain network
2. Paste your transaction hash
3. Click "Generate Preview"
4. Share the generated URL or post directly to X

## Built With

- [Next.js](https://nextjs.org)
- [Noves SDK](https://noves.fi)
- [Vercel OG](https://vercel.com/docs/functions/og-image-generation)