// 树型对象接口
export interface TreeItem {
  id: number | string;
  level?: number;
  children?: TreeItem[]; // 子集
  [index: string]: any;
}

// 正则表达式集合
export interface RegexpSet {
  [index: string]: RegExp;
}
