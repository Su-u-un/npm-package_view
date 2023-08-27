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
        <h5>已检测依赖包-{{ data.detected }}个</h5>
      </div>
      <div>
        <h5>已分析依赖包-{{ data.analyzed }}个</h5>
      </div>
      

      <h5>未安装的必需包-{{ data.notFound.length ?data.notFound.length:0}}个</h5>
      <div v-if="data.notFound.length">
        <span style="margin-left: 12px;"></span>
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
      <h5>未安装的可选包-{{ data.optionalNotMeet.length?data.optionalNotMeet.length:0 }}个</h5>
      <div v-if="data.optionalNotMeet.length">
        <span style="margin-left: 12px;"></span>
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

      <h5>版本不符包-{{ data.rangeInvalid.length?data.rangeInvalid.length:0 }}个</h5>
      <div v-if="data.rangeInvalid.length">
        <span style="margin-left: 12px;"></span>
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

      <h5>未使用包</h5>
      <div>
        <p v-for="(item,index) in data.unused">
          {{index+1}}.包路径：{{ item }}
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount,ref} from "vue"

let data = ref({})



onBeforeMount(()=>{
   update()
})


async function update(){
  await fetch("output/eval-test-pkg.json").then(res=>res.json()).then(
      temp=>{
        data.value = temp
      }).catch(err=>err)
}


</script>

<style scoped>
#analyze{
  display: flex;
  flex-direction: column;
  width: 500px;
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
.el-card{
  overflow: visible !important;
}
::-webkit-scrollbar {
  width: 0;
}

</style>
