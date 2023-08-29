<template>
  <div class="main">
    <el-container direction="vertical">
      <MainNavbar/>
      <el-container>
        <MainContent/>
        <MainRight/>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import MainNavbar from "./layout/top.vue";
import MainContent from "./layout/center.vue";
import MainRight from "./layout/right.vue";

</script>
<style>
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height:100vh;
}

</style>
