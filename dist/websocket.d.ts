import type { MultiTimeframeResult, OrderFlowImbalanceResult, PriceCandleResult, PriceMarketResult, PriceTickerResult } from "./types.js";
export interface WebSocketHandlers<T> {
    onMessage: (message: T) => void;
    onError?: (error: Error) => void;
    onOpen?: () => void;
    onClose?: () => void;
}
export interface RealMarketApiWebSocketOptions {
    apiKey: string;
    baseUrl?: string;
    reconnectDelayMs?: number;
}
export declare class RealMarketApiWebSocket {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly reconnectDelayMs;
    constructor(options: RealMarketApiWebSocketOptions);
    streamPrice<T = PriceTickerResult>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void;
    streamCandles<T = PriceCandleResult>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void;
    streamOrderFlowImbalance<T = OrderFlowImbalanceResult>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void;
    streamMultiTimeframe<T = MultiTimeframeResult>(symbolCode: string, handlers: WebSocketHandlers<T>): () => void;
    /** Each message is a snapshot array covering every symbol on the key's plan. */
    streamMarket<T = PriceMarketResult[]>(handlers: WebSocketHandlers<T>): () => void;
    private stream;
    private toWebSocketUrl;
}
