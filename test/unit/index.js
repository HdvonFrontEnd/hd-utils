// require all __test__ files (files that ends with .specs.js)
const testsContext = require.context('../../packages', true, /^\.\/hd-[\w]+\/__test__\/specs\/[\w-]+\.spec\.(js|ts)$/)
testsContext.keys().forEach(testsContext)

// require all source code, exclude node_modules, example, so on and so forth
const srcContext = require.context('../../packages', true, /^\.\/hd-[\w]+\/index\.(js|ts)$/)
srcContext.keys().forEach(srcContext)
// console.log(testsContext.keys(), srcContext.keys())
