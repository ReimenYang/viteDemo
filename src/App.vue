<template>
  <div>
    <a
      href="https://vitejs.dev"
      target="_blank"
    >
      <img
        src="/vite.svg"
        class="logo"
        alt="Vite logo"
      />
    </a>
    <a
      href="https://vuejs.org/"
      target="_blank"
    >
      <img
        src="./assets/vue.svg"
        class="logo vue"
        alt="Vue logo"
      />
    </a>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>
<script>
// import HelloWorld from './components/HelloWorld.vue'
export default {
  // components: { HelloWorld },
  data () {
    return {}
  },
  // 在实例初始化之后，数据观测（data observer）和event/watcher事件配置之前被调用
  beforeCreate () {
    console.log('beforeCreate')
  },
  // 在实例创建完成后被立即调用。在这一步，实例已完成以下配置：数据观测（data observer）
  // 属性和方法的运算，watch/event事件回调。但是，挂载阶段还没开始，$el属性目前不可见
  async created () {
    console.log('created')
  },
  // 在挂载开始之前被调用：相关的编译函数首次被调用
  beforeMount () {
    console.log('beforeMount')
  },
  // el被新创建的vm.$el替换，挂载成功
  mounted () {
    console.log('mounted')
  },
  // 数据更新时调用
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  // 组件DOM已经更新，组件更新完毕
  updated () {
    console.log('updated')
  },
  beforeUnmount () {
    console.log('beforeDestroy')
  },
  unmounted () {
    console.log('destroy')
  }
}
</script>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  &.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
}
</style>
