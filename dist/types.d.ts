export interface ListResult<T> {
    data: T[];
    totalCount: number;
}
export interface PagedResult<T> extends ListResult<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
}
export interface PriceTickerResult {
    symbolCode: string;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    openTime: string;
    bid: number;
    ask: number;
}
/**
 * Latest price of a cross pair not listed directly, derived from listed pairs
 * (e.g. XAUVND = XAUUSD × USDVND, VNDUSD = 1 / USDVND). No high, low or volume.
 */
export interface CrossPriceResult {
    symbolCode: string;
    baseCurrency: string;
    quoteCurrency: string;
    timeFrame: string;
    bid: number;
    ask: number;
    openPrice: number;
    closePrice: number;
    /** Open time of the oldest leg's candle: the cross is only as fresh as its stalest leg. */
    openTime: string;
    /** The listed symbols used, in order; multiplying their prices gives the cross. */
    legs: CrossPriceLeg[];
}
export interface CrossPriceLeg {
    symbolCode: string;
    from: string;
    to: string;
    /** `true` when the listed symbol is To/From and was flipped (1 / price). */
    inverted: boolean;
    bid: number;
    ask: number;
    openPrice: number;
    closePrice: number;
    openTime: string;
}
export interface PriceCandleResult {
    symbolCode: string;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    openTime: string;
}
export interface PriceMarketResult {
    symbolCode: string;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    historyVolumes: number[];
    historyPrices?: number[];
    hourlyChangePercent: number;
    dailyChangePercent: number;
}
export interface Price24hrResult {
    symbolCode: string;
    openPrice24h: number;
    closePrice: number;
    highPrice24h: number;
    lowPrice24h: number;
    volume24h: number;
    changePercent24h: number;
    openTime: string;
}
export interface SymbolResult {
    symbolCode: string;
    displayName: string;
    marketClass: string;
}
/** A cross pair `getCrossPrice` can derive. */
export interface CrossSymbolResult {
    /** e.g. `"XAUVND"`. */
    symbolCode: string;
    /** e.g. `"XAU/VND"`. */
    displayName: string;
    baseCurrency: string;
    quoteCurrency: string;
    /** The listed symbols it is built from, e.g. `["XAUUSD", "USDVND"]`. */
    legs: string[];
}
export interface AccountMeResult {
    planCode: string;
    requestCount: number;
    /** `null` when the plan has no request limit. */
    requestLimit: number | null;
    usagePercentage: number;
    isSocketSupport: boolean;
    /** `null` when the plan has no concurrent WebSocket limit. */
    webSocketConcurrentLimit: number | null;
    historicalRangeMonth: number;
}
export interface IndicatorPoint {
    openTime: string;
    value: number;
}
export interface MacdPoint {
    openTime: string;
    macd: number;
    signal: number;
    histogram: number;
}
export interface BollingerBandPoint {
    openTime: string;
    upper: number;
    middle: number;
    lower: number;
}
export interface StochasticPoint {
    openTime: string;
    k: number;
    d: number;
}
export interface AdxPoint {
    openTime: string;
    adx: number;
    plusDI: number;
    minusDI: number;
}
export interface FibonacciLevel {
    ratio: number;
    price: number;
}
export interface SupportResistanceLevel {
    price: number;
    touchCount: number;
    lastTouchedAt: string;
}
export interface SupportResistanceResult {
    symbolCode: string;
    timeFrame: string;
    supports: SupportResistanceLevel[];
    resistances: SupportResistanceLevel[];
}
export interface SentimentResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    trend: string;
    sentiment: string;
    fearGreedScore: number;
    rsi: number;
    macdHistogram: number;
    ema50: number;
    ema100: number;
    currentClose: number;
}
export interface VolatilityPoint {
    openTime: string;
    atr: number;
    atrPercent: number;
    bandWidth: number;
    historicalVolatility: number;
}
export interface VolatilitySpikePoint {
    openTime: string;
    atr: number;
    atrAverage: number;
    multiplierReached: number;
    direction: string;
}
export interface VolatilityHeatmapPoint {
    dayOfWeek: string;
    hour: number;
    avgRange: number;
    intensity: number;
}
export interface AnomalyItem {
    openTime: string;
    type: string;
    description: string;
    value: number;
    threshold: number;
}
export interface AnomalyResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    hasAnomalies: boolean;
    anomalies: AnomalyItem[];
}
export interface LiquidityZone {
    price: number;
    type: string;
    touchCount: number;
    lastTouchedAt: string;
    strength: string;
}
export interface LiquidityZonesResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    currentPrice: number;
    zones: LiquidityZone[];
}
export interface ManipulationRiskResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    riskLevel: string;
    riskScore: number;
    factors: string[];
    avgWickToBodyRatio: number;
    currentVolume: number;
    avgVolume: number;
}
export interface MultiTimeframeResult {
    symbolCode: string;
    calculatedAt: string;
    /** Timeframe code (e.g. `"H1"`) → trend label. */
    timeframes: Record<string, string>;
}
export interface ImbalanceZone {
    openTime: string;
    open: number;
    close: number;
    direction: string;
    bodyMultiplier: number;
    volume: number;
}
export interface OrderFlowImbalanceResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    currentImbalance: string;
    bullishRatio: number;
    bearishRatio: number;
    recentImbalanceZones: ImbalanceZone[];
}
export interface StopHuntZone {
    price: number;
    type: string;
    description: string;
    recentlyHunted: boolean;
    huntedAt?: string | null;
}
export interface StopHuntZonesResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    currentPrice: number;
    zones: StopHuntZone[];
}
export interface InsightSignal {
    name: string;
    direction: string;
}
export interface InsightNextResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    price: number;
    ema21: number;
    ema50: number;
    rsi: number;
    atr: number;
    volume: number;
    avgVolume: number;
    support: number;
    resistance: number;
    bias: string;
    bullScore: number;
    bearScore: number;
    targetUp: number;
    targetDown: number;
    signals: InsightSignal[];
}
export interface InsightTrendResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    trend: string;
    description: string;
    adx: number;
    ema21: number;
    ema50: number;
    price: number;
}
export interface InsightSetupResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    setup: string;
    direction: string;
    description: string;
    price: number;
    nearestSupport: number;
    nearestResistance: number;
}
export interface InsightConfluenceResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    signal: string;
    strength: string;
    score: number;
    reasons: string[];
    rsi: number;
    ema21: number;
    ema50: number;
    price: number;
    nearestSupport: number;
    nearestResistance: number;
}
export interface InsightScoreResult {
    symbolCode: string;
    timeFrame: string;
    calculatedAt: string;
    score: number;
    label: string;
    rsi: number;
    macdHistogram: number;
    adx: number;
    price: number;
    ema21: number;
    ema50: number;
    factors: string[];
}
export interface CreateAlertRequest {
    symbolCode: string;
    timeFrame: string;
    ruleType: string;
    threshold: number;
    cooldownSeconds?: number;
    channels?: string[];
}
export interface CreateAlertResult {
    alertId: string;
    status: string;
    createdDate: string;
}
export interface AlertResult {
    alertId: string;
    symbolCode: string;
    timeFrame: string;
    ruleType: string;
    threshold: number;
    status: string;
    createdDate: string;
}
export interface DeleteAlertResult {
    alertId: string;
    deleted: boolean;
}
export interface ScreenerQueryRequest {
    timeFrame: string;
    trend?: string;
    minRsi?: number;
    maxVolatilityPct?: number;
    minLiquidityScore?: number;
    sortField?: string;
    sortDirection?: "Asc" | "Desc" | "asc" | "desc";
    size?: number;
}
export interface ScreenerResult {
    symbolCode: string;
    trend: string;
    signalScore: number;
    rsi: number;
    volatilityPct: number;
    liquidityScore: number;
}
export interface StrategySignalResult {
    symbolCode: string;
    timeFrame: string;
    signal: string;
    confidence: number;
    riskLevel: string;
    invalidationPrice: number;
    reasons: string[];
}
export interface CreateWatchlistRequest {
    name: string;
    tags?: string[];
    notes?: string;
}
export interface WatchlistResult {
    watchlistId: string;
    name: string;
    tags: string[];
    itemCount?: number;
}
export interface AddWatchlistItemRequest {
    symbolCode: string;
    order?: number;
}
export interface WatchlistItemResult {
    watchlistId: string;
    symbolCode: string;
    order: number;
}
export interface MarketSessionResult {
    market: string;
    openUtc: string;
    closeUtc: string;
}
export interface MarketEventResult {
    title: string;
    impact: string;
    timeUtc: string;
}
export interface MarketCalendarResult {
    date: string;
    sessions: MarketSessionResult[];
    events: MarketEventResult[];
}
