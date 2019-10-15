import { expect } from 'chai'
import {
  formatTime,
  formatSecond,
  getTimestamp,
  timeDiff,
  day
} from '../../src/time'
import * as dayjs from 'dayjs'
describe('hd-fun/time', () => {
  const genDateCollection = (dateStr: string): dayjs.ConfigType[] => [dateStr, new Date(dateStr).getTime(), new Date(dateStr)]

  it('formatTime', () => {
    const expectedStr = '2019-07-01 14:10:01'
    const format = 'YYYY-MM-DD HH:mm:ss'
    genDateCollection(expectedStr).forEach(date => {
      expect(formatTime(date, format)).to.equal(expectedStr)
    })
  })

  it('formatSecond', () => {
    const resultMap: [number, string][] = [
      [60, '60秒'],
      [3659, '60分59秒'],
      [3660, '1小时1分0秒']
    ]
    resultMap.forEach(testCase => {
      expect(formatSecond(testCase[0])).to.equal(testCase[1])
    })
  })

  it('getTimestamp', () => {
    const expectedTimeStamp = 1561961401000
    const expectedTimeSec = expectedTimeStamp / 1000
    const dateStr = '2019-07-01 14:10:01'
    genDateCollection(dateStr).forEach(date => {
      expect(getTimestamp(date)).to.equal(expectedTimeStamp)
      expect(getTimestamp(date, false)).to.equal(expectedTimeSec)
    })
  })

  it('timeDiff', () => {
    const testCase: [string, string, string][] = [
      // date, ref, result
      ['2019-07-01 14:00:59', '2019-07-01 14:00:00', '刚刚'],
      ['2019-07-01 14:00:00', '2019-07-01 14:00:59', '刚刚'],
      ['2019-07-01 14:59:00', '2019-07-01 14:00:00', '59分钟后'],
      ['2019-07-01 13:50:00', '2019-07-01 14:00:00', '10分钟前'],
      ['2019-07-01 15:00:00', '2019-07-01 14:00:00', '1小时后'],
      ['2019-07-01 13:00:00', '2019-07-01 14:00:00', '1小时前'],
      ['2019-07-02 14:00:59', '2019-07-01 14:00:00', '1天后'],
      ['2019-06-30 13:00:59', '2019-07-01 14:00:00', '1天前'],
      ['2019-05-30 13:00:59', '2019-07-01 14:00:00', '05-30'],
      ['2018-06-30 13:00:59', '2019-07-01 14:00:00', '2018-06-30']
    ]
    testCase.forEach(caseItem => {
      const dateSet = genDateCollection(caseItem[0])
      const refSet = genDateCollection(caseItem[1])
      refSet.forEach(ref => {
        dateSet.forEach(date => {
          expect(timeDiff(date, ref)).to.equal(caseItem[2])
        })
      })
    })
  })

  // TODO 不知道如何测试这种函数，他仅仅是用于接收参数，然后调用dayjs
  it('day', () => {
    expect(day().format('YYYY-MM-DD')).equal(dayjs().format('YYYY-MM-DD'))
  })
})
