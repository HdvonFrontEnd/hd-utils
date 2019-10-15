/**
 * 用于管理并发任务
 * 通过push方法往任务队列（waitList）推入任务
 * 如果执行中的任务数量（aRunning）不超过最大同时执行任务数（concurrency），则立即调用go方法
 * 在go方法中，会不断从waitList中获取任务并执行，如果已经满了（this.aRunning.length === this.thread）就等待
 * 另外push方法经过promise封装，如果推入的任务得到执行，则会被resolve或reject
 */

interface QueueItem {
  fun: Function;
  resolve: Function;
  reject: Function;
}

export default class HdQueue {
  private waitList: Array<QueueItem>
  private aRunning: Array<QueueItem>
  private _concurrency: number
  get concurrency(): number {
    return this._concurrency
  }
  constructor(concurrency: number) {
    if (!Number.isInteger(concurrency) || concurrency <= 0) {
      throw new Error('Queue接收参数必须为正整数')
    }
    this.waitList = [] // 待执行任务
    this.aRunning = [] // 执行中的任务
    this._concurrency = concurrency // 最大并行
  }
  push(fun: Function): Promise<any> {		// 插入
    return new Promise((resolve, reject): void => {
      const temp: QueueItem = {
        fun,
        resolve,
        reject
      }
      this.waitList.push(temp)
      if (this.aRunning.length < this.concurrency) this.go()// push即执行
    })
  }
  private async go(): Promise<undefined> {
    // 没有待可执行的程序
    if (this.waitList.length === 0) return
    if (this.aRunning.length === this.concurrency) return // 达到最大线程
    const temp = this.waitList.shift() // 弹出一个程序执行
    if (typeof temp === 'undefined') return
    this.aRunning.push(temp)
    try {
      const res = await temp.fun()
      temp.resolve(res)
    } catch (err) {
      temp.reject(err)
    } finally {
      // 剔除已完成的程序
      const idx = this.aRunning.findIndex(v => v === temp)
      this.aRunning.splice(idx, 1)
      this.go()// 执行下一个程序
    }
    return
  }
}
