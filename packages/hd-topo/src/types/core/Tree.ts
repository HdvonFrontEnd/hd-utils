export interface TreeNode {
  id: number;
  name: string;
  x?: number;
  y?: number;
  children?: any[];
  [field: string]: any;
}

export interface TreeRootNode {
  id: number;
  name: string;
  x: number;
  y: number;
  children: TreeNode[];
  [field: string]: any;
}

export interface TreeSpace {
  width: number;
  height: number;
}
