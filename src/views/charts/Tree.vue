<template>
  <div class="charts"></div>
</template>

<script setup lang="ts">
import D3view from '@/components/Tree'
import {defineProps, onMounted, onUpdated} from 'vue'
let props = defineProps({
  width:Number,
  height:Number
})

fetch('output/res.json')
  .then(response => response.json())
  .then(data => {
  
    function addChildElements(a, index) {
      const element = a[index];
      const children = element.requiring.map((childIndex) => {
        const child = a[childIndex];
        if (child.requiring.length) {
          child.children = []
          child.children.push(addChildElements(a,childIndex))
          return {
            id: child.id,
            version: child.version,
            path:child.path,
            meta:child.meta,
            requiring: child.requiring,
            requiredBy: child.requiredBy,
            children: child.children
          };
        } else {
          return {
            id: child.id,
            version: child.version,
            path:child.path,
            meta:child.meta,
            requiring: child.requiring,
            requiredBy: child.requiredBy,
          };
        }
      });
      element.children = children;
      return element;
    }
  
    const result = addChildElements(data, 0);
    func(result.children)

    // 添加value
    function func(data:any) {
      data.forEach((item:any) => {
        if (!item.children) {
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
    }, result)
    
  })
  .catch(error => {
    // 处理读取JSON文件时的错误
    console.error(error);
  })

</script>

<style scoped>
</style>
