# Hd-tree-data

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
// 或
import { Tree, recursion, listToTree, treeToList, listToObj } from 'hd-tree-data'
```

#### 使用
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
:::demo
```html
<template>
  <div class="hd-tree-data-example-wrapper">
    <el-row :gutter="20">
      <el-col :span="12">
        <h2>Hd-tree-data</h2>
        <el-form>
          <el-form-item label="原始数据(data)：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="treeDataStr"
            ></el-input>
          </el-form-item>
          <el-form-item label="原始数据的类型(type)：">
            <el-radio v-model="type" label="tree">树</el-radio>
            <el-radio v-model="type" label="list">列表</el-radio>
          </el-form-item>
          <el-form-item label="节点唯一标识符(idName)">
            <el-input v-model="idName"></el-input>
          </el-form-item>
          <el-form-item label="父级节点标识符(parentIdName)：">
            <el-input v-model="parentIdName"></el-input>
          </el-form-item>
          <el-form-item label="子节点属性名(childrenName)：">
            <el-input v-model="childrenName"></el-input>
          </el-form-item>
          <el-form-item :label="`根节点条件 '${parentIdName}'等于(rootId:Array)：`">
            <el-input v-model="rootId"></el-input>
          </el-form-item>
          <el-button @click="change">转换</el-button>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form>
          <el-form-item label="树结构">{{tree.tree}}</el-form-item>
          <el-form-item label="list结构">{{tree.list}}</el-form-item>
          <el-form-item label="object结构">{{tree.objList}}</el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>

const $eval = str => {
  return new Function('return ' + str)()
}
export default {
  name: 'hd-tree-data-example',
  data() {
    return {
      activeName: 'example',
      treeDataStr:
        '[{"name":"xx","pid":0,"id":123},{"name":"yy","pid":123,"id":1234},{"name":"zz","pid":0,"id":124},{"name":"yy","pid":124,"id":1234}]',
      type: 'list',
      idName: 'id',
      parentIdName: 'pid',
      childrenName: 'children',
      rootId: '[0]',
      error: '',
      tree: {}
    }
  },
  computed: {
    treeData() {
      return JSON.parse(this.treeDataStr)
    }
  },
  methods: {
    change() {
      console.log({
        idName: this.idName,
        childrenName: this.childrenName,
        parentIdName: this.pId,
        rootId: $eval(this.rootId),
        data: this.treeData,
        type: this.type
      })
      try {
        this.tree = new this.$hdTreeData({
          idName: this.idName,
          childrenName: this.childrenName,
          parentIdName: this.parentIdName,
          rootId: $eval(this.rootId),
          data: this.treeData,
          type: this.type
        })
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>

```
:::
## Tree实例可选配置参数如下：

参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
data | 原始数据tree结构或者list结构 | Array | 无
type | 'list'或 'tree' | String | 无
idName | 节点唯一标识符 | Number | id
parentIdName | 父级节点唯一标识符 | Boolean | pId
childrenName | 子节点属性名 | Boolean | children
rootId | 根节点的值，满足其中之一为根节点 | Array | [null, undefined, 0, '0', null]


#### Tree返回数据说明
数据名 | 说明 | 值类型
--- | --- | ---
tree | 多维数组 | []
list | 一维数组 | []
objList | 以id为key的object | {}

## 递归方法recursion（{data,recursionCondition,level}，callback）

参数名 | 说明 | 值类型
--- | --- | ---
data | 需要递归的数据 | [] 或者 {}
recursionCondition | 判断条件，会抛出当前项item以及父级的数据data | Function
level | 首层的level 默认0 | number
callback| 见callback说明 | function

callback 说明：
返回参数名 | 说明 | 值类型
--- | --- | ---
item | 当前节点的Item | any
level | 层级 | Number
parent | 父级的data | []或{}
parentIdName| 父级idname parent和parentIdName 结合起来能找到自 | string

callback return false会终止该叶子的递归，return数组或者object的时候回继续递归

## 数组转树listToTree （{ list, idName, childrenName, parentIdName, rootId }）

参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
list | 需要转换的原始数据 | Array | 无
idName | 唯一标识的key，list的数据必须包含该key | string |id
parentIdName| 父级节点的key |  string |pId
childrenName | 返回数据子节点的key |  string  | children
rootId| 判定为根元素的条件值 | Array | [null, undefined, 0, '0', null]

返回一个多维数组（引用）

## 数组转为以某个值为key的对象listToObj （{ list: any[]; idName }）


参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
list | 需要转换的原始数据 | [] | Object[]
idName | 唯一标识的key，list的数据必须包含该key | String | 无
返回一个新的Arr

## treeToList  ({tree,childrenName})

参数名 | 说明 | 值类型 | 默认值
--- | --- | --- | ---
tree | 树格式的数组 | Array | 无
childrenName | tree里面的子节点的key | String | 无

返回一个新的Arr



