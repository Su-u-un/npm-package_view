<template>
  <el-aside>
    <div class="mes" v-if="!(JSON.stringify(data) === '{}')">
      <el-card class="mes-card">
        <template #header>
          <div class="card-header">
            <h3>{{ data.name }}</h3>
          </div>
        </template>
        <div>{{ data.description }}</div>
        <div>
          <div v-for="item in data.parent">{{ item }}</div>
        </div>
        <div>
          <div v-for="item in data.children">
            <h4>name：{{ item.name }}</h4>
            <div>版本范围：{{ item.range }}</div>
            <div>依赖类型：{{ item.type }}</div>
            <div>依赖是否可选：{{ item.optional }}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="readme" v-if="readme">
      <el-card class="readme-card">
        <div v-html="readme"></div>
      </el-card>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/store.js'
import 'highlight.js/scss/lightfair.scss';

const data = computed(() => store.data)
const readme = computed(() => store.readme)
</script>

<style lang="scss">
$en-fonts: hack, consolas, monaco;
$cn-fonts: 方正准圆简体, 青鸟华光准圆, 有爱圆体 CN, 幼圆;

:not(pre)>code {
  font-family: $en-fonts, $cn-fonts, monospace;
  font-size: small;
}
pre>code {
  font-family: $en-fonts, $cn-fonts, monospace;
  font-size: small;
  border: {
    width: 0.2em;
    color: gray;
    radius: 0.2em;
  }
}
</style>

<style scoped>
.el-aside {
  display: flex;
  flex-direction: column;
  width: 40%;
  height: calc(100vh - 60px);
  border-top: none;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 0;
}

.mes {
  height: 30%;
  margin: 1em;
}

.readme {
  height: 70%;
  margin: 1em;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mes-card {
  width: 100%;
  height: 100%;
}

.readme-card {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

</style>
