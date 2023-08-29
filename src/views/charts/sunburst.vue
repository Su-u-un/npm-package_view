<template>
  <div id="chart"></div>
</template>

<script lang="ts">
import D3view from './components/sunburst/chart'
import { json } from 'd3';

export default {
  name: 'sunburst',
  data(): {
    my: {
      chart: D3view | null,
      data: any
    }
  } {
    return {
      my: {
        chart: null,
        data: null
      }
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      json('json/res.json')
        .then((data: any) => {
          this.my.data = data
          this.my.chart = new D3view('#chart', data)
        })
        .catch(error => {
          // 处理读取JSON文件时的错误
          console.error(error);
        });
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
  