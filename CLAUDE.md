# RealMarketAPI JavaScript SDK (beta)

TypeScript SDK for RealMarketAPI, published to npm as `realmarketapi-js-sdk-beta`. ESM only (`"type": "module"`, `NodeNext`), Node 18+, one runtime dependency (`ws`).

## Commands

```bash
npm ci
npm run build      # tsc → dist/ (dist is what gets published)
npm test           # build, then node --test (test/*.test.mjs run against dist/)
```

No linter. Tests use a fake `fetchImpl` for REST and a local `ws` server for streams; add a row to the case table in `test/client.test.mjs` or `test/websocket.test.mjs` for each new method.

## Layout

| File | What |
|---|---|
| `src/client.ts` | `RealMarketApiClient`: one `async` method per REST endpoint, plus private `get/post/delete` helpers that add `apiKey` to the query and throw `Error("RealMarketApi error <status>: <body>")` on non-2xx. |
| `src/websocket.ts` | `RealMarketApiWebSocket`: `streamPrice`, `streamCandles`, `streamOrderFlowImbalance`, `streamMultiTimeframe`, `streamMarket` with auto-reconnect; returns an unsubscribe function. |
| `src/types.ts` | All request/response interfaces (camelCase, matching the API JSON). |
| `src/index.ts` | Re-exports the three files. |

Coverage matches the .NET SDK (`../RealMarketAPI.Sdk`), which stays the reference, except its MCP client. Types in `src/types.ts` follow the backend responses; where the .NET models drift from the backend (e.g. `PriceMarketResult.historyPrices`, nullable limits on `AccountMeResult`), the backend wins.

## Conventions

- Relative imports use the `.js` extension (`from "./types.js"`), required by NodeNext.
- Paths are absolute from the base URL: `"/api/v1/price"`. Query values are strings (`String(period)`).
- Method names are camelCase verbs matching the .NET SDK where possible (`getPrice`, `getCandles`, `createAlert`).
- Default base URL `https://api.realmarketapi.com`; options allow `baseUrl` and `fetchImpl`.

## Releasing

Version in `package.json` must contain `-beta` (e.g. `0.1.0-beta.3`). Pushing the tag `js-sdk-v<version>` runs `.github/workflows/publish-npm-beta.yml`, which publishes with `--tag beta`. Never tag or push without the user asking. Skill: `add-sdk-method`.
