<template>
    <div id="chart" @click="click"></div>
  </template>
  
  
  <script lang="ts" setup>
  import {readme} from '@/utils'
  import * as d3 from 'd3'
  import D3view from "@/components/sunburst/chart.ts"
  
  const my = {
              chart: null,
              data: null
          }
  
  d3.json('output/test.json')
    .then(data => {
      my.data = data;
      
      my.chart = new D3view('#chart', data);
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
  