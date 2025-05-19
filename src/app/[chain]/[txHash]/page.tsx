import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: Promise<{
    chain: string;
    txHash: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { chain, txHash } = resolvedParams;
  
  // Capitalize first letter of chain name
  const capitalizedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();
  
  // Use a more generic title since we can't fetch transaction details here
  const title = `Transaction on ${capitalizedChain}`;
  const description = `View transaction details on ${capitalizedChain}`;
  
  // Use absolute URL for the image
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ogImageUrl = `${baseUrl}/${chain}/${txHash}/og-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function TransactionPage({ params }: Props) {
  const resolvedParams = await params;
  const { chain, txHash } = resolvedParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const ogImageUrl = `${baseUrl}/${chain}/${txHash}/og-image`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
      <Image
        src={ogImageUrl}
        alt="Transaction Preview"
        width={1200}
        height={630}
        priority
        className="max-w-full h-auto"
      />
      <Link 
        href="/"
        className="text-white hover:text-blue-400 transition-colors duration-200 text-lg font-medium flex items-center gap-2"
      >
        ✨ Generate your own transaction preview
      </Link>
    </div>
  );
} 