export interface JsonResponse<T> {
  status_code: number;
  timestamp: string;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginationResource<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}
