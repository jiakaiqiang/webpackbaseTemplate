<template>
    <div>
        我是测试组件
        {{ message }}
    </div>
</template>

<script setup>
import { ref } from 'vue';
let message = ref('测试fsfsfs')

</script>

<style scoped lang='scss'>
/* Your styles here */
</style>