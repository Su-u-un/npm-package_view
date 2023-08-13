<template>
  <aside class=right>
    <div v-if="store.data===undefined"></div>
    <div v-else>
      <div>
        NAME:{{data.id}}
      </div>
      <div>
        PATH:{{data.path}}
      </div>
      <div>
        VERSION:{{data.version}}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import {store} from '@/store.js'

let data = computed(()=>{
  return store.data.data
})
</script>

<style scoped>
.right {
  width:400px;
  border:black solid 1px;
  border-top: none;
  /*background-color: blue;*/
}
</style>
