import { expect } from 'chai'
import {
  genTreeData,
  setTreeNodeLevel
} from '../../src/tree'
describe('hd-fun/tree', () => {
  it('genTreeData', () => {
    const flatTreeData = [{ name: 'xx', pid: 0, id: 123 }, { name: 'yy', pid: 123, id: 1234 }, { name: 'zz', pid: 0, id: 124 }, { name: 'yy', pid: 124, id: 1234 }]
    const structureTreeData = JSON.stringify(genTreeData(flatTreeData, { pid: 'pid', level: 1 }))
    const expectedRes = '[{"uniKey":"1230","name":"xx","pid":0,"id":123,"children":[{"uniKey":"12340","name":"yy","pid":123,"id":1234,"level":2}],"level":1},{"uniKey":"1240","name":"zz","pid":0,"id":124,"children":[{"uniKey":"12341","name":"yy","pid":124,"id":1234,"level":2}],"level":1}]'
    expect(structureTreeData).to.equal(expectedRes)
  })

  it('setTreeNodeLevel', () => {
    const oriTreeData = [{ 'name': 'xx', 'pid': 0, 'id': 123, 'children': [{ 'name': 'yy', 'pid': 123, 'id': 1234 }] }]
    const expectedRes = '[{"name":"xx","pid":0,"id":123,"children":[{"name":"yy","pid":123,"id":1234,"level":102}],"level":101}]'
    expect(JSON.stringify(setTreeNodeLevel(oriTreeData, {
      rootLevel: 101,
      childrenKey: 'children'
    }))).to.equal(expectedRes)
  })
})
