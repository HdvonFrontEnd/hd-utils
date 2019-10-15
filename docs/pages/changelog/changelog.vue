<template>
	<div class="changelog-wrapper">
    <el-tabs tab-position="right" >
      <el-tab-pane :label="key" v-for="(item, key) in changelogArr" :key="key">
        <component :is="key"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
const changelogArr = {}
const requireAll = context => context.keys().map(context)
const CHANGELOG = require.context('../../../packages', true, /\.\/hd-[\w\d-]+\/CHANGELOG\.md$/)
requireAll(CHANGELOG).forEach(({ default: item }, index) => {
  const file = CHANGELOG.keys()[index]
  const name = file.split('/')[1]
  changelogArr[name] = item
})
export default {
  name: 'changelog',
  components: {
    ...changelogArr
  },
  data() {
    return {
      changelogArr: changelogArr
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.changelog-wrapper {
	}
</style>
