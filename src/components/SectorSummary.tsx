"use client";

import { memo } from "react";
import { SectorSummary as SectorType } from "../types/stock";

interface Props {
  sectors: SectorType[];
}

function SectorSummary({ sectors }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((sector) => {
        const pct =
          sector.totalInvestment > 0
            ? (sector.totalGainLoss /
                sector.totalInvestment) *
              100
            : 0;

        const positive =
          sector.totalGainLoss >= 0;

        return (
          <div
            key={sector.sector}
            className="
              relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-white/[0.035]
              backdrop-blur-xl
              p-6
              shadow-lg
              transition-transform duration-300
              hover:-translate-y-1
            "
          >
            {/* Accent line */}
            <div
              className={`
                absolute inset-x-0 top-0 h-[2px]
                ${
                  positive
                    ? "bg-gradient-to-r from-emerald-400/0 via-emerald-400 to-emerald-400/0"
                    : "bg-gradient-to-r from-rose-400/0 via-rose-400 to-rose-400/0"
                }
              `}
            />

            <h3 className="text-lg font-semibold tracking-tight mb-1">
              {sector.sector}
            </h3>

            <p
              className={`text-xs font-medium mb-4 ${
                positive
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {positive ? "▲" : "▼"}{" "}
              {pct.toFixed(2)}%
            </p>

            <div className="h-px w-12 bg-gradient-to-r from-sky-400 to-indigo-500 mb-4" />

            <div className="space-y-2 text-sm">
              <Row
                label="Investment"
                value={sector.totalInvestment}
              />

              <Row
                label="Present Value"
                value={
                  sector.totalPresentValue
                }
              />

              <Row
                label="Gain / Loss"
                value={sector.totalGainLoss}
                highlight
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  const positive = value >= 0;

  return (
    <div className="flex justify-between">
      <span className="text-slate-400">
        {label}
      </span>

      <span
        className={`font-semibold ${
          highlight
            ? positive
              ? "text-emerald-400"
              : "text-rose-400"
            : ""
        }`}
      >
        ₹{value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

export default memo(SectorSummary);
