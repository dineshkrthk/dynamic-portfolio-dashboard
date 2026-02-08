"use client";

import { memo, useMemo } from "react";
import { PortfolioApiResponse } from "../types/stock";

interface Props {
  data: PortfolioApiResponse;
}

function GlobalStatsBar({ data }: Props) {
  const { totalValue, totalInvestment } = useMemo(() => {
    return data.sectors.reduce(
      (acc, s) => {
        acc.totalValue += s.totalPresentValue;
        acc.totalInvestment += s.totalInvestment;
        return acc;
      },
      { totalValue: 0, totalInvestment: 0 }
    );
  }, [data.sectors]);

  const gainLoss = totalValue - totalInvestment;

  const pct =
    totalInvestment > 0
      ? (gainLoss / totalInvestment) * 100
      : 0;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0E14]/85 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 sm:gap-10 items-start sm:items-center justify-between">
        {/* Total Value */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Total Portfolio Value
          </p>

          <p className="text-3xl font-bold tracking-tight">
            ₹{totalValue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Gain / Loss */}
        <div
          className={`
            px-4 py-1.5 rounded-full
            border
            text-sm font-semibold
            ${
              gainLoss >= 0
                ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }
          `}
        >
          {gainLoss >= 0 ? "▲" : "▼"} ₹
          {Math.abs(gainLoss).toLocaleString("en-IN")} •{" "}
          {pct.toFixed(2)}%
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>

          Live • Updated{" "}
          {new Date(data.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default memo(GlobalStatsBar);
