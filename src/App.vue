<script lang="ts">
import { RouterView } from 'vue-router'

export default {
    name: 'App',
    components: {
        RouterView
    }
}
</script>

<template>
<!--  <el-scrollbar>-->
    <router-view/>
<!--  </el-scrollbar>-->
</template>

<style scoped>
</style>
