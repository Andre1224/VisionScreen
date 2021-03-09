<template>
  <div class="com-container">
    <div class="title" :style="comStyle">

      <span v-text="'⚪ ' + showTitle" :style="comStyle"></span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-container" v-show="showChoice">

        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)" :style="marginStyle">

          {{'⚪ ' + item.text }}

        </div>

      </div>

    </div>
    <div class="com-chart" ref="trend_ref">

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getThemeValue } from '../../public/static/lib/theme'
// import { getLocalComponentData } from '../../public/static/lib/getLocalData'

export default {
  name: 'trend',
  data () {
    return {
      chartInstance: null,
      initData: null,
      showChoice: false,
      choiceType: 'map',
      titleFontSize: 0
      // choiceTitle: '地区销量趋势'
    }
  },
  computed: {
    ...mapState(['theme']),
    selectTypes () {
      if (!this.initData) {
        return []
      } else {
        return this.initData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.initData) {
        return []
      } else {
        return this.initData[this.choiceType].title
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle () {
      return {
        color: getThemeValue(this.theme).titleColor
        // marginLeft: this.titleFontSize / 2.5 + 'px'
      }
    }
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
    // this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'trendData',
    //   chartName: 'trend',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('trendData')
  },
  methods: {
    handleSelect: function (key) {
      this.choiceType = key
      this.showChoice = false
      this.updateChart()
    },
    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        grid: {
          top: '35%',
          bottom: '15%',
          left: '10%',
          right: '10%',
          containerLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    getData: function (res) {
      // 获取数据
      // this.$http.get('trend').then((res) => {
      axios.get('/static/data/trend.json').then((res) => {
        this.initData = res.data
        // console.log(this.initData)
        this.updateChart()
      })
      // this.initData = res
      // console.log(this.initData)
      // this.updateChart()
    },
    updateChart: function () {
      // 类目轴数据
      const colorArr1 = [
        'rgba(254,33,30,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      const timeArr = this.initData.common.month
      // y轴值
      const mapOriginData = this.initData[this.choiceType].data
      const areaLineDataArr = mapOriginData.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          // stack: this.choiceType,
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: colorArr1[index]
                },
                {
                  offset: 1, color: colorArr2[index]
                }
              ]
            }
          }
        }
      })
      // 图例数据
      const legendArr = mapOriginData.map((item) => {
        return item.name
      })
      // console.log(areaLineDataArr)
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr,
          top: this.titleFontSize * 3,
          icon: 'circle'
        },
        series: areaLineDataArr

      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter: function () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3
      const adapterOption = {
        legend: {
          top: this.titleFontSize * 3.5,
          itemWidth: this.titleFontSize * 0.6,
          itemHeight: this.titleFontSize * 0.6,
          itemGap: this.titleFontSize * 0.6,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>
.title {
  position: absolute;
  z-index: 10;
  color: white;
  top: 20px;
  left: 30px;
}
.title-icon {
  cursor: pointer;
  margin-left: 10px;
}
.select-item {
  cursor: pointer;
  margin-top: 2px;
  padding-left: 0;
  margin-left: 0;
}
.select-container {
  margin-top: 5px;
  background-color: #66666633;
  border-radius: 5px;

}
</style>
