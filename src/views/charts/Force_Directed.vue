<template>
  <div id="chart" @click="click"></div>
</template>


<script lang="ts" setup>
import {readme} from '@/utils'
// import Chart from "@/express/chartTS/chart.ts"
import Chart from "@/express/public/js/chart.js"
import * as d3 from 'd3'
import '@/express/chartTS/lib/css/d3-context-menu.css'
// import '@/express/chartTS/lib/d3-context-menu.js'
import "@/express/public/css/chart.css"

const my = {
            chart: null,
            data: null
        }

d3.json('output/test.json')
  .then(data => {
    my.data = data;
    
    my.chart = new Chart('#chart', data, { showExtraneous: false });
  })
  .catch(error => {
    // 处理读取JSON文件时的错误
    console.error(error);
  })
    function click(){
      readme(my.chart.node,my.chart.nodes);
    }

</script>

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
