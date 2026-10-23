# RealMarketAPI JavaScript SDK (beta)

TypeScript SDK for RealMarketAPI, published to npm as `realmarketapi-js-sdk-beta`. ESM only (`"type": "module"`, `NodeNext`), Node 18+, one runtime dependency (`ws`).

## Commands

```bash
npm ci
npm run build      # tsc → dist/ (dist is what gets published)
```

No tests or linter yet; `npm run build` with `strict` TypeScript is the check.

## Layout

| File | What |
|---|---|
| `src/client.ts` | `RealMarketApiClient`: one `async` method per REST endpoint, plus private `get/post/delete` helpers that add `apiKey` to the query and throw `Error("RealMarketApi error <status>: <body>")` on non-2xx. |
| `src/websocket.ts` | `RealMarketApiWebSocket`: `streamPrice` / `streamCandles` with auto-reconnect; returns an unsubscribe function. |
| `src/types.ts` | All request/response interfaces (camelCase, matching the API JSON). |
| `src/index.ts` | Re-exports the three files. |

Coverage is a **subset** of the API: price, candle, history, symbol, SMA, alerts, screener, strategy signal, watchlists, market calendar. The .NET SDK (`../RealMarketAPI.Sdk`) is the full reference.

## Conventions

- Relative imports use the `.js` extension (`from "./types.js"`), required by NodeNext.
- Paths are absolute from the base URL: `"/api/v1/price"`. Query values are strings (`String(period)`).
- Method names are camelCase verbs matching the .NET SDK where possible (`getPrice`, `getCandles`, `createAlert`).
- Default base URL `https://api.realmarketapi.com`; options allow `baseUrl` and `fetchImpl`.

## Releasing

Version in `package.json` must contain `-beta` (e.g. `0.1.0-beta.3`). Pushing the tag `js-sdk-v<version>` runs `.github/workflows/publish-npm-beta.yml`, which publishes with `--tag beta`. Never tag or push without the user asking. Skill: `add-sdk-method`.
