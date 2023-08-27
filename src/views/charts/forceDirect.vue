<template>
  <div id="chart"></div>
</template>


<script lang="ts">
import { select, json } from 'd3';
import Chart from "@/components/forceDirect/chart";
import '@/components/forceDirect/lib/css/d3-context-menu.css';
import '@/components/forceDirect/css/styles/soft/chart.css';

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
      json('json/res.json')
        .then((data: any) => {
          const cp = this;
          this.my.data = data;

          const container = select("#chart");

          // 自适应窗口大小
          const w = window,
            d = document,
            e = d.documentElement,
            gg = d.getElementsByTagName('body')[0];

          let width = w.innerWidth || e.clientWidth || gg.clientWidth;
          let height = w.innerHeight || e.clientHeight || gg.clientHeight;

          this.my.chart = new Chart(container, data, { showExtraneous: false });
          
          function updateWindow() {
            width = w.innerWidth || e.clientWidth || gg.clientWidth;
            height = w.innerHeight || e.clientHeight || gg.clientHeight;

            cp.my.chart!.resize(width, height);
          }
          select(window).on('resize.updatesvg', updateWindow);

          
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
