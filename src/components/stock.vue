<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'stock',
  data () {
    return {
      chartInstance: null,
      initData: null,
      currentIndex: 1,
      standardSize: 0,
      timeId: null,
      timeId2: null
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
    // this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'stockData',
    //   chartName: 'stock',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
    // this.$socket.unRegisterCallBack('stockData')
  },
  methods: {

    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      this.standardSize = this.$refs.stock_ref.offsetWidth / 100 * 3
      const initOption = {
        title: {
          text: '⚪ 馆内场地使用情况',
          textStyle: {
            fontSize: this.standardSize
          },
          left: 30,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },

    getData: function (res) {
      // 获取数据
      // this.$http.get('stock').then((res) => {
      axios.get('/static/data/stock.json').then((res) => {
        this.initData = res.data
        // console.log(this.initData)
        this.updateChart()
        this.startInterval()
      })
      // this.initData = res
      // console.log(this.initData)
      // this.updateChart()
    },

    updateChart: function () {
      const centerArr = [
        // ['18%', '40%'],
        // ['50%', '40%'],
        // ['82%', '40%'],
        // ['34%', '75%'],
        // ['66%', '75%']
        ['20%', '60%'],
        ['50%', '60%'],
        ['80%', '60%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8811C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
        ['#E5DD45', '#E8811C'],
        ['#5052EE', '#AB6EE5'],
        ['#4FF778', '#0BA82C']
      ]
      const start = this.currentIndex * 3
      const end = (this.currentIndex + 1) * 3
      const showData = this.initData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [this.standardSize * 3.5, this.standardSize * 3],
          center: centerArr[index],
          hoverAnimation: false,
          label: {
            position: 'center',
            color: colorArr[index][0],
            fontSize: this.standardSize / 1.6
          },
          labelLine: {
            show: false
          },
          data: [
            {
              name: item.name + '\n\n\n' + item.sales + '/' + parseInt(item.stock + item.sales),
              value: item.sales,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: colorArr[index + this.currentIndex][0]
                    },
                    {
                      offset: 1, color: colorArr[index + this.currentIndex][1]
                    }
                  ]
                }
              }
            },
            {
              // name: item.name,
              value: item.stock,
              itemStyle: {
                color: '#a5a5a520'
              }
            }
          ]
        }
      })
      // console.log(showData)
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter: function () {
      this.standardSize = this.$refs.stock_ref.offsetWidth / 100 * 3
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.standardSize
          }
        },
        series: [
          // {
          //   type: 'pie',
          //   radius: [this.standardSize * 3.5, this.standardSize * 3],
          //   label: {
          //     fontSize: this.standardSize / 1.6
          //   }
          // },
          // {
          //   type: 'pie',
          //   radius: [this.standardSize * 3.5, this.standardSize * 3],
          //   label: {
          //     fontSize: this.standardSize / 1.6
          //   }
          // },
          {
            type: 'pie',
            radius: [this.standardSize * 3.5, this.standardSize * 3],
            label: {
              fontSize: this.standardSize / 1.6
            }
          },
          {
            type: 'pie',
            radius: [this.standardSize * 3.5, this.standardSize * 3],
            label: {
              fontSize: this.standardSize / 1.6
            }
          },
          {
            type: 'pie',
            radius: [this.standardSize * 3.5, this.standardSize * 3],
            label: {
              fontSize: this.standardSize / 1.6
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    startInterval: function () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 3) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 3000)
      //
      // if (this.timeId2) {
      //   clearInterval(this.timeId)
      // }
      // this.timeId2 = setInterval(() => {
      //   this.$http.get('stock').then((res) => {
      //     this.initData = res.data
      //   })
      // }, 3000)
    }
  }
}
</script>

<style scoped>

</style>
