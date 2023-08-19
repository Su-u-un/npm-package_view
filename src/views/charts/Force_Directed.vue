<template>
  <div id="chart" @click="click"></div>
</template>


<script lang="ts" setup>
import {readme} from '@/utils'
import Chart from "@/express/chartTS/chart.ts"
import * as d3 from 'd3'
// import '@/express/public/js/chartMenu.js'
import '@/express/chartTS/lib/css/d3-context-menu.css'
// import '@/express/chartTS/lib/d3-context-menu.js'
import "@/express/public/css/chart.css"

const my = {
            chart: null,
            data: null
        }

fetch('output/res.json')
  .then(response => response.json())
  .then(data => {

    /*初始化宽高*/
    const ct = d3.select("#chart");
    let { innerWidth: width, innerHeight: height } = window;
    height -= 65

    // 这里我们将svg元素，和子group元素拆分
    const svg = ct
      .append("svg")
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [- width / 2, - height / 2, width, height])
      .attr("style", "max-width: 100%; max-height: 100%;");

    // 自适应窗口大小
    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0];

    function updateWindow() {
      width = w.innerWidth || e.clientWidth || g.clientWidth;
      height = (w.innerHeight || e.clientHeight || g.clientHeight) - 65;

      svg.attr("width", width).attr("height", height);
    }

    d3.select(window).on('resize.updatesvg', updateWindow);

    my.chart = new Chart(
      svg,
      data, {
      showExtraneous: false
    });
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
