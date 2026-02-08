"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  EnrichedHolding,
  SectorSummary,
} from "../types/stock";

import {
  memo,
  useMemo,
} from "react";

interface Props {
  holdings: EnrichedHolding[];
  sectors: SectorSummary[];
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#34d399",
  "#f472b6",
  "#facc15",
];

/* -------- helpers -------- */

function formatPct(v: number) {
  return `${v.toFixed(2)}%`;
}

function formatMoney(v: number) {
  return `₹${v.toLocaleString("en-IN")}`;
}

/* -------- component -------- */

function Charts({
  holdings,
  sectors,
}: Props) {

  /* ---------- DONUT DATA (top N only) ---------- */
  const donutData = useMemo(() => {
    if (!holdings.length)
      return [];

    const sorted = [...holdings].sort(
      (a, b) =>
        b.portfolioPct -
        a.portfolioPct
    );

    const TOP = 8;

    const main =
      sorted.slice(0, TOP);

    const rest =
      sorted.slice(TOP);

    const othersPct = rest.reduce(
      (s, h) =>
        s + h.portfolioPct,
      0
    );

    const mapped = main.map(
      (h) => ({
        name: h.name,
        value: Number(
          h.portfolioPct.toFixed(
            2
          )
        ),
      })
    );

    if (othersPct > 0) {
      mapped.push({
        name: "Others",
        value: Number(
          othersPct.toFixed(
            2
          )
        ),
      });
    }

    return mapped;
  }, [holdings]);

  /* ---------- SECTOR BARS ---------- */
  const sectorBars = useMemo(
    () =>
      sectors.map((s) => ({
        sector: s.sector,
        value: s.totalPresentValue,
      })),
    [sectors]
  );

  /* ---------- TOP SECTOR ---------- */
  const topSector = useMemo(() => {
    if (!sectors.length)
      return null;

    return [...sectors].sort(
      (a, b) =>
        b.totalPresentValue -
        a.totalPresentValue
    )[0];
  }, [sectors]);

  return (
    <div className="
      grid grid-cols-1
      lg:grid-cols-2
      gap-6
    ">

      {/* ---------- DONUT ---------- */}
      <div className="
        glass-card
        h-[380px]
        flex flex-col
      ">
        <h3 className="text-lg font-semibold mb-2">
          Portfolio Allocation
        </h3>

        <div className="relative flex-1">

          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={78}
                outerRadius={118}
                paddingAngle={4}
                stroke="#0f172a"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {donutData.map(
                  (_, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        COLORS[
                          idx %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "rgba(2,6,23,0.95)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
                labelStyle={{
                  color: "#ffffff",
                  fontWeight: 700,
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
                formatter={(v: any) => formatPct(v)}
              />    

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  fontSize:
                    "12px",
                  opacity:
                    0.85,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {topSector && (
            <div className="
              absolute inset-0
              flex flex-col
              items-center justify-center
              pointer-events-none
            ">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Top Sector
              </p>

              <p className="font-semibold text-sm">
                {
                  topSector.sector
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- SECTOR BARS ---------- */}
      <div className="
        glass-card
        h-[380px]
        flex flex-col
      ">
        <h3 className="text-lg font-semibold mb-2">
          Sector Performance
        </h3>

        <div className="flex-1">

          <ResponsiveContainer>
            <BarChart
              data={
                sectorBars
              }
              layout="vertical"
            >
              <defs>
                <linearGradient
                  id="barGlow"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#60a5fa"
                  />
                  <stop
                    offset="100%"
                    stopColor="#38bdf8"
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#475569"
                strokeDasharray="3 3"
                opacity={0.5}
              />

              <XAxis
                type="number"
                stroke="#cbd5f5"
                tick={{ fontSize: 12 }}
                tickFormatter={
                  formatMoney
                }
              />

              <YAxis
                type="category"
                dataKey="sector"
                stroke="#cbd5f5"
                tick={{ fontSize: 12 }}
                width={110}
              />

              <Tooltip
                contentStyle={{
                  background:
                    "rgba(15,23,42,0.95)",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid rgba(148,163,184,0.35)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.6)",
                  color:
                    "#f8fafc",
                }}
                formatter={(v: any) =>
                  formatMoney(v)}
              />

              <Bar
                dataKey="value"
                fill="url(#barGlow)"
                radius={[
                  0,
                  10,
                  10,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default memo(Charts);
