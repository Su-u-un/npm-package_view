<template>
  <el-aside>
    <div class="mes" v-if="!(JSON.stringify(data) === '{}')">
      <el-card class="mes-card">
        <template #header>
          <div class="card-header">
            <h3>
              <span class="package-name">{{ data.name ?? 'UNNAMED' }}</span> 
              <span class="package-version">{{ data.version ? ' v' + data.version : '' }}</span></h3>
          </div>
        </template>
        <div>{{ data.description }}</div>
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

.package-name {
  font-family: sans-serif;
  font-size: larger
}

.package-version {
  font-family: sans-serif;
  font-size: medium;
  float: right;
}

h3 {
  width: 100%;
  padding-right: 2em;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
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
