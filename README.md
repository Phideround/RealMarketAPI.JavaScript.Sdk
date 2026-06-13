# RealMarketAPI JavaScript SDK (Beta)

Official beta JavaScript/TypeScript SDK for RealMarketAPI REST and WebSocket market data endpoints.

Website: https://realmarketapi.com/

## Install

```bash
npm install realmarketapi-js-sdk-beta
```

## Requirements

- Node.js 18+ (recommended).
- RealMarketAPI key.

## Quick Start

### REST

```ts
import { RealMarketApiClient } from "realmarketapi-js-sdk-beta";

const client = new RealMarketApiClient({
  apiKey: process.env.REALMARKET_API_KEY!
});

const price = await client.getPrice("EURUSD", "M1");
console.log(price.closePrice);
```

### WebSocket

```ts
import { RealMarketApiWebSocket } from "realmarketapi-js-sdk-beta";

const ws = new RealMarketApiWebSocket({
  apiKey: process.env.REALMARKET_API_KEY!
});

const stop = ws.streamPrice("BTCUSDT", "M1", {
  onOpen: () => console.log("connected"),
  onMessage: msg => console.log(msg),
  onError: err => console.error(err),
  onClose: () => console.log("closed")
});

setTimeout(() => stop(), 30_000);
```

## Client Configuration

### `RealMarketApiClient`

```ts
const client = new RealMarketApiClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.realmarketapi.com", // optional
  fetchImpl: fetch // optional custom fetch
});
```

Options:
- `apiKey` (required): your RealMarketAPI key.
- `baseUrl` (optional): defaults to `https://api.realmarketapi.com`.
- `fetchImpl` (optional): inject a custom fetch implementation.

### `RealMarketApiWebSocket`

```ts
const ws = new RealMarketApiWebSocket({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.realmarketapi.com", // optional
  reconnectDelayMs: 2000 // optional
});
```

Options:
- `apiKey` (required): your RealMarketAPI key.
- `baseUrl` (optional): defaults to `https://api.realmarketapi.com`.
- `reconnectDelayMs` (optional): reconnect delay after disconnect, default `2000` ms.

## REST API Reference

### `getPrice(symbolCode, timeFrame)`
- Returns latest ticker payload for one symbol/timeframe.

### `getCandles(symbolCode, timeFrame)`
- Returns latest candle array for one symbol/timeframe.

### `getHistory(symbolCode, startTime, endTime, pageNumber?, pageSize?)`
- Returns paginated historical ticker data in the provided ISO 8601 time range.

### `getSymbols()`
- Returns list of available symbols.

### `getSma(symbolCode, timeFrame, period?)`
- Returns SMA points for one symbol/timeframe.

### `createAlert(request)`
- Creates a new alert rule.

### `getAlerts(status?)`
- Lists alert rules, optionally filtered by status.

### `deleteAlert(alertId)`
- Deletes an alert rule by id.

### `queryScreener(request)`
- Queries symbols by trend/volatility/momentum/liquidity filters.

### `getStrategySignal(symbolCode, timeFrame)`
- Returns a composite strategy signal with confidence and risk level.

### `createWatchlist(request)`
- Creates a cloud watchlist.

### `getWatchlists()`
- Lists cloud watchlists.

### `addWatchlistItem(watchlistId, request)`
- Adds a symbol to a watchlist.

### `removeWatchlistItem(watchlistId, symbolCode)`
- Removes a symbol from a watchlist.

### `getMarketCalendar(date?, timezone?)`
- Returns market sessions and high-impact events.

## WebSocket API Reference

### `streamPrice(symbolCode, timeFrame, handlers)`
- Streams live price updates.
- Returns a stop function `() => void`.

### `streamCandles(symbolCode, timeFrame, handlers)`
- Streams live candle updates.
- Returns a stop function `() => void`.

Handlers:
- `onMessage(message)` required.
- `onError(error)` optional.
- `onOpen()` optional.
- `onClose()` optional.

## Type Shapes

```ts
type ListResult<T> = { data: T[] };

type PagedResult<T> = {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};

type PriceTickerResult = {
  symbolCode: string;
  timeFrame: string;
  openTime: string;
  closePrice: number;
  askPrice?: number;
  bidPrice?: number;
};

type PriceCandleResult = {
  symbolCode: string;
  timeFrame: string;
  openTime: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
};

type SymbolResult = {
  symbolCode: string;
  name?: string;
  category?: string;
};

type IndicatorPoint = {
  openTime: string;
  value: number;
};
```

## Error Handling

REST methods throw `Error` when the API response is not successful.

```ts
try {
  const data = await client.getSymbols();
  console.log(data.data.length);
} catch (error) {
  console.error("Request failed:", error);
}
```

## Beta Notes

- Current REST scope: price, candles, history, symbols, SMA.
- Expanded REST scope: alerts, screener, strategy signal, watchlist, and market calendar.
- Current WebSocket scope: price and candles with automatic reconnect.
- API surface may expand before stable `1.0`.

## Links

- Main site: https://realmarketapi.com/
- API base URL default: https://api.realmarketapi.com
