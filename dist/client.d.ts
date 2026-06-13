import type { AddWatchlistItemRequest, AlertResult, CreateAlertRequest, CreateAlertResult, CreateWatchlistRequest, DeleteAlertResult, IndicatorPoint, ListResult, MarketCalendarResult, PagedResult, PriceCandleResult, PriceTickerResult, ScreenerQueryRequest, ScreenerResult, SymbolResult, StrategySignalResult, WatchlistItemResult, WatchlistResult } from "./types.js";
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
    getCandles(symbolCode: string, timeFrame: string): Promise<ListResult<PriceCandleResult>>;
    getHistory(symbolCode: string, startTime: string, endTime: string, pageNumber?: number, pageSize?: number): Promise<PagedResult<PriceTickerResult>>;
    getSymbols(): Promise<ListResult<SymbolResult>>;
    getSma(symbolCode: string, timeFrame: string, period?: number): Promise<ListResult<IndicatorPoint>>;
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
