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

### Prices

#### `getPrice(symbolCode, timeFrame)`
- Returns latest ticker payload for one symbol/timeframe.

#### `getCrossPrice(symbolCode, timeFrame)`
- Latest price of a cross pair not listed directly, derived from listed pairs (e.g. `"XAUVND"` = XAUUSD × USDVND). Returns bid/ask/open/close plus the `legs` used; no high/low/volume.

#### `getMarketPrices()`
- Latest price snapshot for every symbol on your plan.

#### `getPriceByCategory(category)`
- Latest price snapshot for every symbol in a category (e.g. `"Forex"`, `"Crypto"`).

#### `get24hrStats()`
- Rolling 24-hour open/high/low/volume/change for every symbol on your plan.

#### `getCandles(symbolCode, timeFrame)`
- Returns latest candle array for one symbol/timeframe.

#### `getHistory(symbolCode, startTime, endTime, pageNumber?, pageSize?)`
- Returns paginated historical ticker data in the provided ISO 8601 time range.

#### `getSymbols(marketClass?)`
- Returns available symbols, optionally filtered by market class.

#### `getCrossSymbols(baseCurrency?, quoteCurrency?)`
- Cross pairs `getCrossPrice` can derive (e.g. `XAU/VND`), with the listed symbols each is built from.

### Account

#### `getMe()`
- Plan code, request count/limit, usage percentage and WebSocket limits for your API key.

### Indicators

#### `getSma(symbolCode, timeFrame, period?)`
- Returns SMA points for one symbol/timeframe.

All indicator methods take `(symbolCode, timeFrame, ...)`; defaults match the API.

| Method | Extra params (default) | Returns |
|---|---|---|
| `getEma` | `period` (20) | `ListResult<IndicatorPoint>` |
| `getWma` | `period` (20) | `ListResult<IndicatorPoint>` |
| `getRsi` | `period` (14) | `ListResult<IndicatorPoint>` |
| `getMacd` | `fastPeriod` (12), `slowPeriod` (26), `signalPeriod` (9) | `ListResult<MacdPoint>` |
| `getBollingerBands` | `period` (20), `multiplier` (2) | `ListResult<BollingerBandPoint>` |
| `getStochastic` | `kPeriod` (14), `dPeriod` (3) | `ListResult<StochasticPoint>` |
| `getAtr` | `period` (14) | `ListResult<IndicatorPoint>` |
| `getCci` | `period` (20) | `ListResult<IndicatorPoint>` |
| `getWilliamsR` | `period` (14) | `ListResult<IndicatorPoint>` |
| `getAdx` | `period` (14) | `ListResult<AdxPoint>` |
| `getFibonacci` | `lookback` (100) | `ListResult<FibonacciLevel>` |
| `getSupportResistance` | none | `SupportResistanceResult` |
| `getSentiment` | none | `SentimentResult` |

```ts
const macd = await client.getMacd("XAUUSD", "H1");
const bands = await client.getBollingerBands("BTCUSD", "M15", 20, 2.5);
```

### Volatility

| Method | Extra params (default) | Returns |
|---|---|---|
| `getVolatility(symbolCode, timeFrame, period?)` | `period` (14) | `ListResult<VolatilityPoint>` |
| `getVolatilitySpikes(symbolCode, timeFrame, period?, spikeMultiplier?)` | `period` (14), `spikeMultiplier` (2) | `ListResult<VolatilitySpikePoint>` |
| `getVolatilityHeatmap(symbolCode, timeFrame)` | none | `ListResult<VolatilityHeatmapPoint>` |

### Market analysis

| Method | Returns |
|---|---|
| `getAnomaly(symbolCode, timeFrame)` | `AnomalyResult` |
| `getLiquidityZones(symbolCode, timeFrame)` | `LiquidityZonesResult` |
| `getManipulationRisk(symbolCode, timeFrame)` | `ManipulationRiskResult` |
| `getOrderFlowImbalance(symbolCode, timeFrame)` | `OrderFlowImbalanceResult` |
| `getStopHuntZones(symbolCode, timeFrame)` | `StopHuntZonesResult` |
| `getMultiTimeframe(symbolCode)` | `MultiTimeframeResult` (trend per timeframe) |

