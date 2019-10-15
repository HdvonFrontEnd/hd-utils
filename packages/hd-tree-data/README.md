# Hd-Tree-Data

> 树接口数据转换

## 快速开始

#### 下载
``` bash

# 安装插件
npm install hd-tree-data
```

#### 引入
```js
// 引入插件
import Tree from 'hd-tree-data'
import { Tree,recursion , listToTree, treeToList, listToObj } from 'hd-tree-data'
```


初始化，返回一个实例
```js
// 传入配置参数，返回一个实例
const tree = new Tree({
  idName: 'id',
  childrenName: 'children',
  parentIdName: 'pid',
  rootId: [0],
  data: [],
  type: 'list'
})
```

Tree实例可选配置参数如下：

参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
data | 原始数据tree结构或者list结构 | Array | 无
type | 'list'或 'tree' | String | 无
idName | 节点唯一标识符 | Number | id
parentIdName | 父级节点唯一标识符 | Boolean | pId
childrenName | 子节点属性名 | Boolean | children
rootId | 根节点的值，满足其中之一为根节点 | Array | [null, undefined, 0, '0', null]


返回数据：
数据名 | 说明 | 值类型
--- | --- | ---
tree | 多维数组 | []
list | 一维数组 | []
objList | 以id为key的object | {}

#### 递归方法recursion（{data,recursionCondition,level}，callback）

参数名 | 说明 | 值类型
--- | --- | ---
data | 需要递归的数据 | [] 或者 {}
recursionCondition | 判断条件，会抛出当前项item以及父级的数据data | Function
level | 首层的level 默认0 | number
callback| 见callback说明 | function

参数名 | 说明 | 值类型
--- | --- | ---
item | 当前节点的Item | any
level | 层级 | Number
parent | 父级的data | []或{}
parentIdName| 父级idname parent和parentIdName 结合起来能找到自 | string

callback return false会终止该叶子的递归，return数组或者object的时候回继续递归
