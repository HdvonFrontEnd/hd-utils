<template>
	<div class="index-wrapper page-container">
    <el-header class="index-header">
      <img src="../assets/images/hdLogo.png" class="index-header__logo">
      <div class="index-header__text" @click="NavToHome">HDVON</div>
    </el-header>
    <div class="index-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'index',
  methods: {
    NavToHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .index-wrapper {
    height: 100%;
    overflow: auto;
    margin: 0 auto;
    color: #444;
    .index-header {
      display: flex;
      align-items: center;
      font-size: 32px;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      .index-header__logo {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      .index-header__text {
        cursor: pointer;
      }
    }
    .index-content {
      height: calc(100% - 70px);
    }
  }
</style>
