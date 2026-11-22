import WebSocket from "ws";
export class RealMarketApiWebSocket {
    apiKey;
    baseUrl;
    reconnectDelayMs;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.baseUrl = (options.baseUrl ?? "https://api.realmarketapi.com").replace(/\/$/, "");
        this.reconnectDelayMs = options.reconnectDelayMs ?? 2000;
    }
    streamPrice(symbolCode, timeFrame, handlers) {
        return this.stream("price", { symbolCode, timeFrame }, handlers);
    }
    streamCandles(symbolCode, timeFrame, handlers) {
        return this.stream("candles", { symbolCode, timeFrame }, handlers);
    }
    streamOrderFlowImbalance(symbolCode, timeFrame, handlers) {
        return this.stream("orderflow/imbalance", { symbolCode, timeFrame }, handlers);
    }
    streamMultiTimeframe(symbolCode, handlers) {
        return this.stream("multi-timeframe", { symbolCode }, handlers);
    }
    /** Each message is a snapshot array covering every symbol on the key's plan. */
    streamMarket(handlers) {
        return this.stream("market", {}, handlers);
    }
    stream(endpoint, params, handlers) {
        let closedByUser = false;
        let socket = null;
        const connect = () => {
            const query = new URLSearchParams({ apiKey: this.apiKey, ...params });
            const wsUrl = this.toWebSocketUrl(endpoint, query);
            socket = new WebSocket(wsUrl);
            socket.on("open", () => handlers.onOpen?.());
            socket.on("message", data => {
                try {
                    handlers.onMessage(JSON.parse(data.toString()));
                }
                catch (error) {
                    handlers.onError?.(error);
                }
            });
            socket.on("error", error => handlers.onError?.(error));
            socket.on("close", () => {
                handlers.onClose?.();
                if (!closedByUser) {
                    setTimeout(connect, this.reconnectDelayMs);
                }
            });
        };
        connect();
        return () => {
            closedByUser = true;
            socket?.close();
        };
    }
    toWebSocketUrl(endpoint, query) {
        const normalized = new URL(this.baseUrl);
        const wsProtocol = normalized.protocol === "https:" ? "wss:" : "ws:";
        return `${wsProtocol}//${normalized.host}/${endpoint}?${query.toString()}`;
    }
}
