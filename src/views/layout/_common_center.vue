<template>
  <div id="center" ref="centerElement">
    <div class="view">
      <router-view/>
    </div>
    <div class="resize" @mousedown="handleMousedown" ref="resize"></div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'


let resizeBox:any = ref(null)
let currentBox:any = ref(null)
let rightBox:any = ref(null)
let dragBox:any = ref(null)
let startX:any = ref(null)
let curLen:any = ref(null)
let otherBoxWidth:any = ref(null)


// 监听鼠标点击，记录数据
function handleMousedown(e:any){
    resizeBox = e.target // 当前分割条
    currentBox = resizeBox.parentNode// 当前父盒子
    dragBox = currentBox.parentNode // 当前父盒子的父盒子
    rightBox = getNextElement(currentBox)// 当前盒子的下一个盒子
  
    if (!rightBox) return
    curLen = currentBox.clientWidth
    otherBoxWidth = dragBox.clientWidth - currentBox.clientWidth - rightBox.clientWidth // 其他盒子的宽度
    startX = e.clientX
  
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

// 获取下一个兄弟元素的兼容函数
function getNextElement (element:HTMLElement) {
    if (element.nextElementSibling) {
      return element.nextElementSibling
    } else {
      var next = element.nextSibling// 下一个兄弟节点
      while (next && next.nodeType !== 1) { // 有 并且 不是我想要的
        next = next.nextSibling
      }
      return next
    }
}

function onMousemove (e:any) {
  const endX = e.clientX
  const moveLen = endX - startX // （endx-startx）= 移动的距离
  const CurBoxLen = curLen + moveLen // resize[i].left+移动的距离=左边区域最后的宽度
  const rightBoxLen = dragBox.clientWidth - CurBoxLen - otherBoxWidth // 右侧宽度=总宽度-左侧宽度-其它盒子宽度
  // 当最小宽度时，无法继续拖动
  if (CurBoxLen <= 300 || rightBoxLen <= 300) return
  currentBox.style.width = CurBoxLen + 'px'// 当前盒子的宽度
  resizeBox.style.left = CurBoxLen // 设置左侧区域的宽度
  rightBox.style.width = rightBoxLen + 'px'
}

function onMouseup () {
  document.removeEventListener('mouseup', onMouseup)
  document.removeEventListener('mousemove', onMousemove)
}


</script>

<style scoped>
#center{
  height:calc(100vh - 60px);
  position: relative;
  width:100%;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.resize{
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  vertical-align: middle;
  cursor: col-resize;
  
  border-left: 5px solid var(--el-border-color) ;
}
.view{
  height:calc(100vh - 60px);
  display: flex;
  justify-content: center;
  width:100%;
  overflow: auto;
}
</style>
