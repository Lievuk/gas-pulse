'use client';
import { useEffect, useState } from 'react';

interface Reading {
  id: string;
  name: string;
  color: string;
  tier: 'L1' | 'L2';
  gwei: number;
  baseFee?: number;
  priorityFee?: number;
  ethUsd: number;
  txCostEth: number;
  txCostUsd: number;
  error?: string;
}

const TX_TYPE_GAS: Record<string, number> = {
  'Transfer ETH': 21_000,
  'ERC-20 transfer': 65_000,
  'Uniswap swap': 150_000,
  'NFT mint': 200_000,
};

export default function Home() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [txType, setTxType] = useState<string>('Transfer ETH');

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/gas');
      const data = await res.json();
      setReadings(data.readings);
      setUpdatedAt(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 12_000); // 12s = ~1 ETH block
    return () => clearInterval(id);
  }, []);

  const gasUnits = TX_TYPE_GAS[txType];
  const adjusted = readings.map(r => ({
    ...r,
    txCostEth: (r.gwei * gasUnits) / 1e9,
    txCostUsd: ((r.gwei * gasUnits) / 1e9) * r.ethUsd,
  }));

  const cheapest = adjusted
    .filter(r => !r.error && r.txCostUsd > 0)
    .sort((a, b) => a.txCostUsd - b.txCostUsd)[0];

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Gas Pulse</h1>
          <p className="tagline">Live EVM gas oracle. Refreshes every 12 seconds.</p>
        </div>
        <div className="status">
          <span className="dot"></span>
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Connecting…'}
        </div>
      </div>

      <div className="controls">
        <label style={{ color: 'var(--muted)', alignSelf: 'center', fontSize: '0.875rem' }}>Compare cost for:</label>
        <select value={txType} onChange={e => setTxType(e.target.value)}>
          {Object.keys(TX_TYPE_GAS).map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      {cheapest && (
        <div className="cheapest-banner">
          <div>
            <div className="cheapest-label">Cheapest right now</div>
            <div className="cheapest-name">{cheapest.name}</div>
          </div>
          <div className="cheapest-cost">
            ${cheapest.txCostUsd.toFixed(4)} per {txType.toLowerCase()}
          </div>
        </div>
      )}

      <div className="grid">
        {adjusted.map(r => (
          <div key={r.id} className={`card ${cheapest?.id === r.id ? 'cheapest' : ''}`}>
            <div className="card-head">
              <div className="chain-name">
                <span className="chain-dot" style={{ background: r.color }} />
                {r.name}
              </div>
              <span className={`tier-badge ${r.tier === 'L1' ? 'l1' : 'l2'}`}>{r.tier}</span>
            </div>
            {r.error ? (
              <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{r.error}</div>
            ) : (
              <>
                <div className="gwei">
                  {r.gwei.toFixed(r.gwei < 1 ? 4 : 2)}
                  <span className="gwei-unit"> gwei</span>
                </div>
                <div className="tx-cost">
                  <span>{txType} cost</span>
                  <span className="tx-cost-value">${r.txCostUsd.toFixed(4)}</span>
                </div>
                <div className="tx-cost">
                  <span>In ETH</span>
                  <span className="tx-cost-value">{r.txCostEth.toExponential(2)}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="footer">
        <p>Open-source. <a href="https://github.com/Lievuk/gas-pulse" target="_blank">View source</a></p>
      </div>
    </div>
  );
}
