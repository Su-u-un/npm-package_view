<template>
  <aside class="left">
    <h4>View</h4>
    <el-menu >
      <el-menu-item :index="index+''" v-for="(item,index) in method" @click="turnView(item)">
        <span>{{item}}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script lang="ts" setup>
// import router from '@/router'
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

let method = ref(['Tree','Force-Directed'])
function turnView(type){
  if(type==='Tree')
    router.push({name: 'Tree'})
  else if(type==='Force-Directed')
    router.push({name: 'Force'})
  
}

</script>

<style scoped>
.left{
  width:200px;
  background-color: green;
}
</style>
