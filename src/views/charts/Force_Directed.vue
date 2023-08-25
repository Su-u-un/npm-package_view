<template>
  <div id="chart" @click="click"></div>
</template>


<script lang="ts">
import Chart from "@/express/chartTS/chart"
import * as d3 from 'd3'
import '@/express/chartTS/lib/css/d3-context-menu.css'
import "@/express/public/css/chart.css"
import { join } from 'path-browserify';

export default {
  name: 'ForceDirected', 
  data(): {
    my: { chart: Chart | null, data: any },
    svg: d3.Selection<any, any, any, any> | null
  } { 
    return {
      my: { chart: null, data: null },
      svg: null
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      d3.json('output/test.json')
      .then((data: any) => {
        this.my.data = data;

        const svg = d3.select("#chart").append("svg");

        // 自适应窗口大小
        const w = window,
        d = document,
        e = d.documentElement,
        gg = d.getElementsByTagName('body')[0];

        let width = w.innerWidth || e.clientWidth || gg.clientWidth;
        let height = w.innerHeight || e.clientHeight|| gg.clientHeight;

        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height].join(','))
            .attr("style", "max-width: 100%; max-height: 100%;");

        function updateWindow(){
            width = w.innerWidth || e.clientWidth || gg.clientWidth;
            height = w.innerHeight || e.clientHeight|| gg.clientHeight;

            svg.attr("width", width).attr("height", height);
        }
        d3.select(window).on('resize.updatesvg', updateWindow);

        this.my.chart = new Chart(svg, data, { showExtraneous: false });
      })
      .catch(error => {
        // 处理读取JSON文件时的错误
        console.error(error);
      })
    }
  }
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
