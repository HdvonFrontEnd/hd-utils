// Tree class 以后会替换上方方法，且会转到utils
import * as cloneDeep from '../node_modules/lodash.clonedeep'
import { Config, TreeParamsConfig, ListToTreeParams, RecursionParams, TreeToListParams, ListToObjRes } from './interfaces'
import { DataType } from './enums'

export class Tree {
  // type 是 tree 或 list
  config: Config = { idName: 'id', childrenName: 'children', parentIdName: 'pId', rootId: [null, undefined, 0, '0', null] }
  _tree: Object[]
  _list: Object[]
  _objList: Object
  constructor(params: TreeParamsConfig) {
    const { data, type, idName, childrenName, parentIdName, rootId } = params
    this.config = { idName, childrenName, parentIdName, rootId: rootId }
    // this._list = data
    if (type === DataType.tree) {
      this._tree = data
    } else if (type === DataType.list) {
      this._list = data
    } else {
      throw new Error('type必须为tree或者list')
    }
  }
  get list(): any[] {
    if (this._list) return this._list
    const { childrenName } = this.config
    this._list = Tree.treeToList({ tree: this.tree, childrenName })
    return this._list
  }
  get objList(): Object {
    if (this._objList) return this._objList
    const { idName } = this.config
    this._objList = Tree.listToObj({ list: this.list, idName })
    return this._objList
  }
  get tree(): any[] {
    if (this._tree) return this._tree
    const { idName, childrenName, parentIdName, rootId } = this.config
    this._tree = Tree.listToTree({ list: this.list, idName, childrenName, parentIdName, rootId })
    return this._tree
  }
  // 递归函数 data为需要递归的数据arry| object, level 为可选参数 parentIdName 也可以不传，不影响递归
  static recursion({ data, recursionCondition, parentIdName, level }: RecursionParams, cb: Function): void {
    level = level || 0
    Object.keys(data).forEach(key => {
      const item = data[key]
      // 返回数组或者布尔值
      const condition = recursionCondition(item, data)
      if (condition) {
        // 递归
        Tree.recursion({ data: condition, recursionCondition: recursionCondition, level: level + 1, parentIdName: key }, cb)
      }
      cb({
        item: item, // 叶子节点
        level: level, // 叶子层级
        parent: level === 0 ? undefined : data, // 父级数据，
        parentIdName: parentIdName // 父级idname parent和parentIdName 结合起来能找到自己
      })
    })
  }
  static listToObj(params: { list: any[]; idName: string }): ListToObjRes { // 以arr的某个值为key转换为object格式
    const { list, idName } = params
    const Obj: Object = {}
    list.forEach(v => {
      Obj[v[idName]] = v
    })
    return Obj
  }
  static treeToList({ tree, childrenName }: TreeToListParams): any[] { // 树结构转换成arr
    const arr: Array<any> = []
    Tree.recursion({
      data: tree, recursionCondition: (item) => {
        return (item[childrenName] && item[childrenName].length !== 0) ? item[childrenName] : false
      },
      level: 0
    }, v => {
      arr.push(cloneDeep(v.item))
    })
    // 删除delete
    // arr.forEach(v => {
    //   // delete v[childrenName]
    // })
    return arr
  }
  static listToTree({ list, idName, childrenName, parentIdName, rootId }: ListToTreeParams): any[] { // arr转换成树结构
    const _list = cloneDeep(list)
    /** 把所有有子的数据都赋值到父级的children属性里面 **/
    const Obj = Tree.listToObj({ list: _list, idName })
    _list.forEach(v => {
      if (!rootId.includes(v[parentIdName])) {
        try {
          if (Obj[v[parentIdName]]) {
            // 判断该值是否为空，如果为空，则赋[]
            Obj[v[parentIdName]][childrenName] = Obj[v[parentIdName]][childrenName] || []
            Obj[v[parentIdName]][childrenName].push(v)
          } else {
            // 没有找到父级元素
            console.log(v, v[parentIdName], '菜单id不存在')
          }
        } catch (err) {
          console.log('转换出错')
        }
      }
    })
    /** 筛选出根数据 **/
    return Object.keys(Obj).filter(key => {
      const value = Obj[key]
      return !value[parentIdName] || rootId.includes(value[parentIdName])
    }).map(key => Obj[key])
  }
}
export const listToTree = Tree.listToTree
export const treeToList = Tree.treeToList
export const listToObj = Tree.listToObj
export const recursion = Tree.recursion

export default Tree
