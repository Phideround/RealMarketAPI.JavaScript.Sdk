import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { WebSocketServer } from "ws";
import { RealMarketApiWebSocket } from "../dist/index.js";

// Starts a local server, opens one stream, and returns the request URL and first message.
async function runStream(open, payload) {
  const server = new WebSocketServer({ port: 0 });
  await once(server, "listening");
  const { port } = server.address();

  const requestUrl = new Promise(resolve => {
    server.on("connection", (socket, request) => {
      resolve(new URL(request.url, `ws://127.0.0.1:${port}`));
      socket.send(JSON.stringify(payload));
    });
  });

  const ws = new RealMarketApiWebSocket({ apiKey: "key-123", baseUrl: `http://127.0.0.1:${port}` });
  let unsubscribe = () => {};
  const message = new Promise((resolve, reject) => {
    unsubscribe = open(ws, { onMessage: resolve, onError: reject });
  });

  try {
    return { url: await requestUrl, message: await message };
  } finally {
    unsubscribe();
    for (const client of server.clients) client.terminate();
    server.close();
  }
}

const CASES = [
  ["streamPrice", (ws, h) => ws.streamPrice("XAUUSD", "M1", h), "/price", { symbolCode: "XAUUSD", timeFrame: "M1" }, { closePrice: 1 }],
  ["streamCandles", (ws, h) => ws.streamCandles("XAUUSD", "M5", h), "/candles", { symbolCode: "XAUUSD", timeFrame: "M5" }, { openPrice: 1 }],
  [
    "streamOrderFlowImbalance",
    (ws, h) => ws.streamOrderFlowImbalance("XAUUSD", "H1", h),
    "/orderflow/imbalance",
    { symbolCode: "XAUUSD", timeFrame: "H1" },
    { currentImbalance: "Bullish" }
  ],
  [
    "streamMultiTimeframe",
    (ws, h) => ws.streamMultiTimeframe("BTCUSD", h),
    "/multi-timeframe",
    { symbolCode: "BTCUSD" },
    { timeframes: { H1: "Bullish" } }
  ],
  ["streamMarket", (ws, h) => ws.streamMarket(h), "/market", {}, [{ symbolCode: "XAUUSD", closePrice: 1 }]]
];

for (const [name, open, path, query, payload] of CASES) {
  test(`${name} connects to ${path} and parses messages`, async () => {
    const { url, message } = await runStream(open, payload);
    assert.equal(url.pathname, path);
    const params = Object.fromEntries(url.searchParams);
    assert.equal(params.apiKey, "key-123");
    delete params.apiKey;
    assert.deepEqual(params, query);
    assert.deepEqual(message, payload);
  });
}
