import YahooFinance from "yahoo-finance2";
import { getFromCache, setInCache } from "./cache";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const CACHE_PREFIX = "YAHOO_CMP_OBJ_";
const CMP_TTL = 15;

export interface CachedCMP {
  price: number | null;
  prev: number | null;
}

export async function getCMP(symbol: string): Promise<CachedCMP> {
  const cacheKey = `${CACHE_PREFIX}${symbol}`;

  const cached = getFromCache<CachedCMP>(cacheKey);

  try {
    const quote: any = await yahooFinance.quote(symbol);

    const newPrice =
      typeof quote?.regularMarketPrice === "number"
        ? quote.regularMarketPrice
        : null;

    const result: CachedCMP = {
      price: newPrice,
      prev: cached?.price ?? null,
    };

    setInCache(cacheKey, result, CMP_TTL);

    return result;
  } catch {
    return cached ?? { price: null, prev: null };
  }
}
