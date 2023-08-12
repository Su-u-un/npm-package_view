<template>
  <div class="charts"></div>
</template>

<script setup lang="ts">
import D3view from '@/components/Tree'
import {defineProps} from 'vue'

let props = defineProps({
  width:Number,
  height:Number
})

fetch('output/res1.json')
  .then(response => response.json())
  .then(data => {
    // 为所有节点加入children数组
    const nodes = data.map.map((node:any) => ({ ...node, children: [] }));
    // 第一层遍历得到对应index节点的依赖节点数组
    data.borders.forEach((border:number[], index:number) => {
      // 第二层遍历得到数组内对应index节点的依赖节点
      border.forEach((childIndex:any) => {
        nodes[index].children.push(nodes[childIndex]);
      });
    });

    // item就是根目录下的依赖包，依赖存在item的children内
    let item = nodes[0]
    // 给最终的节点加上随机的value，用于排序
    func(item.children)

    // 添加value
    function func(data:any) {
      data.forEach((item:any) => {
        if (!item.children.length) {
          item.value = Number((Math.random() * 100).toFixed(0))
        }
        else {
          func(item.children)
        }
      })
    }

    let dom = document.getElementsByClassName('charts')


    D3view({
      dom: dom[0],
      duration:300,
      height:props.height,
      width:props.width
    }, item)
  })
  .catch(error => {
    // 处理读取JSON文件时的错误
    console.error(error);
  })


</script>

<style scoped>
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}
.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 4px;
  cursor: pointer;
}

.chartTooltip {
  position: absolute;
  width: 200px;
  height: auto;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.chartTooltip.hidden {
  display: none;
}

.chartTooltip p {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
}
</style>
