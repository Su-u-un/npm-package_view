<template>
  <div id="center" ref="centerElement">
    <router-view :width="width" :height="height"/>
  </div>
</template>

<script lang="ts" setup>
import {ref,onMounted,nextTick,onUpdated} from 'vue'

// let dom = document.getElementById('center')
// console.log(dom)
let centerElement = ref(null)
let width = ref(null)
let height = ref(null)
onMounted(() => {
  nextTick(() => {
    if (centerElement.value) {
      width.value = centerElement.value.offsetWidth;
      height.value = centerElement.value.offsetHeight;
    }
  });
  
  window.addEventListener('mousedown', click)
});
function click(e){
  console.log(e)
}

</script>

<style scoped>
#center{
  flex:1;
  /*width:100%;*/
}
</style>
