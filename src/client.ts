import type {
  IndicatorPoint,
  ListResult,
  PagedResult,
  PriceCandleResult,
  PriceTickerResult,
  SymbolResult
} from "./types.js";

export interface RealMarketApiClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class RealMarketApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RealMarketApiClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? "https://api.realmarketapi.com").replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getPrice(symbolCode: string, timeFrame: string): Promise<PriceTickerResult> {
    return this.get<PriceTickerResult>("/api/v1/price", { symbolCode, timeFrame });
  }

  async getCandles(symbolCode: string, timeFrame: string): Promise<ListResult<PriceCandleResult>> {
    return this.get<ListResult<PriceCandleResult>>("/api/v1/candle", { symbolCode, timeFrame });
  }

  async getHistory(
    symbolCode: string,
    startTime: string,
    endTime: string,
    pageNumber = 1,
    pageSize = 20
  ): Promise<PagedResult<PriceTickerResult>> {
    return this.get<PagedResult<PriceTickerResult>>("/api/v1/history", {
      symbolCode,
      startTime,
      endTime,
      pageNumber: String(pageNumber),
      pageSize: String(pageSize)
    });
  }

  async getSymbols(): Promise<ListResult<SymbolResult>> {
    return this.get<ListResult<SymbolResult>>("/api/v1/symbol");
  }

  async getSma(symbolCode: string, timeFrame: string, period = 20): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/sma", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  private async get<T>(path: string, query: Record<string, string> = {}): Promise<T> {
    const params = new URLSearchParams({ apiKey: this.apiKey, ...query });
    const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`RealMarketApi error ${response.status}: ${body}`);
    }

    return (await response.json()) as T;
  }
}
