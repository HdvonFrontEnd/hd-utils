// require all __test__ files (files that ends with .specs.js)
const testsContext = require.context('./specs/', true, /\.spec\.ts$/)
testsContext.keys().forEach(testsContext)

// require all source code, exclude node_modules, example, so on and so forth
require('../index.js')

