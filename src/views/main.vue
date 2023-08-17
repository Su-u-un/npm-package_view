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
import MainNavbar from "./layout/_common_top.vue";
import MainContent from "./layout/_common_center.vue";
import MainRight from "./layout/_common_right.vue";

</script>
<style>
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height:100vh;
}

</style>
