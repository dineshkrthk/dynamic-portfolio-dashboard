import {
  Holding,
  EnrichedHolding,
  SectorSummary,
} from "../types/stock";

export function enrichHoldings(
  holdings: Holding[],
  cmpMap: Record<
    string,
    { price: number | null; prev: number | null }
  >,
  fundamentalsMap: Record<
    string,
    { peRatio: number | null; earnings: string | null }
  >
): EnrichedHolding[] {

  const totalPresentValue = holdings.reduce((sum, h) => {
    const cmp = cmpMap[h.symbol]?.price;
    return cmp ? sum + cmp * h.quantity : sum;
  }, 0);

  return holdings.map((h) => {
    const investment =
      h.purchasePrice * h.quantity;

    const cmpObj =
      cmpMap[h.symbol] ?? {
        price: null,
        prev: null,
      };

    const cmp = cmpObj.price;
    const prevCmp = cmpObj.prev;

    const presentValue =
      cmp ? cmp * h.quantity : 0;

    const gainLoss =
      presentValue - investment;

    const portfolioPct =
      totalPresentValue > 0
        ? (presentValue /
            totalPresentValue) *
          100
        : 0;

    const cmpChange =
      cmp !== null &&
      prevCmp !== null
        ? cmp - prevCmp
        : null;

    const cmpChangePct =
      cmp !== null &&
      prevCmp !== null
        ? ((cmp - prevCmp) / prevCmp) *
          100
        : null;

    const cmpDirection =
      cmpChange === null
        ? null
        : cmpChange > 0
        ? "up"
        : cmpChange < 0
        ? "down"
        : "flat";

    const fundamentals =
      fundamentalsMap[h.symbol] ?? {
        peRatio: null,
        earnings: null,
      };

    return {
      ...h,

      investment,
      presentValue,
      gainLoss,
      portfolioPct,

      cmp,
      peRatio: fundamentals.peRatio,
      earnings: fundamentals.earnings,

      cmpChange,
      cmpChangePct,
      cmpDirection,
    };
  });
}

export function groupBySector(
  holdings: EnrichedHolding[]
): SectorSummary[] {
  const sectorMap: Record<
    string,
    {
      totalInvestment: number;
      totalPresentValue: number;
      totalGainLoss: number;
    }
  > = {};

  for (const h of holdings) {
    if (!sectorMap[h.sector]) {
      sectorMap[h.sector] = {
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
      };
    }

    sectorMap[h.sector].totalInvestment +=
      h.investment;

    sectorMap[h.sector].totalPresentValue +=
      h.presentValue;

    sectorMap[h.sector].totalGainLoss +=
      h.gainLoss;
  }

  return Object.entries(sectorMap).map(
    ([sector, values]) => ({
      sector,
      ...values,
    })
  );
}
