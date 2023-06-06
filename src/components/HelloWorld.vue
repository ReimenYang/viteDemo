

<template>
  <h1>{{ msg }}</h1>
  <div
    v-for="item in serialportList"
    :key="item.vendorId"
    @click="portOpen(item)"
  >
    {{ item.friendlyName }}
    <button v-if="item.isOpen">关闭</button>
  </div>
  <div class="card">
    <button
      type="button"
      @click="getGlobal"
    >检查公共对象</button>
  </div>
  <div class="card">
    <button
      type="button"
      @click="getAllWindows"
    >检查Windows对象</button>
  </div>
  <div class="card">
    <button
      type="button"
      @click="count++"
    >count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a
      href="https://vuejs.org/guide/quick-start.html#local"
      target="_blank"
    >create-vue</a>, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
    >Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>
<script>
import { ref } from 'vue'
import { useIpcRenderer } from "@vueuse/electron";
const ipcRenderer = useIpcRenderer();
function sleep (time = 100) { return new Promise(resolve => setTimeout(resolve, time)) }
export default {
  props: {
    msg: String
  },
  data () {
    return { count: ref(0), serialportList: [{}] }
  },
  // 在实例创建完成后被立即调用。在这一步，实例已完成以下配置：数据观测（data observer）
  // 属性和方法的运算，watch/event事件回调。但是，挂载阶段还没开始，$el属性目前不可见
  async created () {
    window.Y = this

    this.serialportList = await this.portScan()
    window.serialportList = this.serialportList
    ipcRenderer.on("portReply", (event, ...args) => {
      if (args[0].data.startsWith('SPP: ok')) return
      console.log("渲染进程收到的数据:", args[0].data);
    })
    ipcRenderer.on("getGlobal", (event, ...args) => { console.log("渲染进程收到的getGlobal:", event, args); })
    ipcRenderer.on("getAllWindows", (event, ...args) => { console.log("渲染进程收到的getAllWindows:", event, args); })
  },
  methods: {
    portScan () {
      return new Promise(resolve => {
        let result = ipcRenderer.invoke('serialportList')
        setTimeout(() => resolve(result), 10)
      })
    },
    portOpen (item) {
      ipcRenderer.invoke('serialportOpen', '', {
        path: item.path,
        autoOpen: false,
        baudRate: 9600
      })
      item.isOpen = true
    },
    portSend (item) {
      ipcRenderer.invoke('serialportSend', {
        path: item.path,
        baudRate: 9600
      })
    },
    getGlobal () {
      ipcRenderer.invoke('getGlobal')
    },
    getAllWindows () {
      ipcRenderer.invoke('getAllWindows')
    }
  }
}
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
