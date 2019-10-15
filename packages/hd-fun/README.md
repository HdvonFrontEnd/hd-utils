## Hd-Fun

![npm download](https://img.shields.io/npm/dt/hd-fun)
![npm version](https://img.shields.io/npm/v/hd-fun)

工具函数库

内部含有多个函数，通过ES Module引入所需函数

```js
import { genTreeData } from 'hd-fun'

const originalTree = [{name: 'xx', pid: 0, id: 123}, {name: 'yy', pid: 123, id: 1234} ]
const resTree = genTreeData(originalTree)
```

详细文档见：