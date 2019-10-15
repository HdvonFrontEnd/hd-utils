// 拦截器resolve情况的函数用
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>;
}

// 拦截器reject情况的函数用
export interface RejectedFn {
  (error: any): any;
}

// TypeSocket配置
export interface HdWebsocketConfig {
  wsUrl: string;
  pingTimeout?: number;
  pongTimeout?: number;
  reconnectTimeout?: number;
  reconnectCountLimit: number;
  pingMsg?: string;
  pongMsg?: string;
  pingLog?: boolean;
  transactionID?: string;
  transformResponse?: HdWebsocketTransformer;
  transformRequest?: HdWebsocketTransformer;
}

// RequestTransform 与 ResponseTransform的定义
export interface HdWebsocketTransformer {
  (data: any): any;
}

// 一次请求，会被添加到connectPool中
export interface Transaction<T> {
  resolve: (reason?: T) => Promise<T> | void; // 适配Promise.resolve与Promise的resolve参数
  reject: (error?: T) => any;
  payload: any;
}

// 用于保存promise的resolve与reject方法，在别处调用，以改变promise状态
export interface PromiseCache<T = any> {
  resolve: (reason?: T) => Promise<T> | void; // 适配Promise.resolve与Promise的resolve参数
  reject: (error?: T) => any;
}
