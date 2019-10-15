import { expect } from 'chai'
import { Tree, listToObj, listToTree } from '../../src/index'
import { DataType } from '../../src/enums'

describe('hd-tree', () => {
  it('listToTree', () => {
    const list = [
      {
        key: 'key1',
        value: 'value1'
      },
      {
        key: 'key2',
        value: 'value2'
      },
      {
        key: 'key3',
        value: 'value3'
      }
    ]
    const { key1, key2, key3 } = listToObj({ list, idName: 'key' })
    const { value1, value2, value3 } = listToObj({ list, idName: 'value' })
    expect(key1).to.equal(list[0])
    expect(key2).to.equal(list[1])
    expect(key3).to.equal(list[2])
    expect(value1).to.equal(list[0])
    expect(value2).to.equal(list[1])
    expect(value3).to.equal(list[2])
  })
  it('listToTree', () => {
    const list = [
      { name: '1', pid: 0, id: 123 },
      { name: '2', pid: 123, id: 1235 },
      { name: '3', pid: 0, id: 124 },
      { name: '4', pid: 124, id: 1234 }
    ]
    const equalRes = [
      {
        name: '1', pid: 0, id: 123, children: [
          { name: '2', pid: 123, id: 1235 }
        ]
      },
      {
        name: '3', pid: 0, id: 124, children: [
          { name: '4', pid: 124, id: 1234 }
        ]
      }
    ]
    const expectRes = listToTree({
      list, idName: 'id',
      childrenName: 'children',
      parentIdName: 'pid',
      rootId: [0]
    })
    expect(JSON.stringify(expectRes)).to.equal(JSON.stringify(equalRes))
  })
  it('dataIsList', () => {
    const data = [{ 'name': 'xx', 'pid': 0, 'id': 123 }, { 'name': 'yy', 'pid': 123, 'id': 1234 }, { 'name': 'zz', 'pid': 0, 'id': 124 }, { 'name': 'yy', 'pid': 124, 'id': 1234 }]
    const { tree, list, objList } = new Tree({
      idName: 'id',
      childrenName: 'children',
      parentIdName: 'pid',
      rootId: [0],
      data: data,
      type: DataType.list
    })
    expect(JSON.stringify(tree)).to.equal(JSON.stringify([{ 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }, { 'name': 'zz', 'pid': 0, 'id': 124, 'children': [{ 'name': 'yy', 'pid': 124, 'id': 1234 }] }]))
    expect(JSON.stringify(list)).to.equal(JSON.stringify([{ 'name': 'xx', 'pid': 0, 'id': 123 }, { 'name': 'yy', 'pid': 123, 'id': 1234 }, { 'name': 'zz', 'pid': 0, 'id': 124 }, { 'name': 'yy', 'pid': 124, 'id': 1234 }]))
    expect(JSON.stringify(objList)).to.equal(JSON.stringify({ '123': { 'name': 'xx', 'pid': 0, 'id': 123 }, '124': { 'name': 'zz', 'pid': 0, 'id': 124 }, '1234': { 'name': 'yy', 'pid': 124, 'id': 1234 }}))
  })
  it('dataIsTree', () => {
    const data = [{ 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }, { 'name': 'zz', 'pid': 0, 'id': 124, 'children': [{ 'name': 'yy', 'pid': 124, 'id': 1234 }] }]
    const { tree, list, objList } = new Tree({
      idName: 'id',
      childrenName: 'children',
      parentIdName: 'pid',
      rootId: [0],
      data: data,
      type: DataType.tree
    })
    expect(JSON.stringify(tree)).to.equal(JSON.stringify([{ 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }, { 'name': 'zz', 'pid': 0, 'id': 124, 'children': [{ 'name': 'yy', 'pid': 124, 'id': 1234 }] }]))
    expect(JSON.stringify(list)).to.equal(JSON.stringify([{ 'name': 'yy', 'pid': 123, 'id': 1234 }, { 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }, { 'name': 'yy', 'pid': 124, 'id': 1234 }, { 'name': 'zz', 'pid': 0, 'id': 124, 'children': [{ 'name': 'yy', 'pid': 124, 'id': 1234 }] }]))
    expect(JSON.stringify(objList)).to.equal(JSON.stringify({ '123': { 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }, '124': { 'name': 'zz', 'pid': 0, 'id': 124, 'children': [{ 'name': 'yy', 'pid': 124, 'id': 1234 }] }, '1234': { 'name': 'yy', 'pid': 124, 'id': 1234 }}))
  })
})
