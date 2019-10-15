<template>
  <div class="packages-wrapper page-container">
    <el-row class="packages-content-wrapper">
      <el-col :span="3" class="nav-list-wrapper">
        <el-scrollbar class="home__scrollbar" tag="div">
          <div
            :class="['nav-list-item', item.name === $route.name ? 'active' :'']"
            v-for="item in navList" :key="item.name"
            @click="navTo(item.name)">
            {{item.name}}
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="packages-component-wrapper">
        <el-scrollbar class="packages__scrollbar" tag="div">
            <router-view></router-view>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-backtop target=".packages-component-wrapper .el-scrollbar__wrap" :right="100" :visibility-height="20"></el-backtop>
  </div>
</template>

<script type="text/ecmascript-6">
import NavList from 'src/nav-list'
export default {
  name: 'packages',
  data() {
    return {
      navList: NavList
    }
  },
  methods: {
    navTo(routeName) {
      this.$router.push(routeName)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .packages-wrapper {
    height: 100%;
    overflow: auto;
    margin: 0 auto;
    color: #444;
    .packages-header {
      display: flex;
      align-items: center;
      font-size: 32px;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      .packages-header__logo {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      .packages-header__text {
        cursor: pointer;
      }
    }
    .packages-content-wrapper {
      height: calc(100% - 70px);
    }
    .nav-list-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .nav-list-item {
        cursor: pointer;
        width: 100%;
        height: 40px;
        line-height: 40px;
        transition: .15s ease-out;
        &:hover,
        &.active {
          color: #409eff;
        }
      }
    }
    .packages__scrollbar {
      height: 100%;
      /deep/ .el-scrollbar__view {
        height: 100%;
      }
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .packages-component-wrapper {
      height: 100%;
    }
  }
</style>
