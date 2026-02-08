"use client";

import { useEffect, useRef, useState } from "react";

import { PortfolioApiResponse } from "../types/stock";

import PortfolioTable from "../components/PortfolioTable";
import SectorSummary from "../components/SectorSummary";
import Charts from "../components/Charts";
import GlobalStatsBar from "../components/GlobalStatsBar";

export default function Home() {
  const [data, setData] =
    useState<PortfolioApiResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const pollingRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  async function fetchPortfolio() {
    try {
      setError(null);

      const res = await fetch("/api/stocks", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          "Failed to fetch portfolio data"
        );
      }

      const json: PortfolioApiResponse =
        await res.json();

      setData(json);
      setLoading(false);
    } catch (err: any) {
      console.error(
        "Frontend fetch failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong"
      );

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortfolio();

    pollingRef.current =
      setInterval(fetchPortfolio, 15000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const isEmpty =
    data && data.holdings.length === 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#0f172a] to-[#020617]">
      {data && <GlobalStatsBar data={data} />}

      <div className="pt-24">
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            md:px-6
            pb-24
            space-y-20
            animate-[fadeIn_0.5s_ease-out]
          "
        >
          {loading && (
            <div className="space-y-12">
              <SkeletonSection />
              <SkeletonSection />
              <SkeletonSection />
            </div>
          )}

          {error && (
            <div className="
              glass-card
              border-red-900/50
              text-red-400
              flex items-center justify-between gap-4
            ">
              <span>{error}</span>

              <button
                onClick={fetchPortfolio}
                className="
                  rounded-lg
                  bg-red-500/10
                  px-4 py-2
                  text-sm font-medium
                  text-red-300
                  hover:bg-red-500/20
                  transition
                "
              >
                Retry
              </button>
            </div>
          )}

          {isEmpty && (
            <div className="
              glass-card
              text-center
              py-24
              text-slate-400
            ">
              No holdings found in portfolio.
            </div>
          )}

          {data && !isEmpty && (
            <>
              <section className="glass-card">
                <h2 className="section-title">
                  Sector Summary
                </h2>

                <SectorSummary sectors={data.sectors} />
              </section>

              <section className="glass-card">
                <h2 className="section-title">
                  Visual Overview
                </h2>

                <Charts
                  holdings={data.holdings}
                  sectors={data.sectors}
                />
              </section>

              <section className="glass-card">
                <h2 className="section-title">
                  Holdings
                </h2>

                <div className="max-h-[72vh] overflow-y-auto">
                  <PortfolioTable
                    holdings={data.holdings}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SkeletonSection() {
  return (
    <div className="
      glass-card
      space-y-6
      animate-pulse
    ">
      <div className="h-6 w-48 rounded bg-white/10" />

      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 rounded bg-white/10" />
        <div className="h-24 rounded bg-white/10" />
      </div>

      <div className="h-64 rounded bg-white/10" />
    </div>
  );
}
