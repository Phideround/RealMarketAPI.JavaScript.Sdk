import type { AccountMeResult, AddWatchlistItemRequest, AdxPoint, AlertResult, AnomalyResult, BollingerBandPoint, CreateAlertRequest, CreateAlertResult, CreateWatchlistRequest, CrossPriceResult, CrossSymbolResult, DeleteAlertResult, FibonacciLevel, IndicatorPoint, InsightConfluenceResult, InsightNextResult, InsightScoreResult, InsightSetupResult, InsightTrendResult, LiquidityZonesResult, ListResult, MacdPoint, ManipulationRiskResult, MarketCalendarResult, MultiTimeframeResult, OrderFlowImbalanceResult, PagedResult, Price24hrResult, PriceCandleResult, PriceMarketResult, PriceTickerResult, ScreenerQueryRequest, ScreenerResult, SentimentResult, StochasticPoint, StopHuntZonesResult, StrategySignalResult, SupportResistanceResult, SymbolResult, VolatilityHeatmapPoint, VolatilityPoint, VolatilitySpikePoint, WatchlistItemResult, WatchlistResult } from "./types.js";
export interface RealMarketApiClientOptions {
    apiKey: string;
    baseUrl?: string;
    fetchImpl?: typeof fetch;
}
export declare class RealMarketApiClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly fetchImpl;
    constructor(options: RealMarketApiClientOptions);
    getPrice(symbolCode: string, timeFrame: string): Promise<PriceTickerResult>;
    /**
     * Latest price of a cross pair not listed directly, derived from listed pairs
     * (e.g. `"XAUVND"` = XAUUSD × USDVND). Every leg must be on the key's plan. No high/low/volume.
     */
    getCrossPrice(symbolCode: string, timeFrame: string): Promise<CrossPriceResult>;
    /** Latest price snapshot for every symbol on the key's plan. */
    getMarketPrices(): Promise<ListResult<PriceMarketResult>>;
    /** Latest price snapshot for every symbol in a category (e.g. `"Forex"`, `"Crypto"`). */
    getPriceByCategory(category: string): Promise<ListResult<PriceMarketResult>>;
    /** Rolling 24-hour open/high/low/volume/change for every symbol on the key's plan. */
    get24hrStats(): Promise<ListResult<Price24hrResult>>;
    getCandles(symbolCode: string, timeFrame: string): Promise<ListResult<PriceCandleResult>>;
    getHistory(symbolCode: string, startTime: string, endTime: string, pageNumber?: number, pageSize?: number): Promise<PagedResult<PriceTickerResult>>;
    /** Supported symbols, optionally filtered by market class (e.g. `"Forex"`). */
    getSymbols(marketClass?: string): Promise<ListResult<SymbolResult>>;
    /** Cross pairs `getCrossPrice` can derive, optionally filtered by base and/or quote currency (e.g. `"XAU"`, `"VND"`). */
    getCrossSymbols(baseCurrency?: string, quoteCurrency?: string): Promise<ListResult<CrossSymbolResult>>;
    /** Plan, quota usage and limits for the API key. */
    getMe(): Promise<AccountMeResult>;
    getSma(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getEma(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getWma(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getRsi(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getMacd(symbolCode: string, timeFrame: string, fastPeriod?: number, slowPeriod?: number, signalPeriod?: number): Promise<ListResult<MacdPoint>>;
    getSupportResistance(symbolCode: string, timeFrame: string): Promise<SupportResistanceResult>;
    getFibonacci(symbolCode: string, timeFrame: string, lookback?: number): Promise<ListResult<FibonacciLevel>>;
    getBollingerBands(symbolCode: string, timeFrame: string, period?: number, multiplier?: number): Promise<ListResult<BollingerBandPoint>>;
    getStochastic(symbolCode: string, timeFrame: string, kPeriod?: number, dPeriod?: number): Promise<ListResult<StochasticPoint>>;
    getAtr(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getCci(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getWilliamsR(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
    getAdx(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<AdxPoint>>;
    getSentiment(symbolCode: string, timeFrame: string): Promise<SentimentResult>;
    getVolatility(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<VolatilityPoint>>;
    getVolatilitySpikes(symbolCode: string, timeFrame: string, period?: number, spikeMultiplier?: number): Promise<ListResult<VolatilitySpikePoint>>;
    getVolatilityHeatmap(symbolCode: string, timeFrame: string): Promise<ListResult<VolatilityHeatmapPoint>>;
    getAnomaly(symbolCode: string, timeFrame: string): Promise<AnomalyResult>;
    getLiquidityZones(symbolCode: string, timeFrame: string): Promise<LiquidityZonesResult>;
    getManipulationRisk(symbolCode: string, timeFrame: string): Promise<ManipulationRiskResult>;
    getOrderFlowImbalance(symbolCode: string, timeFrame: string): Promise<OrderFlowImbalanceResult>;
    getStopHuntZones(symbolCode: string, timeFrame: string): Promise<StopHuntZonesResult>;
    /** Trend label per timeframe for one symbol. */
    getMultiTimeframe(symbolCode: string): Promise<MultiTimeframeResult>;
    getInsightNext(symbolCode: string, timeFrame: string): Promise<InsightNextResult>;
    getInsightTrend(symbolCode: string, timeFrame: string): Promise<InsightTrendResult>;
    getInsightSetup(symbolCode: string, timeFrame: string): Promise<InsightSetupResult>;
    getInsightConfluence(symbolCode: string, timeFrame: string): Promise<InsightConfluenceResult>;
    getInsightScore(symbolCode: string, timeFrame: string): Promise<InsightScoreResult>;
    createAlert(request: CreateAlertRequest): Promise<CreateAlertResult>;
    getAlerts(status?: string): Promise<ListResult<AlertResult>>;
    deleteAlert(alertId: string): Promise<DeleteAlertResult>;
    queryScreener(request: ScreenerQueryRequest): Promise<ListResult<ScreenerResult>>;
    getStrategySignal(symbolCode: string, timeFrame: string): Promise<StrategySignalResult>;
    createWatchlist(request: CreateWatchlistRequest): Promise<WatchlistResult>;
    getWatchlists(): Promise<ListResult<WatchlistResult>>;
    addWatchlistItem(watchlistId: string, request: AddWatchlistItemRequest): Promise<WatchlistItemResult>;
    removeWatchlistItem(watchlistId: string, symbolCode: string): Promise<void>;
    getMarketCalendar(date?: string, timezone?: string): Promise<MarketCalendarResult>;
    private get;
    private post;
    private delete;
}
