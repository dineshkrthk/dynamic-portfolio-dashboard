"use client";

import {
  memo,
  useState,
  useMemo,
  useCallback,
} from "react";

import { EnrichedHolding } from "../types/stock";

interface Props {
  holdings: EnrichedHolding[];
}

type Grouped = Record<string, EnrichedHolding[]>;

function groupBySector(
  holdings: EnrichedHolding[]
): Grouped {
  return holdings.reduce((acc, h) => {
    acc[h.sector] ??= [];
    acc[h.sector].push(h);
    return acc;
  }, {} as Grouped);
}

function PortfolioTable({ holdings }: Props) {
  const grouped = useMemo(
    () => groupBySector(holdings),
    [holdings]
  );

  const [openSectors, setOpenSectors] =
    useState<Record<string, boolean>>({});

  const toggleSector = useCallback(
    (sector: string) =>
      setOpenSectors((p) => ({
        ...p,
        [sector]: !(p[sector] ?? true),
      })),
    []
  );

  const formatMoney = useCallback(
    (v: number) =>
      `₹${v.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
    []
  );

  return (
    <div className="space-y-10">
      {/* Desktop */}
      <div className="hidden md:block space-y-8">
        {Object.entries(grouped).map(
          ([sector, rows]) => {
            const sectorGain = rows.reduce(
              (s, r) => s + r.gainLoss,
              0
            );

            const open =
              openSectors[sector] ?? true;

            return (
              <div
                key={sector}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur shadow-xl"
              >
                <button
                  onClick={() =>
                    toggleSector(sector)
                  }
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900/90 to-slate-950 border-b border-white/10 hover:from-slate-800/90 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">
                      {sector}
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        sectorGain >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {formatMoney(sectorGain)}
                    </span>
                  </div>

                  <span className="text-slate-400 text-sm">
                    {open ? "▾" : "▸"}
                  </span>
                </button>

                {open && (
                  <div className="max-h-[520px] overflow-y-auto overscroll-contain">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900/95 text-xs uppercase tracking-wide text-slate-300 backdrop-blur">
                        <tr>
                          <th className="p-4 text-left">
                            Stock
                          </th>
                          <th className="p-4 text-right">
                            Qty
                          </th>
                          <th className="p-4 text-right hidden lg:table-cell">
                            Purchase
                          </th>
                          <th className="p-4 text-right">
                            CMP
                          </th>
                          <th className="p-4 text-right hidden lg:table-cell">
                            Investment
                          </th>
                          <th className="p-4 text-right">
                            Gain/Loss
                          </th>
                          <th className="p-4 text-right hidden xl:table-cell">
                            P/E
                          </th>
                          <th className="p-4 text-right hidden xl:table-cell">
                            Earnings
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((h) => (
                          <tr
                            key={h.id}
                            className="border-t border-white/5 hover:bg-white/[0.06] transition-colors"
                          >
                            <td className="p-4 font-medium">
                              {h.name}
                              <div className="text-xs text-slate-400">
                                {h.symbol}
                              </div>
                            </td>

                            <td className="p-4 text-right tabular-nums">
                              {h.quantity}
                            </td>

                            <td className="p-4 text-right hidden lg:table-cell tabular-nums">
                              {formatMoney(
                                h.purchasePrice
                              )}
                            </td>

                            <td
                              className={`p-4 text-right font-medium tabular-nums ${
                                h.cmpDirection === "up"
                                  ? "price-up text-emerald-400"
                                  : h.cmpDirection ===
                                    "down"
                                  ? "price-down text-rose-400"
                                  : ""
                              }`}
                            >
                              {h.cmp
                                ? formatMoney(h.cmp)
                                : "-"}
                            </td>

                            <td className="p-4 text-right hidden lg:table-cell tabular-nums">
                              {formatMoney(
                                h.investment
                              )}
                            </td>

                            <td
                              className={`p-4 text-right font-semibold tabular-nums ${
                                h.gainLoss >= 0
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {formatMoney(
                                h.gainLoss
                              )}
                            </td>

                            <td className="p-4 text-right hidden xl:table-cell tabular-nums">
                              {h.peRatio ?? "-"}
                            </td>

                            <td className="p-4 text-right hidden xl:table-cell tabular-nums">
                              {h.earnings ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-5">
        {holdings.map((h) => (
          <MobileCard
            key={h.id}
            h={h}
            formatMoney={formatMoney}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Mobile Card ---------------- */

function MobileCard({
  h,
  formatMoney,
}: {
  h: EnrichedHolding;
  formatMoney: (v: number) => string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] backdrop-blur p-4 shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left space-y-2"
      >
        <div className="flex justify-between">
          <span className="font-semibold">
            {h.name}
          </span>

          <span
            className={`font-semibold tabular-nums ${
              h.gainLoss >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {formatMoney(h.gainLoss)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-slate-400">
          <span>{h.symbol}</span>
          <span>
            CMP{" "}
            {h.cmp
              ? formatMoney(h.cmp)
              : "-"}
          </span>
        </div>
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Detail label="Qty" value={h.quantity} />
          <Detail
            label="Purchase"
            value={formatMoney(
              h.purchasePrice
            )}
          />
          <Detail
            label="Investment"
            value={formatMoney(
              h.investment
            )}
          />
          <Detail
            label="P/E"
            value={h.peRatio ?? "-"}
          />
          <Detail
            label="Earnings"
            value={h.earnings ?? "-"}
          />
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>
      <p className="font-medium tabular-nums">
        {value}
      </p>
    </div>
  );
}

export default memo(PortfolioTable);
