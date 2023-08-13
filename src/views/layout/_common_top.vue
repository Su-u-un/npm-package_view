<template>
  <div class="header">
      <el-color-picker v-model="color"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {store} from '@/store.js'

const color = computed({
  get(){
    return store.color
  },
  set(newVal){
    store.color = newVal
  }
})
</script>

<style scoped>
.header{
  height:60px;
  border:black solid 1px
  /*background-color: pink;*/
}
</style>
