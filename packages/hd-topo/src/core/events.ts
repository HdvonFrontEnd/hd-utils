import { Object } from 'topo/types'
/**
 * @name events
 * @description 为拓扑框架提供事件系统
 * @example
 * var obj = { };
 * events.attach(obj);
 *
 * // 注册一个事件
 * obj.on('hello', function(str) {
 *     console.log('event hello is fired', str);
 * });
 *
 * // 触发一个事件
 * obj.fire('hello', 'world');
 */
const events = {
  /**
   * @function
   * @name events.attach
   * @description 初始化事件
   * @param {Object} 传入一个挂载对象
   * @returns {Object} 返回挂载对象
   * @example
   * var obj = { };
   * events.attach(obj);
   */
  attach: function(target: Object): Object {
    const ev = events
    target.on = ev.on
    target.off = ev.off
    target.fire = ev.fire
    target.once = ev.once
    target.hasEvent = ev.hasEvent
    target._callbackActive = { }
    return target
  },

  /**
   * @function
   * @name events.on
   * @description 注册事件
   * @param {String} 事件名称
   * @param {Function} 回调函数
   * @param {Object} 上下文，this的指向
   * @returns {*} 返回 'this'
   * @example
   * obj.on('test', function (a, b) {
   *     console.log(a + b);
   * });
   * obj.fire('test', 1, 2); // prints 3 to the console
   */
  on: function(name, callback, scope): Object {
    if (!name || typeof name !== 'string' || !callback) { return this }

    if (!this._callbacks) { this._callbacks = { } }

    if (!this._callbacks[name]) { this._callbacks[name] = [] }

    if (!this._callbackActive) { this._callbackActive = { } }

    if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) { this._callbackActive[name] = this._callbackActive[name].slice() }

    this._callbacks[name].push({
      callback: callback,
      scope: scope || this
    })

    return this
  },

  /**
   * @function
   * @name events.off
   * @description 移除事件
   * @param {String} [name] 事件名称
   * @param {Function} [callback] 回调的方法
   * @param {Object} [scope] this
   * @returns {*} 返回this
   * @example
   * var handler = function () {
   * };
   * obj.on('test', handler);
   *
   * obj.off(); // 移除所用事件
   * obj.off('test'); // 移除所有的test事件
   * obj.off('test', handler); // 移除某个test的事件
   * obj.off('test', handler, this); // 移除某个特定指向的test事件
   */
  off: function(name, callback, scope): Object {
    if (!this._callbacks) { return this }

    if (this._callbackActive) {
      if (name) {
        if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) { this._callbackActive[name] = this._callbackActive[name].slice() }
      } else {
        for (const key in this._callbackActive) {
          if (!this._callbacks[key]) { continue }

          if (this._callbacks[key] !== this._callbackActive[key]) { continue }

          this._callbackActive[key] = this._callbackActive[key].slice()
        }
      }
    }

    if (!name) {
      this._callbacks = null
    } else if (!callback) {
      if (this._callbacks[name]) { delete this._callbacks[name] }
    } else {
      const events = this._callbacks[name]
      if (!events) { return this }

      let i = events.length

      while (i--) {
        if (events[i].callback !== callback) { continue }

        if (scope && events[i].scope !== scope) { continue }

        events.splice(i, 1)
      }
    }

    return this
  },
  /**
   * @function
   * @name events.fire
   * @description 触发事件
   * @param {Object} 名称
   * @param {*} Arguments
   * @returns {*} 返回 'this'
   * @example
   * obj.fire('test', 'This is the message');
   */
  fire: function(name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8): Object {
    if (!name || !this._callbacks || !this._callbacks[name]) { return this }

    let callbacks

    if (!this._callbackActive) { this._callbackActive = { } }

    if (!this._callbackActive[name]) {
      this._callbackActive[name] = this._callbacks[name]
    } else {
      if (this._callbackActive[name] === this._callbacks[name]) {
        this._callbackActive[name] = this._callbackActive[name].slice()
      }
      callbacks = this._callbacks[name].slice()
    }
    /* eslint-disable */
    for (let i = 0; (callbacks || this._callbackActive[name]) && (i < (callbacks || this._callbackActive[name]).length); i++) {
      for (let i = 0; (callbacks || this._callbackActive[name]) && (i < (callbacks || this._callbackActive[name]).length); i++) {
        const evt = (callbacks || this._callbackActive[name])[i]
        evt.callback.call(evt.scope, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)

        if (evt.callback.once) {
          const ind = this._callbacks[name].indexOf(evt)
          if (ind !== -1) {
            if (this._callbackActive[name] === this._callbacks[name]) {
              this._callbackActive[name] = this._callbackActive[name].slice()
            }

            this._callbacks[name].splice(ind, 1)
          }
        }
      }
    }
    if (!callbacks) {
      this._callbackActive[name] = null
    }

    return this
  },
  /**
   * @function
   * @name events.once
   * @description 只触发一次
   * @param {String} 名称
   * @param {Function} 回调函数
   * @param {Object} [scope] 上下文，this的指向
   * @returns {*} 返回 'this'
   * @example
   * obj.once('test', function (a, b) {
   *     console.log(a + b);
   * });
   * obj.fire('test', 1, 2); // prints 3 to the console
   * obj.fire('test', 1, 2); // not going to get handled
   */
  once: function(name, callback, scope): Object {
    callback.once = true
    this.on(name, callback, scope)
    return this
  },

  /**
   * @function
   * @name events.hasEvent
   * @description 判断事件是否已存在
   * @param {String} name 名称
   * @returns {Boolean} true 返回布尔值
   * @example
   * obj.on('test', function () { }); // bind an event to 'test'
   * obj.hasEvent('test'); // returns true
   * obj.hasEvent('hello'); // returns false
   */
  hasEvent: function(name): boolean {
    return (this._callbacks && this._callbacks[name] && this._callbacks[name].length !== 0) || false
  }
}

export default events
