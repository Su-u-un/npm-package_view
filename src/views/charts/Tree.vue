<template>
  <div id="chart" class="charts"></div>
</template>

<script setup lang="ts">
import D3view from '@/components/tree/chart'

const my = {
  chart: null,
  data: null
}

fetch('json/res.json')
  .then(response => response.json())
  .then(data => {
    my.data = data
    my.chart = new D3view('#chart', data)

  })
  .catch(error => {
    // 处理读取JSON文件时的错误
    console.error(error);
  })
</script>

<style>
.tree.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.tree.node text {
  font: 12px sans-serif;
}

.tree.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 4px;
  cursor: pointer;
}
</style>

<style scoped>
body {
  display: block;
  width: 100%;
  height: 100%;
}

#chart {
  display: block;
}
</style>