### Insight

| Method | Returns |
|---|---|
| `getInsightNext(symbolCode, timeFrame)` | `InsightNextResult`: bias, bull/bear score, targets, signals |
| `getInsightTrend(symbolCode, timeFrame)` | `InsightTrendResult` |
| `getInsightSetup(symbolCode, timeFrame)` | `InsightSetupResult` |
| `getInsightConfluence(symbolCode, timeFrame)` | `InsightConfluenceResult` |
| `getInsightScore(symbolCode, timeFrame)` | `InsightScoreResult` (0–100 score and label) |

```ts
const next = await client.getInsightNext("XAUUSD", "H1");
console.log(next.bias, next.targetUp, next.targetDown);
```

### Alerts, screener, signals, watchlists, calendar

#### `createAlert(request)`
- Creates a new alert rule.

#### `getAlerts(status?)`
- Lists alert rules, optionally filtered by status.

#### `deleteAlert(alertId)`
- Deletes an alert rule by id.

#### `queryScreener(request)`
- Queries symbols by trend/volatility/momentum/liquidity filters.

#### `getStrategySignal(symbolCode, timeFrame)`
- Returns a composite strategy signal with confidence and risk level.

#### `createWatchlist(request)`
- Creates a cloud watchlist.

#### `getWatchlists()`
- Lists cloud watchlists.

#### `addWatchlistItem(watchlistId, request)`
- Adds a symbol to a watchlist.

#### `removeWatchlistItem(watchlistId, symbolCode)`
- Removes a symbol from a watchlist.

#### `getMarketCalendar(date?, timezone?)`
- Returns market sessions and high-impact events.

## WebSocket API Reference

### `streamPrice(symbolCode, timeFrame, handlers)`
- Streams live price updates.
- Returns a stop function `() => void`.

### `streamCandles(symbolCode, timeFrame, handlers)`
- Streams live candle updates.
- Returns a stop function `() => void`.

### `streamOrderFlowImbalance(symbolCode, timeFrame, handlers)`
- Streams `OrderFlowImbalanceResult` updates.

### `streamMultiTimeframe(symbolCode, handlers)`
- Streams `MultiTimeframeResult` updates.

### `streamMarket(handlers)`
- Streams `PriceMarketResult[]` snapshots for every symbol on your plan.

```ts
const stop = ws.streamMarket({
  onMessage: snapshot => console.log(snapshot.length, "symbols")
});
```

Handlers:
- `onMessage(message)` required.
- `onError(error)` optional.
- `onOpen()` optional.
- `onClose()` optional.

## Type Shapes

All interfaces are exported from the package (`import type { PriceTickerResult } from "realmarketapi-js-sdk-beta"`); see `src/types.ts` for the full list. The common ones:

```ts
type ListResult<T> = { data: T[]; totalCount: number };

type PagedResult<T> = ListResult<T> & {
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

type PriceTickerResult = {
  symbolCode: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  openTime: string;
  bid: number;
  ask: number;
};

type PriceCandleResult = {
  symbolCode: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  openTime: string;
};

type SymbolResult = {
  symbolCode: string;
  displayName: string;
  marketClass: string;
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

- REST scope matches the .NET SDK: prices (single, market, category, 24h), candles, history, symbols, account (`getMe`), all indicators, volatility, anomaly, liquidity, manipulation risk, order flow, stop hunt, multi-timeframe, insight, alerts, screener, strategy signal, watchlists and market calendar.
- WebSocket scope: price, candles, order flow imbalance, multi-timeframe and market, with automatic reconnect.
- Not included: the MCP client (use any MCP client against the RealMarketAPI MCP server).
- API surface may expand before stable `1.0`.

## Links

- Main site: https://realmarketapi.com/
- API base URL default: https://api.realmarketapi.com
