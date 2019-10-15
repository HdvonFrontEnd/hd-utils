import { expect } from 'chai'
import Queue from '../../src/index'
const wait = async(time, data): Promise<any> => {
  return new Promise((resolve): void => {
    setTimeout(() => resolve(data), time)
  })
}
describe('hd-queue', () => {
  it('测试传入不符合的参数', () => {
    // 不符合的参数
    const errParams = [NaN, -1, -10, 0, Infinity, -Infinity, 2.2]
    let errCount = 0
    errParams.forEach(v => {
      try {
        new Queue(v)
      } catch (error) {
        errCount++
      }
    })
    expect(errCount).to.equal(errParams.length)
  })
  it('检查传入和返回的参数是否一致', (done) => {
    new Promise((resolve): void => {
      const queue = new Queue(2)
      const resultMap = [
        { waitTime: 100, result: '呵呵' },
        { waitTime: 100, result: '呵呵2' },
        { waitTime: 100, result: '呵呵3' }
      ]
      const res = resultMap.map((v, index) => {
        return queue.push(() => {
          return wait(v.waitTime, { index, result: v.result })
        })
      })
      Promise.all(res).then(temp => {
        temp.forEach(v => {
          expect(v.result).to.equal(resultMap[v.index].result)
        })
        resolve()
      })
    }).finally(done)
  })
})
