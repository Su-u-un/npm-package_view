<template>
  <el-header>
    <div class="left" ref="nmd">
      <div class="logo">
        NPM PACKAGE ANALYZER
      </div>
      <el-menu 
        :router="true" 
        mode="horizontal" 
        :ellipsis="false" 
        background-color="transparent" 
        :default-active="activeIndex">
        <el-menu-item v-for="(item, i) in routes" :key="i" :index="item.path">{{ item.name }}</el-menu-item>

      </el-menu>
    
    </div>
    <div class="right">
      <!-- <el-color-picker v-model="color"/> -->
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useRoute,useRouter,onBeforeRouteUpdate} from "vue-router"
import {clear} from "@/utils"

const route = useRoute()
const router = useRouter()

const activeIndex = computed(()=>route.path)
const routes = router.options.routes[0].children

onBeforeRouteUpdate((to,from)=>{
  if(to.path !== from.path) {
    clear()
  }
})

</script>

<style scoped>
.el-header{
  height:60px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  background-color: #36dae0;
}
.logo{
  cursor: pointer;
  font-family: hack, consolas, 有爱圆体, 华文中圆, 华文细黑, 华文黑体, 黑体, sans-serif;
  font-size: large;
  font-weight: 800;
}
.left{
  display: flex;
}
.el-menu-item:hover{
  color:black !important;
}
.el-menu-item:focus{
  background-color:transparent !important;
}
</style>
