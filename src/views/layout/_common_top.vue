<template>
  <el-header>
    <div class="left" ref="nmd">
      <div>
        NPM-PKG-ANALYSIS
      </div>
      <el-menu 
        :router="true" 
        mode="horizontal" 
        :ellipsis="false" 
        background-color="transparent" 
        :default-active="activeIndex">
        <el-menu-item index="Force_Directed">Force_Directed</el-menu-item>
        <el-menu-item index="Tree">Tree</el-menu-item>
      </el-menu>
    
    </div>
    <div class="right">
      <!-- <el-color-picker v-model="color"/> -->
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import {computed, ref,onMounted} from 'vue'
import {useRoute} from "vue-router"
import {store} from '@/store.js'

const router = useRoute()
const activeIndex = computed(()=>router.name )

const nmd = ref<any>(null)
const color = computed({
  get(){
    return store.color
  },
  set(newVal){
    const parent  = nmd.value.parentNode
    parent.style = "background-color:"+newVal
    store.color = newVal
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
