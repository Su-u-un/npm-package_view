<template>
  <div id="chart"></div>
</template>

<script lang="ts">
import D3view from './components/tree/chart'
import { json } from 'd3';

// 树状图
export default {
  name: 'tree',
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

<style lang="scss">
.tree { 
  &.node {
    @at-root circle#{&} {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 3px;
    }
    @at-root text#{R} {
      font: 12px sans-serif;
    }
  }

  &.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 4px;
    cursor: pointer;
  }

  &.tooltip-hr {
    text-align: center;
    line-height: 0px;
    &::after {
      content: "循环依赖";
      color: grey;
      background: white;
      padding: 0 10px;
      line-height: 1px;
      white-space: nowrap;
      z-index: 2;
    }
  }
} 
</style>

<style scoped>
</style>
