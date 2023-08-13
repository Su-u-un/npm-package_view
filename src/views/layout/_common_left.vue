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

let method = ref(['Tree','Force_Directed'])

function turnView(type){
  if(type===method.value[0])
    router.push({name: method.value[0]})
  else if(type===method.value[1])
    router.push({name: method.value[1]})
  
}

</script>

<style scoped>
.left{
  width:200px;
  border:black solid 1px;
  border-top: none;
  /*background-color: green;*/
}
</style>
