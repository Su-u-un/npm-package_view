import './assets/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { existsSync } from 'fs'
import { exec } from 'child_process'

const app = createApp(App);

app.use(router)
app.use(ElementPlus)

app.mount('#app')

// 自动启动ngnix
if(existsSync("~/app/scripts/nginx-start.sh")) {
    exec("~/app/scripts/nginx-start.sh");
}
