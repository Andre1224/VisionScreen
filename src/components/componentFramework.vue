<template>
<!-- 组件外容器 -->
  <div class="com-container">
<!--  图表容器  -->
    <div class="com-chart" ref="trend_ref"></div>

  </div>
</template>

<script>
export default {
  name: 'componentFramework',
  data () {
    return {
      chartInstance: null, // 局部echarts对象
      initData: null // axios获取到的原始数据，由getData()方法进行进一步数据处理
    }
  },
  // 5.在Vue生命周期函数mounted执行时执行initChart进行图表初始化
  // 执行getData方法获取数据
  // 启动窗口尺寸变化的监听，变化时调用screenAdapter方法进行自适应
  // 手动调用screenAdapter方法根据初始化窗口尺寸设定初试值
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 1.图表初始化函数
    // 注册局部echarts对象和主题
    // 设置图表初始化配置对象option（包括基本类型，样式调整），图表数据由getData方法处理
    // 应用配置对象option
    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'vintage')
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 2.获取图表数据函数
    // 由ajax或axios从后端获取原始数据赋给initData
    // 对数据进行预处理，如：排序，计算参考值等 ，赋给全局data变量
    // 调用updateChart函数
    // updateChart方法启动后，启动计时器等附加功能
    getData: function () {
      // 获取数据
      this.$http.get().then((res) => {
        this.initData = res.data
        this.updateChart()
      })
    },
    // 3.将getData方法获取到的数据进行处理使其满足图表数据格式
    // 将数据通过dataOption对象再次赋给局部echarts
    updateChart: function () {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    // 4.监听容器尺寸变化，获取变化值
    // 将变化值通过adapterOption对象再次赋给局部echarts对象实现图表样式自适应变化
    // 调用chartInstance.resize()方法重置图表尺寸
    screenAdapter: function () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
