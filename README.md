# Hd-Utils

> 弘度内部 Utils 库 --- 使用lerna管理的monorepo

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![Hdvon](https://img.shields.io/badge/hdvon-%E5%BC%98%E5%BA%A6%E7%A7%91%E6%8A%80%E2%9D%A4-orange)
![npm code size](https://img.shields.io/github/languages/code-size/HdvonFrontEnd/hd-utils)
![GitHub](https://img.shields.io/github/license/HdvonFrontEnd/hd-utils)
![GitHub issues](https://img.shields.io/github/issues-raw/HdvonFrontEnd/hd-utils)

- hd-fun ![npm download](https://img.shields.io/npm/dt/hd-fun) ![npm version](https://img.shields.io/npm/v/hd-fun)
- hd-http ![npm download](https://img.shields.io/npm/dt/hd-http) ![npm version](https://img.shields.io/npm/v/hd-http)
- hd-log ![npm download](https://img.shields.io/npm/dt/hd-log) ![npm version](https://img.shields.io/npm/v/hd-log)
- hd-md-loader ![npm download](https://img.shields.io/npm/dt/hd-md-loader) ![npm version](https://img.shields.io/npm/v/hd-md-loader)
- hd-queue ![npm download](https://img.shields.io/npm/dt/hd-queue) ![npm version](https://img.shields.io/npm/v/hd-queue)
- hd-topo ![npm download](https://img.shields.io/npm/dt/hd-topo) ![npm version](https://img.shields.io/npm/v/hd-topo)
- hd-tree-data ![npm download](https://img.shields.io/npm/dt/hd-tree-data) ![npm version](https://img.shields.io/npm/v/hd-tree-data)
- hd-websocket ![npm download](https://img.shields.io/npm/dt/hd-websocket) ![npm version](https://img.shields.io/npm/v/hd-websocket)

## Build Setup

``` bash

# Clone project
git clone 

# Install dependencies
npm install

# 新建一个组件
npm run add

# 在localhost:8820打开调试页面与文档页面
npm run dev

# 构建文档页面
npm run deploy:build

# build for production with minification
npm run build:all

# 分别发布组件（仅发布有改动的）
npm run publish:all

```

## 目录结构

```$xslt
|- hd-utils
||-- lib
||-- build
||-- docs
||-- packages
|||--- hd-fun
||||---- dist
||||---- __test__
||||---- index.js
||||---- package.json
||||---- webpack.conf.js
||||---- src
|||||----- core.js
||-- src
||-- static
||-- test
|||--- unit
||||---- coverage
||||---- specs
```
- lib 中存放构建出来的调试与文档页面，用于给用户查看例子与文档
- build 中存放了一些脚本与webpack配置
- docs 中存放文档页面相关代码
- packages 存放各个组件，以及组件的文档和例子。
- src 中存放组件共用的代码
- static 中存放调试页面用到的静态文件（如大的JSON文件）
- test 中存放测试配置

## 使用方式

本仓库不会合并发布组件，对应组件的使用方式见对应的文档。

仓库中含有的组件可见packages目录，或者components.json

## 感谢

感谢广州弘度信息科技有限公司给予的支持。

## License
Hd-Utils is MIT

Copyright (c) HDVON 2019-present 
