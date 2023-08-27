<template>
  <div id="chart" class="charts" @click="click"></div>
</template>

<script setup lang="ts">
import D3view from '@/components/tree/chart.ts'
import {readme} from '@/utils'

const my = {
            chart: null,
            data: null
        }

fetch('output/test.json')
  .then(response => response.json())
  .then(data => {
    my.data = data
    my.chart = new D3view('#chart',data)
    
  })
  .catch(error => {
    // 处理读取JSON文件时的错误
    console.error(error);
  })

  function click(){
      readme(my.chart.clickNode,my.data);
    }
</script>

<style scoped>
</style>
