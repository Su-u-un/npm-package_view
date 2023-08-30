<template>
  <div id="analyze" v-if="!(JSON.stringify(data)==='{}')">
    <el-descriptions
      class="des"
      title="分析配置"
      :column="1"
      border
      direction="vertical"
    >
      <el-descriptions-item >
        <template #label>
          <div class="cell-item">
            输入目录
          </div>
        </template>
        <el-tag class="tag" size="small">{{ data.name }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            递归深度
          </div>
        </template>
        <el-tag class="tag" size="small">{{(JSON.stringify(data.depth)==='null'?'Infinity':data.depth)}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            包管理器
          </div>
        </template>
        <el-tag class="tag" size="small">{{data.manager}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            搜索范围
          </div>
        </template>
        <el-tag class="tag" size="small" v-for="(value, key) in data.scope" :key="key">{{ value&&key }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <el-card class="card">
      <template #header>
        <div class="card-header">
          <el-descriptions
            class="des"
            border
            direction="vertical">
            <el-descriptions-item >
              <template #label>
                <div class="cell-item">
                  目录：{{data.name}}
                </div>
              </template>
              {{ data.pkgRoot }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>

      <div>
        <h5>已安装-{{ data.detected }}个</h5>
      </div>
      <div>
        <h5>已分析-{{ data.analyzed }}个</h5>
      </div>
      

      <h5>未安装-{{ data.notFound.length || 0}}个</h5>
      <div class="items" v-if="data.notFound.length">
        <span style="margin-left: 8px;"></span>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="(item, i) in data.notFound"
          :key="i"
        >
          <template #reference>
            <el-button class="item">{{ item.by }} -&gt; {{ item.id }}</el-button>
          </template>
          <div>
            类型：{{item.type}}
          </div>
          <div>
            版本：{{item.range}}
          </div>
        </el-popover>
      </div>
      <h5>未安装(可选)-{{ data.optionalNotMeet.length || 0 }}个</h5>
      <div class="items" v-if="data.optionalNotMeet.length">
        <span style="margin-left: 8px;"></span>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="(item, i) in data.optionalNotMeet"
          :key="i"
        >
          <template #reference>
            <el-button class="item">{{ item.id }}</el-button>
          </template>
          <div>
            类型：{{item.type}}
          </div>
          <div>
            版本：{{item.range}}
          </div>
        </el-popover>
      </div>

      <h5>版本不符-{{ data.rangeInvalid.length }}个</h5>
      <div class="items" v-if="data.rangeInvalid.length">
        <span style="margin-left: 8px;"></span>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="(item, i) in data.rangeInvalid"
          :key="i"
        >
          <template #reference>
            <el-button class="item">{{ item.id }}</el-button>
          </template>
          <div>
            类型：{{item.type}}
          </div>
          <div>
            版本范围：{{item.range}}
          </div>
          <div>
            当前版本：{{item.version}}
          </div>
          <div>
            包路径：{{item.dir}}
          </div>
        </el-popover>
      </div>

      <h5>未使用包</h5>
      <div>
        <li v-for="(item, i) in data.unused" :key="i" style="word-break: break-all;">
         包路径：{{ item }}
        </li>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount,ref, Ref} from "vue"

let data: Ref<any> = ref({})


onBeforeMount(()=>{
   update()
})


async function update(){
  await fetch("json/eval.json").then(res=>res.json()).then(
      temp=>{
        data.value = temp
      }).catch(err=>err)
}

</script>

<style lang="scss" scoped>
#analyze {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}
.des {
  margin-top: 20px;
  margin-bottom: 20px;
}

.tag {
  margin: 0.2em;
}

.item {
  margin: 0.3em;
}

.card{
  overflow: visible !important;
}

::-webkit-scrollbar {
  width: 0;
}

</style>
