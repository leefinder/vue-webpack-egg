<template>
    <div>vue</div>
</template>

<script>
class P {

};
const S = () => {

};
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

</style>
