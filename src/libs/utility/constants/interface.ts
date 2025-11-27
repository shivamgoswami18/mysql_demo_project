export interface MulterConfig {
  destination?: string;
  fieldName?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  status: string;
  message?: string;
  data?: T;
  error?: unknown;
}

export interface ErrorResponse {
  message?: string | string[];
  trace?: any;
  data?: any;
  statusCode?: number;
}
