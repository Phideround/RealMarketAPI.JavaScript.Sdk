import type { IndicatorPoint, ListResult, PagedResult, PriceCandleResult, PriceTickerResult, SymbolResult } from "./types.js";
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
    private get;
}
