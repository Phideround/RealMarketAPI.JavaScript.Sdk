export interface ListResult<T> {
  data: T[];
}

export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface PriceTickerResult {
  symbolCode: string;
  timeFrame: string;
  openTime: string;
  closePrice: number;
  askPrice?: number;
  bidPrice?: number;
}

export interface PriceCandleResult {
  symbolCode: string;
  timeFrame: string;
  openTime: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

export interface SymbolResult {
  symbolCode: string;
  name?: string;
  category?: string;
}

export interface IndicatorPoint {
  openTime: string;
  value: number;
}
