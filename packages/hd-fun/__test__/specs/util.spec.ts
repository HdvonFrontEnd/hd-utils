import { expect } from 'chai'
import {
  genUUID,
  browser,
  bytesToSize,
  getDataByKey
} from '../../src/util'
describe('hd-fun/util', () => {
  it('genUUID', () => {
    // TODO 这样测试会不会太蠢了
    const result: string[] = []
    const testLen = 10 * 1000
    while (result.length < testLen) {
      result.push(genUUID())
    }
    expect(new Set(result).size).to.equal(result.length)
  })

  it('browser', () => {
    const browserList = ['opera', 'ie', 'firefox', 'safari', 'chrome']
    browserList.forEach(browserName => {
      // 当前karma设置成在chrome下测试
      expect(browser(browserName)).to.equal(browserName === 'chrome')
    })
  })

  it('bytesToSize', () => {
    const testCase: [number, string][] = [
      [0, '0 B'],
      [124, '124 B'],
      [2201, '2.15 KB'],
      [1024000, '1.00e+3 KB'],
      [98223445, '93.7 MB'],
      [98223445215, '91.5 GB'],
      [14223445215121, '12.9 TB'],
      [14223445215121, '12.9 TB'],
      [14223445215121154, '12.6 PB']
    ]
    testCase.forEach(item => {
      expect(bytesToSize(item[0])).to.equal(item[1])
    })
  })
  // TODO 全屏部分如何测试？
  it('getDataByKey', () => {
    const oriArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    expect(getDataByKey(oriArr, 'id', 3)).to.equal(oriArr[2])
    expect(getDataByKey(oriArr, 'id', 5)).to.equal(undefined)
  })
})
