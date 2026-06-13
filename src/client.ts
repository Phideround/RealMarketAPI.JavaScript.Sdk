import type {
  AddWatchlistItemRequest,
  AlertResult,
  CreateAlertRequest,
  CreateAlertResult,
  CreateWatchlistRequest,
  DeleteAlertResult,
  IndicatorPoint,
  ListResult,
  MarketCalendarResult,
  PagedResult,
  PriceCandleResult,
  PriceTickerResult,
  ScreenerQueryRequest,
  ScreenerResult,
  SymbolResult,
  StrategySignalResult,
  WatchlistItemResult,
  WatchlistResult
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

  async createAlert(request: CreateAlertRequest): Promise<CreateAlertResult> {
    return this.post<CreateAlertResult>("/api/v1/alerts", request);
  }

  async getAlerts(status?: string): Promise<ListResult<AlertResult>> {
    return this.get<ListResult<AlertResult>>("/api/v1/alerts", status ? { status } : {});
  }

  async deleteAlert(alertId: string): Promise<DeleteAlertResult> {
    return this.delete<DeleteAlertResult>(`/api/v1/alerts/${encodeURIComponent(alertId)}`);
  }

  async queryScreener(request: ScreenerQueryRequest): Promise<ListResult<ScreenerResult>> {
    return this.post<ListResult<ScreenerResult>>("/api/v1/screener/query", request);
  }

  async getStrategySignal(symbolCode: string, timeFrame: string): Promise<StrategySignalResult> {
    return this.get<StrategySignalResult>("/api/v1/signals/strategy", { symbolCode, timeFrame });
  }

  async createWatchlist(request: CreateWatchlistRequest): Promise<WatchlistResult> {
    return this.post<WatchlistResult>("/api/v1/watchlists", request);
  }

  async getWatchlists(): Promise<ListResult<WatchlistResult>> {
    return this.get<ListResult<WatchlistResult>>("/api/v1/watchlists");
  }

  async addWatchlistItem(watchlistId: string, request: AddWatchlistItemRequest): Promise<WatchlistItemResult> {
    return this.post<WatchlistItemResult>(`/api/v1/watchlists/${encodeURIComponent(watchlistId)}/items`, request);
  }

  async removeWatchlistItem(watchlistId: string, symbolCode: string): Promise<void> {
    await this.delete<unknown>(
      `/api/v1/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(symbolCode)}`
    );
  }

  async getMarketCalendar(date?: string, timezone = "UTC"): Promise<MarketCalendarResult> {
    const query: Record<string, string> = { timezone };
    if (date) {
      query.date = date;
    }
    return this.get<MarketCalendarResult>("/api/v1/market-calendar", query);
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

  private async post<T>(path: string, body: unknown): Promise<T> {
    const params = new URLSearchParams({ apiKey: this.apiKey });
    const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RealMarketApi error ${response.status}: ${text}`);
    }

    return (await response.json()) as T;
  }

  private async delete<T>(path: string): Promise<T> {
    const params = new URLSearchParams({ apiKey: this.apiKey });
    const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RealMarketApi error ${response.status}: ${text}`);
    }

    return (await response.json()) as T;
  }
}
