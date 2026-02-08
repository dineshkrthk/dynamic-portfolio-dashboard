import axios from "axios";
import { load, type CheerioAPI } from "cheerio";
import { getFromCache, setInCache } from "./cache";

const CACHE_PREFIX = "GOOGLE_FUND_";
const FUNDAMENTALS_TTL = 60 * 30;

export interface GoogleFundamentals {
  peRatio: number | null;
  earnings: string | null;
}

function buildGoogleFinanceUrl(symbol: string) {
  const clean = symbol.replace(".NS", "");
  return `https://www.google.com/finance/quote/${clean}:NSE`;
}

function extractMetrics($: any) {
  const metrics: Record<string, string> = {};

  const nodes = $("div") as any;

  nodes.each((_: any, el: any) => {
    const block = $(el);

    const label = block
      .find("div, span")
      .first()
      .text()
      .trim();

    const value = block
      .find("div, span")
      .last()
      .text()
      .trim();

    if (!label || !value) return;

    if (/P\/E/i.test(label)) {
      metrics.pe = value;
    }

    if (/EPS|Earnings/i.test(label)) {
      metrics.earnings = value;
    }
  });

  return metrics;
}

export async function getGoogleFundamentals(
  symbol: string
): Promise<GoogleFundamentals> {
  const cacheKey = `${CACHE_PREFIX}${symbol}`;

  const cached = getFromCache<GoogleFundamentals>(cacheKey);
  if (cached) return cached;

  try {
    const url = buildGoogleFinanceUrl(symbol);

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    const $ = load(response.data);

    const metrics = extractMetrics($);

    const peRaw = metrics.pe;
    const earningsRaw = metrics.earnings;

    const peRatio =
      peRaw && !isNaN(Number(peRaw.replace(/,/g, "")))
        ? Number(peRaw.replace(/,/g, ""))
        : null;

    const earnings =
      earningsRaw && /\d/.test(earningsRaw)
        ? earningsRaw
        : null;

    const result = { peRatio, earnings };

    setInCache(cacheKey, result, FUNDAMENTALS_TTL);

    return result;
  } catch {
    console.warn(`Google Finance scrape failed for ${symbol}`);

    return cached ?? {
      peRatio: null,
      earnings: null,
    };
  }
}
