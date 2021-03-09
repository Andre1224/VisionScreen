<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'seller',
  data () {
    return {
      chartInstance: null,
      initData: null,
      standardSize: 0,
      currentPage: 1, //  当前页数
      totalPage: 3, // 总页数
      timeId: null
      // xData: [],
      // yData: []
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      // console.log('changed theme')
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  created () {
    // this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'sellerData',
    //   chartName: 'seller',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timeId)
    // 组件销毁时取消dom监听
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {

    //  初始化echarts对象
    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      const initOption = {
        title: {
          text: '⚪ 热门资源下载统计',
          textStyle: {
            fontSize: 30
          },
          left: 30,
          top: 30
        },
        grid: {
          top: '25%',
          bottom: '10%',
          left: '15%',
          right: '10%',
          containerLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          nameTextStyle: {
            fontSize: 100
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 50,
            // 数据标签
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            // bar渐变色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0, color: '#5052ee'
                },
                {
                  offset: 1, color: '#ab6ee5'
                }
              ]
            },
            // bar右侧圆角
            itemStyle: {
              barBorderRadius: [0, 25, 25, 0]
            }
          }
        ],
        // 提示框
        tooltip: {
          trigger: 'axis',
          // bar背景高亮
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 52,
              color: '#2d3443'
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
      // 对图标对象进行鼠标事件监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },

    //  获取数据
    getData: function (res) {
      //  数据地址：http://localhost:3000/api/seller
      // this.$http.get('seller').then((res) => {
      axios.get('/static/data/seller.json').then((res) => {
      //   //  console.log(res.data)
        this.initData = res.data.sort((a, b) => {
          return a.value - b.value
        })
        this.totalPage = this.initData.length % 6 === 0 ? this.initData.length / 6 : this.initData.length / 6 + 1
        this.updateChart()
        // 启动定时器
        this.startInterval()
      //   //  原始数据排序
      //   this.initData.sort((a, b) => {
      //     return a.value - b.value
      //   })
      //   //  计算图表总页数
      //   this.totalPage = this.initData.length % 5 === 0 ? this.initData.length / 5 : this.initData.length / 5 + 1
      //   this.updateChart()
      //   // 启动定时器
      //   this.startInterval()
      // })
      // this.initData = res
      // console.log(this.initData)
      // 原始数据排序
      // this.initData = this.initData.sort((a, b) => {
      //   return a.value - b.value
      })
      //  计算图表总页数
      // this.totalPage = this.initData.length % 6 === 0 ? this.initData.length / 6 : this.initData.length / 6 + 1
      // this.updateChart()
      // // 启动定时器
      // this.startInterval()
    },

    //  更新图表数据
    updateChart: function () {
      // this.initData.map((item) => {
      //   this.xData.push(item.name)
      //   this.yData.push(item.value)
      // })
      // console.log('xData:==================')
      // console.log(this.xData)
      // console.log('yData:==================')
      // console.log(this.yData)
      // 数据总条数18，单页显示6，设置数据切片
      const start = (this.currentPage - 1) * 6 // 0  6 23
      const end = this.currentPage * 6 // 5  12  18
      const showData = this.initData.slice(start, end)
      const Name = showData.map((item) => {
        // console.log(item.name)
        return item.name
      })
      const Value = showData.map((item) => {
        // console.log(item.value)
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: Name
        },
        series: [
          {
            data: Value
          }
        ]
      }

      this.chartInstance.setOption(dataOption)
    },

    // 定时切换数据
    startInterval: function () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },

    // 分辨率自适应
    screenAdapter: function () {
      // console.log(this.$refs.seller_ref.offsetWidth)
      this.standardSizee = this.$refs.seller_ref.offsetWidth / 100 * 3
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.standardSizee
          }
        },
        xAxis: {
          nameTextStyle: {
            fontSize: this.standardSize
          }
        },
        series: [
          {
            label: {
              textStyle: {
                fontSize: this.standardSizee / 2
              }
            },
            barWidth: this.standardSizee,
            // bar右侧圆角
            itemStyle: {
              barBorderRadius: [0, this.standardSizee / 2, this.standardSizee / 2, 0]
            }
          }
        ],
        // 提示框
        tooltip: {
          // bar背景高亮
          axisPointer: {
            lineStyle: {
              width: this.standardSizee
            }
          }
        }
      }
      // console.log(titleFontSize)
      this.chartInstance.setOption(adapterOption)
      // 自适应图表大小
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
