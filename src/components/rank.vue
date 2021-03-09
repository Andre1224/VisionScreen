<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>

  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'rank',
  data () {
    return {
      chartInstance: null,
      initData: null,
      standardSize: 0,
      startValue: 0,
      endValue: 8,
      timeId: null
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
    // this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'rankData',
    //   chartName: 'rank',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
    // this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    initChart: function () {
      this.standardSize = this.$refs.rank_ref.offsetWidth / 100 * 3
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '⚪ 省级文化场馆综合排名',
          textStyle: {
            fontSize: this.standardSize
          },
          left: 30,
          top: 20
        },
        grid: {
          top: '30%',
          bottom: '15%',
          left: '10%',
          right: '10%',
          containerLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'bar',
            barWidth: this.standardSize,
            // 数据标签
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: 'white',
                fontSize: this.standardSize / 2.5
              }
            },
            // bar渐变色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#3c3eef'
                },
                {
                  offset: 1, color: '#a255ec'
                }
              ]
            }
          }
        ],
        // bar圆角
        itemStyle: {
          barBorderRadius: [this.standardSize / 2, this.standardSize / 2, 0, 0]
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
      // this.$http.get('rank').then((res) => {
      axios.get('/static/data/rank.json').then((res) => {
        this.initData = res.data.sort((a, b) => {
          return b.value - a.value
        })
        // console.log(this.initData)
        this.updateChart()
        this.startInterval()
      })
      // this.initData = res.sort((a, b) => {
      //   return b.value - a.value
      // })
      // console.log(this.initData)
      // this.updateChart()
    },

    updateChart: function () {
      const xAxisData = this.initData.map((item) => {
        return item.name
      })
      const yAxisData = this.initData.map((item) => {
        return item.value
      })
      // console.log(xAxisData)
      const dataOption = {
        xAxis: {
          data: xAxisData
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: yAxisData,
            itemStyle: {
              // color: 'red'
            },
            markLine: {
              label: {
                show: true,
                color: 'white'
              },
              data: [
                {
                  type: 'average',
                  name: '平均值'
                }
              ],
              lineStyle: {
                // color: 'white'
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter: function () {
      this.standardSize = this.$refs.rank_ref.offsetWidth / 100 * 3
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.standardSize
          }
        },
        series: [
          {
            barWidth: this.standardSize,
            label: {
              textStyle: {
                fontSize: this.standardSize / 2.5
              }
            }
          }
        ],
        itemStyle: {
          barBorderRadius: [this.standardSize / 2, this.standardSize / 2, 0, 0]
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    startInterval: function () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.initData.length - 1) {
          this.startValue = 0
          this.endValue = 8
        }
        this.updateChart()
      }, 1500)
    }
  }
}
</script>

<style scoped>

</style>
