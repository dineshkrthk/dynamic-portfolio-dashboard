// Raw holding from portfolio.json
export interface Holding {
  id: string;
  symbol: string; // NSE/BSE code
  name: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
}

// Fully enriched holding returned by backend API
export interface EnrichedHolding extends Holding {
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPct: number;

  cmp: number | null;
  peRatio: number | null;
  earnings: string | null;

  cmpChange: number | null;
  cmpChangePct: number | null;
  cmpDirection: "up" | "down" | "flat" | null;
}

// Sector-level aggregation
export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
}

// API response shape
export interface PortfolioApiResponse {
  holdings: EnrichedHolding[];
  sectors: SectorSummary[];
  lastUpdated: string;
}
