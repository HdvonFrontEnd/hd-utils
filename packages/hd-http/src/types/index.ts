import { AxiosPromise, AxiosRequestConfig, AxiosStatic } from 'axios'
export interface ObjectLiteral {
  [key: string]: any;
  [key: number]: any;
}

export interface HdHttpStatic extends AxiosStatic{
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  cancel(): void;
  create(config?: AxiosRequestConfig): HdHttpStatic;
}
