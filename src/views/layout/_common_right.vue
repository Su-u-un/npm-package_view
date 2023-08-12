<template>
  <aside class=right>
    <div v-if="store.data===undefined"></div>
    <div v-else>
      {{store.data.data.id}}
    </div>
  </aside>
</template>

<script setup lang="ts">
import {watch} from 'vue'
import {store} from '@/store.js'

watch(store.data, (newX) => {
  console.log(`x is ${newX}`)
})
</script>

<style scoped>
.right {
  width:400px;
  background-color: blue;
}
</style>
