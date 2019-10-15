import {
  TreeItem
} from '../types/'

/**
 * 查找所有父节点
 * @param map
 * @param id
 * @return {Array}
 */
const findAllParent = (map: Map<string, TreeItem>, id: number | string): string[] => {
  let cur = 0
  const res: string[] = []
  while (map.get(`${id}${cur}`)) {
    res.push(`${id}${cur}`)
    ++cur
  }
  return res
}

/**
 * 给结构化的树形数据设定level值
 * @param treeData
 * @param rootLevel
 * @param childrenKey
 */
const setTreeNodeLevel = (treeData: TreeItem[], { rootLevel = 1, childrenKey = 'children' } = {}): TreeItem[] => {
  treeData.forEach(item => {
    const stack: TreeItem[] = []
    item.level = rootLevel
    stack.push(item)
    while (stack.length) {
      const item = stack.pop()
      if (item && childrenKey in item) {
        item[childrenKey].forEach(child => {
          child.level = item.level ? item.level + 1 : 1
          stack.push(child)
        })
      }
    }
  })
  return treeData
}

/**
 * 生成结构化的树形数据
 * [{name: 'xx', pid: 0, id: 123}, {name: 'yy', pid: 123, id: 1234} ] ===> [{name: 'xx', pid: 0, id: 123, children: [{name: 'yy', pid: 123, id: 1234}]}]
 * @param arr 平铺的树形数据
 * @param option {Object}
 * @return {Array} 结构化的树形数据
 */
const genTreeData = (arr: TreeItem[], { root = 0, level = 1, pid = 'pid' } = {}): TreeItem[] => {
  const map = new Map<string, TreeItem>()
  arr.forEach(item => {
    const existArr = findAllParent(map, item.id)
    const uniKey = `${item.id}${existArr.length}`
    map.set(uniKey, JSON.parse(JSON.stringify(Object.assign({ uniKey }, item))))
  })
  const allChildren: TreeItem[] = []
  for (const item of map.values()) {
    if (item[pid] === root) {
      allChildren.push(item)
    } else {
      const parentArr = findAllParent(map, item[pid])
      parentArr.forEach(parentUniKey => {
        const parent = map.get(parentUniKey)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(item)
        } else {
          allChildren.push(item)
        }
      })
    }
  }
  setTreeNodeLevel(allChildren, { rootLevel: level })
  return allChildren
}

export {
  setTreeNodeLevel,
  genTreeData
}
