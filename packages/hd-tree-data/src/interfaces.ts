import { DataType } from './enums'
export interface Config {
  idName: string;
  childrenName: string;
  parentIdName: string;
  rootId: (string | number | undefined | null)[];
}

export interface TreeParamsConfig extends Config {
  data: Object[];
  type: DataType;

}
export interface ListToTreeParams extends Config {
  list: any[];
}

export interface RecursionParams {
  data: Object | [];
  recursionCondition: Function;
  parentIdName?: string;
  level: number;
}

export interface TreeToListParams {
  tree: Object[];
  childrenName: string;
}
export interface ListToObjRes {
  [propName: string]: any;
  [propName: number]: any;
}

