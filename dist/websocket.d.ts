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
    streamPrice<T>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void;
    streamCandles<T>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void;
    private stream;
    private toWebSocketUrl;
}
