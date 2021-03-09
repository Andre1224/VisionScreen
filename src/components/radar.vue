<template>
  <div class="com-container">
    <div class="com-chart" ref="radar_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'radar',
  data () {
    return {
      chartInstance: null, // 局部echarts对象
      initData: null, // axios获取到的原始数据，由getData()方法进行进一步数据处理
      dataMax4: [
        {
          name: '资源整\n合能力',
          max: 100
        },
        {
          name: '服务供\n给能力',
          max: 100
        },
        {
          name: '政策执\n行能力',
          max: 100
        },
        {
          name: '自我发\n展能力',
          max: 100
        }
      ],
      dataMax5: [
        {
          name: '基本\n设施',
          max: 100
        },
        {
          name: '场馆\n开放',
          max: 100
        },
        {
          name: '馆办\n活动',
          max: 100
        },
        {
          name: '人员\n培训',
          max: 100
        },
        {
          name: '文化\n保护',
          max: 100
        }
      ],
      dataMax6: [
        {
          name: '数字化\n程度',
          max: 100
        },
        {
          name: '在线\n流量',
          max: 100
        },
        {
          name: '线下\n热度',
          max: 100
        },
        {
          name: '设施\n利用率',
          max: 100
        },
        {
          name: '用户\n满意度',
          max: 100
        },
        {
          name: '资源\n多元化',
          max: 100
        }
      ],
      standardSize: 0,
      themeState: true
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      // console.log('changed theme')
      this.themeState = !this.themeState
      this.chartInstance.dispose()
      this.initChart()
      this.labelStyle()
      this.screenAdapter()
      this.updateChart()
    }
  },
  created () {

  },
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

    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.radar_ref, this.theme)
      this.standardSize = this.$refs.radar_ref.offsetWidth / 100 * 3
      const initOption = {
        title: {
          text: '○ 多级服务效能评估',
          left: 30,
          top: 20
        },
        radar: [
          {
            indicator: this.dataMax4,
            shape: 'polygon',
            center: ['20%', '55%']
          },
          {
            indicator: this.dataMax5,
            shape: 'polygon',
            center: ['50%', '55%']
          },
          {
            indicator: this.dataMax6,
            shape: 'polygon',
            center: ['80%', '55%']
          }
        ],
        legend: {
          data: ['公共服务指标', '服务效能评估', '服务层级分析'],
          orient: 'horizontal', // horizontal vertical
          left: 'center',
          top: '95%'
        },
        series: [
          // 雷达1
          {
            radarIndex: 0,
            symbolSize: [5, 5],
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            label: {
              show: true
            },
            areaStyle: {} // 填充
          },
          // 雷达2
          {
            radarIndex: 1,
            symbolSize: [5, 5],
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },

            labelLayout: {
              moveOverlap: 'shiftX'
            },
            left: '20%',
            label: {
              show: true
            },
            areaStyle: {}
          },
          // 雷达3
          {
            radarIndex: 2,
            symbolSize: [5, 5],
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },

            labelLayout: {
              moveOverlap: 'shiftX'
            },
            left: '20%',
            label: {
              show: true
            },
            areaStyle: {}
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },

    getData: function () {
      // 获取数据
      this.$http.get('/static/data/radar.json').then((res) => {
        this.initData = res.data
        // console.log(this.initData)
        this.updateChart()
      })
    },

    updateChart: function () {
      const seriesArr = this.initData.map((item) => {
        return {
          data: [
            {
              name: item.name,
              value: item.value
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter: function () {
      this.standardSize = this.$refs.radar_ref.offsetWidth / 100 * 3
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.standardSize
          }
        },
        radar: [
          {
            radius: this.standardSize / 3 * 10,
            name: {
              textStyle: {
                fontSize: this.standardSize / 2
              }
            },
            nameGap: this.standardSize / 4
          },
          {
            radius: this.standardSize / 3 * 10,
            name: {
              textStyle: {
                fontSize: this.standardSize / 2
              }
            },
            nameGap: this.standardSize / 4
          },
          {
            radius: this.standardSize / 3 * 10,
            name: {
              textStyle: {
                fontSize: this.standardSize / 2
              }
            },
            nameGap: this.standardSize / 4
          }
        ],
        legend: {
          bottom: this.standardSize,
          itemWidth: this.standardSize / 2,
          itemHeight: this.standardSize / 2,
          itemGap: this.standardSize * 5.5,
          textStyle: {
            fontSize: this.standardSize / 1.5
          }
        },
        series: [
          {
            label: {
              textStyle: {
                fontSize: this.standardSize / 2,
                color: 'white'
              }
            }
          },
          {
            label: {
              textStyle: {
                fontSize: this.standardSize / 2,
                color: 'white'
              }
            }
          },
          {
            label: {
              textStyle: {
                fontSize: this.standardSize / 2,
                color: 'white'
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    labelStyle: function () {
      const option = {
        radar: [
          {
            name: {
              textStyle: {
                color: this.themeState ? 'white' : 'black'
              }
            }
          },
          {
            name: {
              textStyle: {
                color: this.themeState ? 'white' : 'black'
              }
            }
          },
          {
            name: {
              textStyle: {
                color: this.themeState ? 'white' : 'black'
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
