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
    /**
     * Latest price of a cross pair not listed directly, derived from listed pairs
     * (e.g. `"XAUVND"` = XAUUSD × USDVND). Every leg must be on the key's plan. No high/low/volume.
     */
    async getCrossPrice(symbolCode, timeFrame) {
        return this.get("/api/v1/price/cross", { symbolCode, timeFrame });
    }
    /** Latest price snapshot for every symbol on the key's plan. */
    async getMarketPrices() {
        return this.get("/api/v1/price/market");
    }
    /** Latest price snapshot for every symbol in a category (e.g. `"Forex"`, `"Crypto"`). */
    async getPriceByCategory(category) {
        return this.get("/api/v1/price/category", { category });
    }
    /** Rolling 24-hour open/high/low/volume/change for every symbol on the key's plan. */
    async get24hrStats() {
        return this.get("/api/v1/price/24hr");
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
    /** Supported symbols, optionally filtered by market class (e.g. `"Forex"`). */
    async getSymbols(marketClass) {
        return this.get("/api/v1/symbol", marketClass ? { marketClass } : {});
    }
    /** Cross pairs `getCrossPrice` can derive, optionally filtered by base and/or quote currency (e.g. `"XAU"`, `"VND"`). */
    async getCrossSymbols(baseCurrency, quoteCurrency) {
        const query = {};
        if (baseCurrency)
            query.baseCurrency = baseCurrency;
        if (quoteCurrency)
            query.quoteCurrency = quoteCurrency;
        return this.get("/api/v1/symbol/cross", query);
    }
    /** Plan, quota usage and limits for the API key. */
    async getMe() {
        return this.get("/api/v1/me");
    }
    async getSma(symbolCode, timeFrame, period = 20) {
        return this.get("/api/v1/indicator/sma", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getEma(symbolCode, timeFrame, period = 20) {
        return this.get("/api/v1/indicator/ema", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getWma(symbolCode, timeFrame, period = 20) {
        return this.get("/api/v1/indicator/wma", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getRsi(symbolCode, timeFrame, period = 14) {
        return this.get("/api/v1/indicator/rsi", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getMacd(symbolCode, timeFrame, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        return this.get("/api/v1/indicator/macd", {
            symbolCode,
            timeFrame,
            fastPeriod: String(fastPeriod),
            slowPeriod: String(slowPeriod),
            signalPeriod: String(signalPeriod)
        });
    }
    async getSupportResistance(symbolCode, timeFrame) {
        return this.get("/api/v1/indicator/support-resistance", {
            symbolCode,
            timeFrame
        });
    }
    async getFibonacci(symbolCode, timeFrame, lookback = 100) {
        return this.get("/api/v1/indicator/fibonacci", {
            symbolCode,
            timeFrame,
            lookback: String(lookback)
        });
    }
    async getBollingerBands(symbolCode, timeFrame, period = 20, multiplier = 2) {
        return this.get("/api/v1/indicator/bollinger-bands", {
            symbolCode,
            timeFrame,
            period: String(period),
            multiplier: String(multiplier)
        });
    }
    async getStochastic(symbolCode, timeFrame, kPeriod = 14, dPeriod = 3) {
        return this.get("/api/v1/indicator/stochastic", {
            symbolCode,
            timeFrame,
            kPeriod: String(kPeriod),
            dPeriod: String(dPeriod)
        });
    }
    async getAtr(symbolCode, timeFrame, period = 14) {
        return this.get("/api/v1/indicator/atr", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getCci(symbolCode, timeFrame, period = 20) {
        return this.get("/api/v1/indicator/cci", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getWilliamsR(symbolCode, timeFrame, period = 14) {
        return this.get("/api/v1/indicator/williams-r", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getAdx(symbolCode, timeFrame, period = 14) {
        return this.get("/api/v1/indicator/adx", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getSentiment(symbolCode, timeFrame) {
        return this.get("/api/v1/indicator/sentiment", {
            symbolCode,
            timeFrame
        });
    }
    async getVolatility(symbolCode, timeFrame, period = 14) {
        return this.get("/api/v1/volatility", {
            symbolCode,
            timeFrame,
            period: String(period)
        });
    }
    async getVolatilitySpikes(symbolCode, timeFrame, period = 14, spikeMultiplier = 2) {
        return this.get("/api/v1/volatility/spikes", {
            symbolCode,
            timeFrame,
            period: String(period),
            spikeMultiplier: String(spikeMultiplier)
        });
    }
    async getVolatilityHeatmap(symbolCode, timeFrame) {
        return this.get("/api/v1/volatility/heatmap", {
            symbolCode,
            timeFrame
        });
    }
    async getAnomaly(symbolCode, timeFrame) {
        return this.get("/api/v1/anomaly", {
            symbolCode,
            timeFrame
        });
    }
    async getLiquidityZones(symbolCode, timeFrame) {
        return this.get("/api/v1/liquidity/zones", {
            symbolCode,
            timeFrame
        });
    }
    async getManipulationRisk(symbolCode, timeFrame) {
        return this.get("/api/v1/manipulation-risk", {
            symbolCode,
            timeFrame
        });
    }
    async getOrderFlowImbalance(symbolCode, timeFrame) {
        return this.get("/api/v1/orderflow/imbalance", {
            symbolCode,
            timeFrame
        });
    }
    async getStopHuntZones(symbolCode, timeFrame) {
        return this.get("/api/v1/stop-hunt/zones", {
            symbolCode,
            timeFrame
        });
    }
    /** Trend label per timeframe for one symbol. */
    async getMultiTimeframe(symbolCode) {
        return this.get("/api/v1/multi-timeframe", { symbolCode });
    }
    async getInsightNext(symbolCode, timeFrame) {
        return this.get("/api/v1/insight/next", {
            symbolCode,
            timeFrame
        });
    }
    async getInsightTrend(symbolCode, timeFrame) {
        return this.get("/api/v1/insight/trend", {
            symbolCode,
            timeFrame
        });
    }
    async getInsightSetup(symbolCode, timeFrame) {
        return this.get("/api/v1/insight/setup", {
            symbolCode,
            timeFrame
        });
    }
    async getInsightConfluence(symbolCode, timeFrame) {
        return this.get("/api/v1/insight/confluence", {
            symbolCode,
            timeFrame
        });
    }
    async getInsightScore(symbolCode, timeFrame) {
        return this.get("/api/v1/insight/score", {
            symbolCode,
            timeFrame
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
