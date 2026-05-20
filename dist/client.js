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
    async get(path, query = {}) {
        const params = new URLSearchParams({ apiKey: this.apiKey, ...query });
        const response = await this.fetchImpl(`${this.baseUrl}${path}?${params.toString()}`);
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`RealMarketApi error ${response.status}: ${body}`);
        }
        return (await response.json());
    }
}
