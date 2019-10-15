## Hd-Log

![npm download](https://img.shields.io/npm/dt/hd-log)

日志格式化打印库

使用方式：
``` bash
# 安装插件
npm install hd-log
```

```js
// 引入插件
import HdLog from 'hd-log'
// 传入配置参数，返回一个实例
const config = {
  serverUrl: 'http://test.com',
  needStringify: true
}
const logger = new HdLog(config)
logger.info('hello, world')
```

详细文档见：