<template>
  
  <div class="analyze" v-if="!(JSON.stringify(data)==='{}')">
    <el-descriptions
      class="des"
      title="分析配置"
      :column="4"
      border
    >
      <el-descriptions-item >
        <template #label>
          <div class="cell-item">
            输入目录
          </div>
        </template>
        <el-tag size="small">{{ data.name }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            递归深度
          </div>
        </template>
        <el-tag size="small">{{(JSON.stringify(data.depth)==='null'?'Infinity':data.depth)}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            包管理器
          </div>
        </template>
        <el-tag size="small">{{data.manager}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            搜索范围
          </div>
        </template>
        <el-tag size="small" v-for="(value,key) in data.scope">{{ value&&key }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <el-card class="card">
      <template #header>
        <div class="card-header">
          <el-descriptions
        class="des"
        border>
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
        <h4>已检测依赖包-{{ data.detected }}个</h4>
      </div>
      <div>
        <h4>已分析依赖包-{{ data.analyzed }}个</h4>
      </div>
      

      <h4>未安装的必需包-{{ data.notFound.length ?data.notFound.length:0}}个</h4>
      <div>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="item in data.notFound"
        >
          <template #reference>
            <el-button>{{ item.id }}</el-button>
          </template>
          <div>
            类型：{{item.type}}
          </div>
          <div>
            版本范围：{{item.range}}
          </div>
        </el-popover>
      </div>
      <h4>未安装的可选包-{{ data.optionalNotMeet.length }}个</h4>
      <div>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="item in data.optionalNotMeet"
        >
          <template #reference>
            <el-button>{{ item.id }}</el-button>
          </template>
          <div>
            类型：{{item.type}}
          </div>
          <div>
            版本范围：{{item.range}}
          </div>
        </el-popover>
      </div>

      <h4>版本不符包-{{ data.rangeInvalid.length }}个</h4>
      <div>
        <el-popover
          placement="right"
          trigger="hover"
          v-for="item in data.rangeInvalid"
        >
          <template #reference>
            <el-button>{{ item.id }}</el-button>
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

      <h4>未使用包</h4>
      <div>
        <div v-for="item in data.unused">
          包路径：{{ item }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {onMounted,onBeforeMount,ref} from "vue"

let data = ref({})


onBeforeMount(async ()=>{
  await fetch("output/eval-test-pkg.json").then(res=>res.json()).then(
      temp=>{
        data.value = temp
      }).catch(err=>err)


})


</script>

<style scoped>
.analyze{
  display: flex;
  flex-direction: column;
  width:700px;
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
.card{
  height: 100%;
}
.el-card{
  overflow: visible !important;
}
::-webkit-scrollbar {
  width: 0;
}

</style>
