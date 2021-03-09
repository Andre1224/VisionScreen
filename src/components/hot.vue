<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="spanStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="spanStyle">&#xe6ed;</span>
    <span class="subTitle" v-text="subTitle" :style="subTitleStyle"></span>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getThemeValue } from '../../public/static/lib/theme'

export default {
  name: 'hot',
  data () {
    return {
      chartInstance: null,
      initData: null,
      standardSize: 0,
      dataIndex: 0,
      subTitle: null
    }
  },
  computed: {
    subTitleStyle () {
      return {
        fontSize: this.standardSize / 2 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    spanStyle () {
      return {
        fontSize: this.standardSize * 2 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      // console.log('changed theme')
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
      // console.log(getThemeValue(this.theme))
    }
  },
  created () {
    // this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'hotData',
    //   chartName: 'hot',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('hotData')
  },
  methods: {

    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      this.standardSize = this.$refs.hot_ref.offsetWidth / 100 * 3
      const initOption = {
        title: {
          text: '⚪ 资源类别',
          textStyle: {
            fontSize: this.standardSize
          },
          left: 30,
          top: 30
        },
        legend: {
          orient: 'horizontal',
          bottom: '5%'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children

            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })

            let info = ''
            thirdCategory.forEach(item => {
              const infoName = item.name
              const infoPercent = item.value / total * 100
              info = info + infoName + ': ' + parseInt(infoPercent) + '%' + '<br>'
            })
            return info
          }
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            bottom: '5%',
            selectedMode: 'multiple',
            // roseType: 'radius', // radius:扇区半径取决于数据大小 area:半径不同，圆心角相同
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },

    getData: function (res) {
      // 获取数据
      // this.$http.get('hotproduct').then((res) => {
      axios.get('/static/data/hot.json').then((res) => {
        this.initData = res.data
        // console.log(this.initData)
        this.updateChart()
      })
      // this.initData = res
      // console.log(this.initData)
      // this.updateChart()
    },

    updateChart: function () {
      this.subTitle = this.initData[this.dataIndex].name
      const seriesData = this.initData[this.dataIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: seriesData.name
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter: function () {
      this.standardSize = this.$refs.hot_ref.offsetWidth / 100 * 3
      const adapterOption = {
        series: [
          {
            radius: this.standardSize * 5,
            center: ['50%', '55%']
          }
        ],
        title: {
          textStyle: {
            fontSize: this.standardSize
          }
        },
        legend: {
          itemWidth: this.standardSize / 2,
          itemHeight: this.standardSize / 2,
          itemGap: this.standardSize / 2,
          textStyle: {
            fontSize: this.standardSize / 1.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    toLeft: function () {
      this.dataIndex--
      if (this.dataIndex < 0) {
        this.dataIndex = this.initData.length - 1
      }
      this.updateChart()
    },

    toRight: function () {
      this.dataIndex++
      if (this.dataIndex > this.initData.length - 1) {
        this.dataIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.subTitle {
  font-weight: bold;
  font-family: "微软雅黑";
  position: absolute;
  top: 15%;
  left: 65%;
  color: white;
}
</style>
