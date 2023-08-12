<script setup lang="ts">
import MainNavbar from "./layout/_common_top.vue";
import MainLeft from "./layout/_common_left.vue";
import MainContent from "./layout/_common_center.vue";
import MainRight from "./layout/_common_right.vue";
</script>

<template>
  <div class="main">
    <main-navbar/>
    <div class="content">
      <main-left/>
      <main-content/>
      <main-right/>
    </div>
  </div>
  
</template>

<style>
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height:100vh;
}
.content{
  display: flex;
  height:100%;
}
</style>
