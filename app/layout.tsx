import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gas Pulse — Live EVM gas oracle',
  description: 'Real-time gas prices across Ethereum, Arbitrum, Base, Optimism, Polygon. Find the cheapest chain to transact right now.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
