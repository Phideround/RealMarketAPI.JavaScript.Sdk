import { test } from "node:test";
import assert from "node:assert/strict";
import { RealMarketApiClient } from "../dist/index.js";

const BASE = "https://api.test.local";

function fakeFetch(responseBody = { data: [], totalCount: 0 }, status = 200) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url: new URL(url), init: init ?? {} });
    return new Response(typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };
  return { impl, calls };
}

function newClient(body, status) {
  const fetch = fakeFetch(body, status);
  const client = new RealMarketApiClient({ apiKey: "key-123", baseUrl: `${BASE}/`, fetchImpl: fetch.impl });
  return { client, calls: fetch.calls };
}

// [name, invoke, expected path, expected query (apiKey excluded)]
const GET_CASES = [
  ["getPrice", c => c.getPrice("XAUUSD", "M1"), "/api/v1/price", { symbolCode: "XAUUSD", timeFrame: "M1" }],
  ["getCrossPrice", c => c.getCrossPrice("XAUVND", "M1"), "/api/v1/price/cross", { symbolCode: "XAUVND", timeFrame: "M1" }],
  ["getMarketPrices", c => c.getMarketPrices(), "/api/v1/price/market", {}],
  ["getPriceByCategory", c => c.getPriceByCategory("Forex"), "/api/v1/price/category", { category: "Forex" }],
  ["get24hrStats", c => c.get24hrStats(), "/api/v1/price/24hr", {}],
  ["getCandles", c => c.getCandles("XAUUSD", "H1"), "/api/v1/candle", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  [
    "getHistory",
    c => c.getHistory("XAUUSD", "2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z"),
    "/api/v1/history",
    {
      symbolCode: "XAUUSD",
      startTime: "2026-01-01T00:00:00Z",
      endTime: "2026-01-02T00:00:00Z",
      pageNumber: "1",
      pageSize: "20"
    }
  ],
  ["getSymbols", c => c.getSymbols(), "/api/v1/symbol", {}],
  ["getSymbols(marketClass)", c => c.getSymbols("Crypto"), "/api/v1/symbol", { marketClass: "Crypto" }],
  ["getCrossSymbols", c => c.getCrossSymbols(), "/api/v1/symbol/cross", {}],
  [
    "getCrossSymbols(baseCurrency, quoteCurrency)",
    c => c.getCrossSymbols("XAU", "VND"),
    "/api/v1/symbol/cross",
    { baseCurrency: "XAU", quoteCurrency: "VND" }
  ],
  ["getMe", c => c.getMe(), "/api/v1/me", {}],
  ["getSma", c => c.getSma("XAUUSD", "H1"), "/api/v1/indicator/sma", { symbolCode: "XAUUSD", timeFrame: "H1", period: "20" }],
  ["getEma", c => c.getEma("XAUUSD", "H1", 50), "/api/v1/indicator/ema", { symbolCode: "XAUUSD", timeFrame: "H1", period: "50" }],
  ["getWma", c => c.getWma("XAUUSD", "H1"), "/api/v1/indicator/wma", { symbolCode: "XAUUSD", timeFrame: "H1", period: "20" }],
  ["getRsi", c => c.getRsi("XAUUSD", "H1"), "/api/v1/indicator/rsi", { symbolCode: "XAUUSD", timeFrame: "H1", period: "14" }],
  [
    "getMacd",
    c => c.getMacd("XAUUSD", "H1"),
    "/api/v1/indicator/macd",
    { symbolCode: "XAUUSD", timeFrame: "H1", fastPeriod: "12", slowPeriod: "26", signalPeriod: "9" }
  ],
  [
    "getSupportResistance",
    c => c.getSupportResistance("XAUUSD", "H1"),
    "/api/v1/indicator/support-resistance",
    { symbolCode: "XAUUSD", timeFrame: "H1" }
  ],
  ["getFibonacci", c => c.getFibonacci("XAUUSD", "H1"), "/api/v1/indicator/fibonacci", { symbolCode: "XAUUSD", timeFrame: "H1", lookback: "100" }],
  [
    "getBollingerBands",
    c => c.getBollingerBands("XAUUSD", "H1", 20, 2.5),
    "/api/v1/indicator/bollinger-bands",
    { symbolCode: "XAUUSD", timeFrame: "H1", period: "20", multiplier: "2.5" }
  ],
  [
    "getStochastic",
    c => c.getStochastic("XAUUSD", "H1"),
    "/api/v1/indicator/stochastic",
    { symbolCode: "XAUUSD", timeFrame: "H1", kPeriod: "14", dPeriod: "3" }
  ],
  ["getAtr", c => c.getAtr("XAUUSD", "H1"), "/api/v1/indicator/atr", { symbolCode: "XAUUSD", timeFrame: "H1", period: "14" }],
  ["getCci", c => c.getCci("XAUUSD", "H1"), "/api/v1/indicator/cci", { symbolCode: "XAUUSD", timeFrame: "H1", period: "20" }],
  ["getWilliamsR", c => c.getWilliamsR("XAUUSD", "H1"), "/api/v1/indicator/williams-r", { symbolCode: "XAUUSD", timeFrame: "H1", period: "14" }],
  ["getAdx", c => c.getAdx("XAUUSD", "H1"), "/api/v1/indicator/adx", { symbolCode: "XAUUSD", timeFrame: "H1", period: "14" }],
  ["getSentiment", c => c.getSentiment("XAUUSD", "H1"), "/api/v1/indicator/sentiment", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getVolatility", c => c.getVolatility("XAUUSD", "H1"), "/api/v1/volatility", { symbolCode: "XAUUSD", timeFrame: "H1", period: "14" }],
  [
    "getVolatilitySpikes",
    c => c.getVolatilitySpikes("XAUUSD", "H1"),
    "/api/v1/volatility/spikes",
    { symbolCode: "XAUUSD", timeFrame: "H1", period: "14", spikeMultiplier: "2" }
  ],
  ["getVolatilityHeatmap", c => c.getVolatilityHeatmap("XAUUSD", "H1"), "/api/v1/volatility/heatmap", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getAnomaly", c => c.getAnomaly("XAUUSD", "H1"), "/api/v1/anomaly", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getLiquidityZones", c => c.getLiquidityZones("XAUUSD", "H1"), "/api/v1/liquidity/zones", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getManipulationRisk", c => c.getManipulationRisk("XAUUSD", "H1"), "/api/v1/manipulation-risk", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getOrderFlowImbalance", c => c.getOrderFlowImbalance("XAUUSD", "H1"), "/api/v1/orderflow/imbalance", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getStopHuntZones", c => c.getStopHuntZones("XAUUSD", "H1"), "/api/v1/stop-hunt/zones", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getMultiTimeframe", c => c.getMultiTimeframe("XAUUSD"), "/api/v1/multi-timeframe", { symbolCode: "XAUUSD" }],
  ["getInsightNext", c => c.getInsightNext("XAUUSD", "H1"), "/api/v1/insight/next", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getInsightTrend", c => c.getInsightTrend("XAUUSD", "H1"), "/api/v1/insight/trend", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getInsightSetup", c => c.getInsightSetup("XAUUSD", "H1"), "/api/v1/insight/setup", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getInsightConfluence", c => c.getInsightConfluence("XAUUSD", "H1"), "/api/v1/insight/confluence", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getInsightScore", c => c.getInsightScore("XAUUSD", "H1"), "/api/v1/insight/score", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getAlerts", c => c.getAlerts("Active"), "/api/v1/alerts", { status: "Active" }],
  ["getStrategySignal", c => c.getStrategySignal("XAUUSD", "H1"), "/api/v1/signals/strategy", { symbolCode: "XAUUSD", timeFrame: "H1" }],
  ["getWatchlists", c => c.getWatchlists(), "/api/v1/watchlists", {}],
  ["getMarketCalendar", c => c.getMarketCalendar("2026-11-21"), "/api/v1/market-calendar", { timezone: "UTC", date: "2026-11-21" }]
];

for (const [name, invoke, path, query] of GET_CASES) {
  test(`${name} → GET ${path}`, async () => {
    const { client, calls } = newClient();
    await invoke(client);

    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    assert.equal(init.method ?? "GET", "GET");
    assert.equal(url.origin, BASE);
    assert.equal(url.pathname, path);

    const params = Object.fromEntries(url.searchParams);
    assert.equal(params.apiKey, "key-123");
    delete params.apiKey;
    assert.deepEqual(params, query);
  });
}

test("returns the parsed JSON body", async () => {
  const body = { symbolCode: "XAUUSD", calculatedAt: "2026-11-21T00:00:00Z", timeframes: { H1: "Bullish" } };
  const { client } = newClient(body);
  assert.deepEqual(await client.getMultiTimeframe("XAUUSD"), body);
});

test("POST methods send a JSON body and apiKey in the query", async () => {
  const { client, calls } = newClient({ alertId: "a1", status: "Active", createdDate: "2026-11-21T00:00:00Z" });
  const request = { symbolCode: "XAUUSD", timeFrame: "M5", ruleType: "PriceAbove", threshold: 2500 };
  await client.createAlert(request);

  const { url, init } = calls[0];
  assert.equal(init.method, "POST");
  assert.equal(url.pathname, "/api/v1/alerts");
  assert.equal(url.searchParams.get("apiKey"), "key-123");
  assert.deepEqual(JSON.parse(init.body), request);
});

test("DELETE escapes path segments", async () => {
  const { client, calls } = newClient({ alertId: "a/1", deleted: true });
  await client.deleteAlert("a/1");
  assert.equal(calls[0].init.method, "DELETE");
  assert.equal(calls[0].url.pathname, "/api/v1/alerts/a%2F1");
});

test("non-2xx responses throw with status and body", async () => {
  const problem = { errors: [{ errorCode: "ERR_0005_INVALID_API_KEY" }] };
  const { client } = newClient(problem, 401);
  await assert.rejects(client.getInsightScore("XAUUSD", "H1"), err => {
    assert.match(err.message, /^RealMarketApi error 401: /);
    assert.match(err.message, /ERR_0005_INVALID_API_KEY/);
    return true;
  });
});
