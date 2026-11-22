# Changelog

All notable changes to `realmarketapi-js-sdk-beta` are listed here.

## Unreleased

REST and WebSocket coverage now matches the .NET SDK (`RealMarketAPI.Sdk`), except the MCP client.

### Added
- Prices: `getMarketPrices()`, `getPriceByCategory(category)`, `get24hrStats()`.
- Cross rates: `getCrossPrice(symbolCode, timeFrame)` (`GET /api/v1/price/cross`) and `getCrossSymbols(baseCurrency?, quoteCurrency?)` (`GET /api/v1/symbol/cross`) for pairs derived from listed ones, e.g. XAUVND = XAUUSD × USDVND.
- Account: `getMe()`.
- Indicators: `getEma`, `getWma`, `getRsi`, `getMacd`, `getBollingerBands`, `getStochastic`, `getAtr`, `getCci`, `getWilliamsR`, `getAdx`, `getFibonacci`, `getSupportResistance`, `getSentiment`.
- Volatility: `getVolatility`, `getVolatilitySpikes`, `getVolatilityHeatmap`.
- Market analysis: `getAnomaly`, `getLiquidityZones`, `getManipulationRisk`, `getOrderFlowImbalance`, `getStopHuntZones`, `getMultiTimeframe`.
- Insight: `getInsightNext`, `getInsightTrend`, `getInsightSetup`, `getInsightConfluence`, `getInsightScore`.
- `getSymbols(marketClass?)` accepts an optional market class filter.
- WebSocket: `streamOrderFlowImbalance`, `streamMultiTimeframe`, `streamMarket`. Stream methods now default their message type (e.g. `streamPrice` → `PriceTickerResult`).
- Response types for all of the above, exported from the package.
- Test suite (`npm test`, Node's built-in test runner).

### Fixed
- Types now match what the API actually returns:
  - `ListResult` has `totalCount`.
  - `PagedResult` is `{ data, totalCount, currentPage, pageSize, totalPages }` (was `pageNumber` / `totalRecords`).
  - `PriceTickerResult` has `openPrice`, `highPrice`, `lowPrice`, `volume`, `bid`, `ask` (was `askPrice` / `bidPrice` / `timeFrame`).
  - `PriceCandleResult` has no `timeFrame`.
  - `SymbolResult` is `{ symbolCode, displayName, marketClass }` (was `name` / `category`).

  Runtime behaviour is unchanged; only TypeScript code that read the old, never-populated field names will need updating.

## 0.1.0-beta.2

- Price, candle, history, symbol, SMA, alerts, screener, strategy signal, watchlists and market calendar; price and candle WebSocket streams.
