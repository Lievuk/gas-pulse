# Gas Pulse

Live EVM gas oracle dashboard. See real-time gas prices across **Ethereum, BSC, Polygon, Arbitrum, Base, Optimism**, get auto-suggested cheapest chain for the transaction type you care about, and see USD-priced transaction cost at current ETH price.

Live demo: https://gas-pulse.vercel.app

## Why

ETH gas oracles like ETH Gas Station only cover mainnet. L2 dashboards exist but each has its own UI. This app pulls them all into one auto-refreshing view (every 12 seconds = roughly one Ethereum block) with apples-to-apples USD pricing for common transaction types.

## Features

- **6 chains live**: Ethereum, BSC, Polygon, Arbitrum One, Base, Optimism
- **Sub-second response** via parallel RPC fanout from Vercel Edge runtime
- **Auto-refresh** every 12 seconds
- **TX type compare**: ETH transfer, ERC-20 transfer, Uniswap swap, NFT mint — see USD cost on each chain side by side
- **Cheapest-now banner** automatically highlights the lowest-cost chain
- **Free RPCs** — no Infura/Alchemy keys required

## Stack

- Next.js 14 App Router (Edge runtime)
- viem for typed RPC
- Pure CSS dark UI (no Tailwind required, ships smaller)
- Vercel deployment

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

```bash
vercel deploy --prod
```

## Roadmap

- [ ] EIP-1559 base fee + priority fee breakdown
- [ ] L1 calldata cost factored into L2 estimates
- [ ] Webhook alerts when gas drops below threshold (Discord/Telegram)
- [ ] Historical 24h chart per chain
- [ ] zkSync, Linea, Scroll, Mantle support
- [ ] Solana fee comparison

## License

MIT
