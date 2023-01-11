import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
// import Element from './plugins/element'
import ElementPlus from 'element-plus'
import * as el from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'
import libs from '@/libs'
// import projectConfig from '@/projectConfig.js'
libs.el = el
libs["$alert"] = el.ElMessage
const app = createApp(App)
  // .use(store)
  // .use(router)
  // .use(VueAxios, axios)
  .use((app, options, name) => app.config.globalProperties[name] = options, libs, 'libs')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.configProject.globalData, 'globalData')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.request, 'request')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.api, 'api')
  // .use(Element)
  .use(ElementPlus)
  // .use((app, options, name) => app.config.globalProperties[name] = options, ElementPlus.ElMessage, 'ElMessage')
  .mount('#app')
// console.log(projectConfig.name);
app.echarts = echarts
window.X = { ...libs }
