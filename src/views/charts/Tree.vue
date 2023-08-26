<template>
  <div id="chart" class="charts"></div>
</template>

<script lang="ts">
import D3view from '@/components/tree/chart'
import { json } from 'd3';

export default {
  name: 'TreeChart',
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
