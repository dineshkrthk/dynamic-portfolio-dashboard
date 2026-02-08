import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import {
  Holding,
  PortfolioApiResponse,
} from "../../../types/stock";

import {
  enrichHoldings,
  groupBySector,
} from "../../../utils/calculations";

import { getCMP } from "../../../services/yahoo";
import { getGoogleFundamentals } from "../../../services/google";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "portfolio.json"
    );

    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    const holdings: Holding[] = parsed.holdings;

    const cmpResults = await Promise.allSettled(
      holdings.map((h) => getCMP(h.symbol))
    );

    const fundamentalsResults = await Promise.allSettled(
      holdings.map((h) => getGoogleFundamentals(h.symbol))
    );

    const cmpMap: Record<
      string,
      { price: number | null; prev: number | null }
    > = {};

    const fundamentalsMap: Record<
      string,
      { peRatio: number | null; earnings: string | null }
    > = {};

    holdings.forEach((h, idx) => {
      const cmpRes = cmpResults[idx];
      const fundRes = fundamentalsResults[idx];

      cmpMap[h.symbol] =
        cmpRes.status === "fulfilled"
          ? cmpRes.value
          : { price: null, prev: null };

      fundamentalsMap[h.symbol] =
        fundRes.status === "fulfilled"
          ? fundRes.value
          : { peRatio: null, earnings: null };
    });

    const enriched = enrichHoldings(
      holdings,
      cmpMap,
      fundamentalsMap
    );

    const sectors = groupBySector(enriched);

    const response: PortfolioApiResponse = {
      holdings: enriched,
      sectors,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("API /api/stocks failed:", err);

    return NextResponse.json(
      { error: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
}
