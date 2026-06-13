export interface ListResult<T> {
    data: T[];
}
export interface PagedResult<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}
export interface PriceTickerResult {
    symbolCode: string;
    timeFrame: string;
    openTime: string;
    closePrice: number;
    askPrice?: number;
    bidPrice?: number;
}
export interface PriceCandleResult {
    symbolCode: string;
    timeFrame: string;
    openTime: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    closePrice: number;
    volume: number;
}
export interface SymbolResult {
    symbolCode: string;
    name?: string;
    category?: string;
}
export interface IndicatorPoint {
    openTime: string;
    value: number;
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
