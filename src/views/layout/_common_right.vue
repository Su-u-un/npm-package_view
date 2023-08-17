<template>
  <el-aside>
    <div class="mes" v-if="!(JSON.stringify(data)==='{}') ">
      <el-card class="mes-card">
        <template #header>
          <div class="card-header">
            <h3>{{ data.name }}</h3>
          </div>
        </template>
        <div>{{data.description}}</div>
        <div>
          <div v-for="item in data.parent">{{item}}</div>
        </div>
        <div>
          <div v-for="item in data.children">
            <h4>name：{{item.name}}</h4>
            <div>版本范围：{{item.range}}</div>
            <div>依赖类型：{{item.type}}</div>
            <div>依赖是否可选：{{item.optional}}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="mes" v-if="readme">
      <el-card class="readme-card">
        <div v-html="readme"></div>
      </el-card>
    </div>
    
  </el-aside>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {store} from '@/store.js'


const data = computed(()=>store.data)
const readme = computed(()=>store.readme)


</script>


<style scoped>
.el-aside {
  display:flex;
  flex-direction: column;
  width:100vh;
  height:calc(100vh - 60px);
  border-top: none;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 0;
}

.mes{
  margin-top:20px;
  display: flex;
  justify-content: center;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mes-card {
  width: 400px;
}
.readme-card{
  width:450px;
}
</style>
