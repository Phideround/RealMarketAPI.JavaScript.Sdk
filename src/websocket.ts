import WebSocket from "ws";
import type {
  MultiTimeframeResult,
  OrderFlowImbalanceResult,
  PriceCandleResult,
  PriceMarketResult,
  PriceTickerResult
} from "./types.js";

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

export class RealMarketApiWebSocket {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly reconnectDelayMs: number;

  constructor(options: RealMarketApiWebSocketOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? "https://api.realmarketapi.com").replace(/\/$/, "");
    this.reconnectDelayMs = options.reconnectDelayMs ?? 2000;
  }

  streamPrice<T = PriceTickerResult>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void {
    return this.stream("price", { symbolCode, timeFrame }, handlers);
  }

  streamCandles<T = PriceCandleResult>(symbolCode: string, timeFrame: string, handlers: WebSocketHandlers<T>): () => void {
    return this.stream("candles", { symbolCode, timeFrame }, handlers);
  }

  streamOrderFlowImbalance<T = OrderFlowImbalanceResult>(
    symbolCode: string,
    timeFrame: string,
    handlers: WebSocketHandlers<T>
  ): () => void {
    return this.stream("orderflow/imbalance", { symbolCode, timeFrame }, handlers);
  }

  streamMultiTimeframe<T = MultiTimeframeResult>(symbolCode: string, handlers: WebSocketHandlers<T>): () => void {
    return this.stream("multi-timeframe", { symbolCode }, handlers);
  }

  /** Each message is a snapshot array covering every symbol on the key's plan. */
  streamMarket<T = PriceMarketResult[]>(handlers: WebSocketHandlers<T>): () => void {
    return this.stream("market", {}, handlers);
  }

  private stream<T>(
    endpoint: string,
    params: Record<string, string>,
    handlers: WebSocketHandlers<T>
  ): () => void {
    let closedByUser = false;
    let socket: WebSocket | null = null;

    const connect = () => {
      const query = new URLSearchParams({ apiKey: this.apiKey, ...params });
      const wsUrl = this.toWebSocketUrl(endpoint, query);

      socket = new WebSocket(wsUrl);

      socket.on("open", () => handlers.onOpen?.());
      socket.on("message", data => {
        try {
          handlers.onMessage(JSON.parse(data.toString()) as T);
        } catch (error) {
          handlers.onError?.(error as Error);
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

  private toWebSocketUrl(endpoint: string, query: URLSearchParams): string {
    const normalized = new URL(this.baseUrl);
    const wsProtocol = normalized.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${normalized.host}/${endpoint}?${query.toString()}`;
  }
}
