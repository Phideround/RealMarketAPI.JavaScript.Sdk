import type {
  AccountMeResult,
  AddWatchlistItemRequest,
  AdxPoint,
  AlertResult,
  AnomalyResult,
  BollingerBandPoint,
  CreateAlertRequest,
  CreateAlertResult,
  CreateWatchlistRequest,
  CrossPriceResult,
  CrossSymbolResult,
  DeleteAlertResult,
  FibonacciLevel,
  IndicatorPoint,
  InsightConfluenceResult,
  InsightNextResult,
  InsightScoreResult,
  InsightSetupResult,
  InsightTrendResult,
  LiquidityZonesResult,
  ListResult,
  MacdPoint,
  ManipulationRiskResult,
  MarketCalendarResult,
  MultiTimeframeResult,
  OrderFlowImbalanceResult,
  PagedResult,
  Price24hrResult,
  PriceCandleResult,
  PriceMarketResult,
  PriceTickerResult,
  ScreenerQueryRequest,
  ScreenerResult,
  SentimentResult,
  StochasticPoint,
  StopHuntZonesResult,
  StrategySignalResult,
  SupportResistanceResult,
  SymbolResult,
  VolatilityHeatmapPoint,
  VolatilityPoint,
  VolatilitySpikePoint,
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

  /**
   * Latest price of a cross pair not listed directly, derived from listed pairs
   * (e.g. `"XAUVND"` = XAUUSD × USDVND). Every leg must be on the key's plan. No high/low/volume.
   */
  async getCrossPrice(symbolCode: string, timeFrame: string): Promise<CrossPriceResult> {
    return this.get<CrossPriceResult>("/api/v1/price/cross", { symbolCode, timeFrame });
  }

  /** Latest price snapshot for every symbol on the key's plan. */
  async getMarketPrices(): Promise<ListResult<PriceMarketResult>> {
    return this.get<ListResult<PriceMarketResult>>("/api/v1/price/market");
  }

  /** Latest price snapshot for every symbol in a category (e.g. `"Forex"`, `"Crypto"`). */
  async getPriceByCategory(category: string): Promise<ListResult<PriceMarketResult>> {
    return this.get<ListResult<PriceMarketResult>>("/api/v1/price/category", { category });
  }

  /** Rolling 24-hour open/high/low/volume/change for every symbol on the key's plan. */
  async get24hrStats(): Promise<ListResult<Price24hrResult>> {
    return this.get<ListResult<Price24hrResult>>("/api/v1/price/24hr");
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

  /** Supported symbols, optionally filtered by market class (e.g. `"Forex"`). */
  async getSymbols(marketClass?: string): Promise<ListResult<SymbolResult>> {
    return this.get<ListResult<SymbolResult>>("/api/v1/symbol", marketClass ? { marketClass } : {});
  }

  /** Cross pairs `getCrossPrice` can derive, optionally filtered by base and/or quote currency (e.g. `"XAU"`, `"VND"`). */
  async getCrossSymbols(baseCurrency?: string, quoteCurrency?: string): Promise<ListResult<CrossSymbolResult>> {
    const query: Record<string, string> = {};
    if (baseCurrency) query.baseCurrency = baseCurrency;
    if (quoteCurrency) query.quoteCurrency = quoteCurrency;
    return this.get<ListResult<CrossSymbolResult>>("/api/v1/symbol/cross", query);
  }

  /** Plan, quota usage and limits for the API key. */
  async getMe(): Promise<AccountMeResult> {
    return this.get<AccountMeResult>("/api/v1/me");
  }

  async getSma(symbolCode: string, timeFrame: string, period = 20): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/sma", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getEma(symbolCode: string, timeFrame: string, period = 20): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/ema", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getWma(symbolCode: string, timeFrame: string, period = 20): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/wma", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getRsi(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/rsi", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getMacd(symbolCode: string, timeFrame: string, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): Promise<ListResult<MacdPoint>> {
    return this.get<ListResult<MacdPoint>>("/api/v1/indicator/macd", {
      symbolCode,
      timeFrame,
      fastPeriod: String(fastPeriod),
      slowPeriod: String(slowPeriod),
      signalPeriod: String(signalPeriod)
    });
  }

  async getSupportResistance(symbolCode: string, timeFrame: string): Promise<SupportResistanceResult> {
    return this.get<SupportResistanceResult>("/api/v1/indicator/support-resistance", {
      symbolCode,
      timeFrame
    });
  }

  async getFibonacci(symbolCode: string, timeFrame: string, lookback = 100): Promise<ListResult<FibonacciLevel>> {
    return this.get<ListResult<FibonacciLevel>>("/api/v1/indicator/fibonacci", {
      symbolCode,
      timeFrame,
      lookback: String(lookback)
    });
  }

  async getBollingerBands(symbolCode: string, timeFrame: string, period = 20, multiplier = 2): Promise<ListResult<BollingerBandPoint>> {
    return this.get<ListResult<BollingerBandPoint>>("/api/v1/indicator/bollinger-bands", {
      symbolCode,
      timeFrame,
      period: String(period),
      multiplier: String(multiplier)
    });
  }

  async getStochastic(symbolCode: string, timeFrame: string, kPeriod = 14, dPeriod = 3): Promise<ListResult<StochasticPoint>> {
    return this.get<ListResult<StochasticPoint>>("/api/v1/indicator/stochastic", {
      symbolCode,
      timeFrame,
      kPeriod: String(kPeriod),
      dPeriod: String(dPeriod)
    });
  }

  async getAtr(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/atr", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getCci(symbolCode: string, timeFrame: string, period = 20): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/cci", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getWilliamsR(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<IndicatorPoint>> {
    return this.get<ListResult<IndicatorPoint>>("/api/v1/indicator/williams-r", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getAdx(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<AdxPoint>> {
    return this.get<ListResult<AdxPoint>>("/api/v1/indicator/adx", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getSentiment(symbolCode: string, timeFrame: string): Promise<SentimentResult> {
    return this.get<SentimentResult>("/api/v1/indicator/sentiment", {
      symbolCode,
      timeFrame
    });
  }

  async getVolatility(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<VolatilityPoint>> {
    return this.get<ListResult<VolatilityPoint>>("/api/v1/volatility", {
      symbolCode,
      timeFrame,
      period: String(period)
    });
  }

  async getVolatilitySpikes(symbolCode: string, timeFrame: string, period = 14, spikeMultiplier = 2): Promise<ListResult<VolatilitySpikePoint>> {
    return this.get<ListResult<VolatilitySpikePoint>>("/api/v1/volatility/spikes", {
      symbolCode,
      timeFrame,
      period: String(period),
      spikeMultiplier: String(spikeMultiplier)
    });
  }

  async getVolatilityHeatmap(symbolCode: string, timeFrame: string): Promise<ListResult<VolatilityHeatmapPoint>> {
    return this.get<ListResult<VolatilityHeatmapPoint>>("/api/v1/volatility/heatmap", {
      symbolCode,
      timeFrame
    });
  }

  async getAnomaly(symbolCode: string, timeFrame: string): Promise<AnomalyResult> {
    return this.get<AnomalyResult>("/api/v1/anomaly", {
      symbolCode,
      timeFrame
    });
  }

  async getLiquidityZones(symbolCode: string, timeFrame: string): Promise<LiquidityZonesResult> {
    return this.get<LiquidityZonesResult>("/api/v1/liquidity/zones", {
      symbolCode,
      timeFrame
    });
  }

  async getManipulationRisk(symbolCode: string, timeFrame: string): Promise<ManipulationRiskResult> {
    return this.get<ManipulationRiskResult>("/api/v1/manipulation-risk", {
      symbolCode,
      timeFrame
    });
  }

  async getOrderFlowImbalance(symbolCode: string, timeFrame: string): Promise<OrderFlowImbalanceResult> {
    return this.get<OrderFlowImbalanceResult>("/api/v1/orderflow/imbalance", {
      symbolCode,
      timeFrame
    });
  }

  async getStopHuntZones(symbolCode: string, timeFrame: string): Promise<StopHuntZonesResult> {
    return this.get<StopHuntZonesResult>("/api/v1/stop-hunt/zones", {
      symbolCode,
      timeFrame
    });
  }

  /** Trend label per timeframe for one symbol. */
  async getMultiTimeframe(symbolCode: string): Promise<MultiTimeframeResult> {
    return this.get<MultiTimeframeResult>("/api/v1/multi-timeframe", { symbolCode });
  }

  async getInsightNext(symbolCode: string, timeFrame: string): Promise<InsightNextResult> {
    return this.get<InsightNextResult>("/api/v1/insight/next", {
      symbolCode,
      timeFrame
    });
  }

  async getInsightTrend(symbolCode: string, timeFrame: string): Promise<InsightTrendResult> {
    return this.get<InsightTrendResult>("/api/v1/insight/trend", {
      symbolCode,
      timeFrame
    });
  }

  async getInsightSetup(symbolCode: string, timeFrame: string): Promise<InsightSetupResult> {
    return this.get<InsightSetupResult>("/api/v1/insight/setup", {
      symbolCode,
      timeFrame
    });
  }

  async getInsightConfluence(symbolCode: string, timeFrame: string): Promise<InsightConfluenceResult> {
    return this.get<InsightConfluenceResult>("/api/v1/insight/confluence", {
      symbolCode,
      timeFrame
    });
  }

  async getInsightScore(symbolCode: string, timeFrame: string): Promise<InsightScoreResult> {
    return this.get<InsightScoreResult>("/api/v1/insight/score", {
      symbolCode,
      timeFrame
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
