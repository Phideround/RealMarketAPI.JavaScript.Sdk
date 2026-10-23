---
name: add-sdk-method
description: Add a method to the RealMarketAPI JavaScript/TypeScript SDK for a backend endpoint. Use when the user wants the JS SDK to support a new or changed RealMarketAPI endpoint.
---

# Add an SDK method (JS/TS)

## 1. Get the contract
Prefer the .NET SDK as the reference (`../RealMarketAPI.Sdk/Clients/I<Area>Client.cs` and `Models/<Area>/`), since it documents the route and params. If it's not there yet, read the backend handler in `../RealTimeMarketAPI/sources/RealTimeMarketAPI.Core/Modules/`.

## 2. Types — `src/types.ts`
Add `export interface <Thing>Result { ... }` with camelCase fields (the API's JSON casing). Use `?` for nullable fields, `string` for timestamps. Reuse `ListResult<T>` / `PagedResult<T>`.

## 3. Method — `src/client.ts`
Import the new types at the top (type-only import list, keep it sorted), then add the method next to related ones:

```ts
async getVolatility(symbolCode: string, timeFrame: string, period = 14): Promise<ListResult<VolatilityPoint>> {
  return this.get<ListResult<VolatilityPoint>>("/api/v1/volatility", {
    symbolCode,
    timeFrame,
    period: String(period)
  });
}
```

- POST: `this.post<T>(path, body)`; DELETE: `this.delete<T>(path)`. `apiKey` is added by the helpers; never pass it yourself.
- Optional query params: only include them when set (see `getAlerts`).
- Defaults must match the backend.

## 4. Finish
- README: add an example.
- If preparing a release, bump `version` in `package.json` keeping `-beta.N`.
- `npm run build` must pass.
