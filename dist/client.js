export class RealMarketApiClient {
    apiKey;
    baseUrl;
    fetchImpl;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.baseUrl = (options.baseUrl ?? "https://api.realmarketapi.com").replace(/\/$/, "");
        this.fetchImpl = options.fetchImpl ?? fetch;
    }
    async getPrice(symbolCode, timeFrame) {
        return this.get("/api/v1/price", { symbolCode, timeFrame });
    }
    async getCandles(symbolCode, timeFrame) {
        return this.get("/api/v1/candle", { symbolCode, timeFrame });
    }
    async getHistory(symbolCode, startTime, endTime, pageNumber = 1, pageSize = 20) {
        return this.get("/api/v1/history", {
            symbolCode,
            startTime,
            endTime,
            pageNumber: String(pageNumber),
            pageSize: String(pageSize)
        });
    }
    async getSymbols() {
        return this.get("/api/v1/symbol");
    }
    async getSma(symbolCode, timeFrame, period = 20) {
        return this.get("/api/v1/indicator/sma", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async createAlert(request) {
        return this.post("/api/v1/alerts", request);
    }
    async getAlerts(status) {
        return this.get("/api/v1/alerts", status ? { status } : {});
    }
    async deleteAlert(alertId) {
        return this.delete(`/api/v1/alerts/${encodeURIComponent(alertId)}`);
    }
    async queryScreener(request) {
        return this.post("/api/v1/screener/query", request);
    }
    async getStrategySignal(symbolCode, timeFrame) {
        return this.get("/api/v1/signals/strategy", { symbolCode, timeFrame });
    }
    async createWatchlist(request) {
        return this.post("/api/v1/watchlists", request);
    }
    async getWatchlists() {
        return this.get("/api/v1/watchlists");
    }
    async addWatchlistItem(watchlistId, request) {
        return this.post(`/api/v1/watchlists/${encodeURIComponent(watchlistId)}/items`, request);
    }
    async removeWatchlistItem(watchlistId, symbolCode) {
        await this.delete(`/api/v1/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(symbolCode)}`);
    }
    async getMarketCalendar(date, timezone = "UTC") {
        const query = { timezone };
        if (date) {
            query.date = date;
        }
        return this.get("/api/v1/market-calendar", query);
    }
    async get(path, query = {}) {
        const params = new URLSearchParams({ apiKey: this.apiKey, ...query });
        const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`);
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`RealMarketApi error ${response.status}: ${body}`);
        }
        return (await response.json());
    }
    async post(path, body) {
        const params = new URLSearchParams({ apiKey: this.apiKey });
        const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`RealMarketApi error ${response.status}: ${text}`);
        }
        return (await response.json());
    }
    async delete(path) {
        const params = new URLSearchParams({ apiKey: this.apiKey });
        const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`RealMarketApi error ${response.status}: ${text}`);
        }
        return (await response.json());
    }
}
