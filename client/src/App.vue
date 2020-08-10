<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'App'
};
</script>
<style lang="less" scoped>
[v-cloak] {
    display:none;
}
</style>
