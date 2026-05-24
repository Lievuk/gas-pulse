import { NextResponse } from 'next/server';
import { createPublicClient, http, formatGwei } from 'viem';
import { mainnet, arbitrum, base, optimism, polygon, bsc } from 'viem/chains';

export const runtime = 'edge';
export const revalidate = 0;

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', color: '#627eea', tier: 'L1' as const, chain: mainnet, rpc: 'https://eth.llamarpc.com' },
  { id: 'bsc', name: 'BNB Smart Chain', color: '#f3ba2f', tier: 'L1' as const, chain: bsc, rpc: 'https://bsc-dataseed.bnbchain.org' },
  { id: 'polygon', name: 'Polygon', color: '#8247e5', tier: 'L1' as const, chain: polygon, rpc: 'https://polygon-rpc.com' },
  { id: 'arbitrum', name: 'Arbitrum One', color: '#28a0f0', tier: 'L2' as const, chain: arbitrum, rpc: 'https://arb1.arbitrum.io/rpc' },
  { id: 'base', name: 'Base', color: '#0052ff', tier: 'L2' as const, chain: base, rpc: 'https://mainnet.base.org' },
  { id: 'optimism', name: 'Optimism', color: '#ff0420', tier: 'L2' as const, chain: optimism, rpc: 'https://mainnet.optimism.io' },
];

async function getEthUsd(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { next: { revalidate: 60 } }
    );
    const d = await res.json();
    return d.ethereum?.usd || 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const ethUsd = await getEthUsd();
  const readings = await Promise.all(
    CHAINS.map(async (cfg) => {
      try {
        const client = createPublicClient({ chain: cfg.chain, transport: http(cfg.rpc) });
        const gasPrice = await client.getGasPrice();
        const gwei = parseFloat(formatGwei(gasPrice));
        return {
          id: cfg.id,
          name: cfg.name,
          color: cfg.color,
          tier: cfg.tier,
          gwei,
          ethUsd,
          txCostEth: 0,
          txCostUsd: 0,
        };
      } catch (e: any) {
        return {
          id: cfg.id,
          name: cfg.name,
          color: cfg.color,
          tier: cfg.tier,
          gwei: 0,
          ethUsd,
          txCostEth: 0,
          txCostUsd: 0,
          error: 'RPC unreachable',
        };
      }
    })
  );

  return NextResponse.json({ readings, ethUsd });
}
