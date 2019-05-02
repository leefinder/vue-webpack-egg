<template>
    <div class="content">
        platform
        <router-view></router-view>
        <router-link to="/home">home</router-link>
    </div>
</template>

<script>
class P {

};
const S = () => {

};
console.log('test-app-home');
export default {
    name: 'app',
    mounted () {
        const p = new P();
        const s = S();
        console.log(p, s);
    }

};
</script>
<style lang="less" scoped>
.content{
    border: 1px solid #ccc;
}
</style>
