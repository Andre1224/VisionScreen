<template>
  <div class="com-container" @dblclick="backMap">
    <div class="com-chart" ref="map_ref"></div>
    <span class="span-province" v-text="province" :style="spanProvince"></span>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getMapCode } from '../../public/static/lib/adcode.js'
import { getMapName } from '../../public/static/lib/code2name'

export default {
  name: 'chinaMap',
  data () {
    return {
      chartInstance: null,
      initData: null,
      standardSize: null,
      mapData: {}, // 地图缓存
      province: null,
      resultArr: {},
      parentMap: 100000,
      currentMap: 100000

    }
  },
  computed: {
    ...mapState(['theme']),
    spanProvince () {
      return {
        fontSize: this.titleFontSize
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
    // this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'mapData',
    //   chartName: 'map',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('mapData')
  },
  methods: {

    initChart: function () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      this.standardSize = this.$refs.map_ref.offsetWidth / 100 * 3
      // http://192.168.2.9:8888/static/map/china.json
      axios.get('/static/map/chinaMapData/' + this.currentMap + '.json').then((res) => {
        // console.log(res.data)
        this.province = getMapName(this.currentMap)
        this.$echarts.registerMap('中国', res.data)

        const initOption = {
          title: {
            text: '⚪ 公共文化服务效能地图',
            textStyle: {
              fontSize: this.standardSize
            },
            left: 30,
            top: 30
          },
          geo: {
            type: 'map',
            map: '中国',
            top: '15%',
            bottom: '5%',
            // left: '20%',
            itemStyle: {
              areaColor: '#2c4780',
              borderBlockEnd: 'black'
            }
          },
          tooltip: {}
        }
        this.chartInstance.setOption(initOption)
      })
      // const name2pinyin = {
      //   安徽: 'anhui',
      //   陕西: 'shannxi',
      //   澳门: 'aomen',
      //   北京: 'beijing',
      //   重庆: 'chongqing',
      //   福建: 'fujian',
      //   甘肃: 'gansu',
      //   广东: 'guangdong',
      //   广西: 'guangxi',
      //   贵州: 'guizhou',
      //   海南: 'hainan',
      //   河北: 'hebei',
      //   黑龙江: 'heilongjiang',
      //   河南: 'henan',
      //   湖北: 'hubei',
      //   湖南: 'hunan',
      //   江苏: 'jiangsu',
      //   江西: 'jiangxi',
      //   吉林: 'jilin',
      //   辽宁: 'liaoning',
      //   内蒙古: 'neimenggu',
      //   宁夏: 'ningxia',
      //   青海: 'qinghai',
      //   山东: 'shandong',
      //   上海: 'shanghai',
      //   山西: 'shanxi',
      //   四川: 'sichuan',
      //   台湾: 'taiwan',
      //   天津: 'tianjin',
      //   香港: 'xianggang',
      //   新疆: 'xinjiang',
      //   西藏: 'xizang',
      //   云南: 'yunnan',
      //   浙江: 'zhejiang'

      // }

      // 监听点击事件
      this.chartInstance.on('click', (clickResult) => {
        this.titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3
        // console.log(clickResult.name + '的代码是: ' + getMapCode(clickResult.name))
        // 当前打开的地图
        this.currentMap = getMapCode(clickResult.name)

        axios.get('/static/map/chinaMapData/' + this.currentMap + '.json')
          .then((axiosResult) => {
            this.province = clickResult.name
            const acroutes = axiosResult.data.features[0].properties.acroutes
            // console.log('acroutes是' + acroutes)
            // console.log('lenght是' + acroutes.length)
            if (parseInt(this.currentMap) !== parseInt(acroutes[acroutes.length - 1])) {
              this.parentMap = acroutes[acroutes.length - 1]
            } else {
              this.parentMap = acroutes[acroutes.length - 2]
            }
            // console.log('currentMap是' + this.currentMap)
            // console.log('parentMap是' + this.parentMap)
            this.$echarts.registerMap(clickResult.name, axiosResult.data)
            const changeOption = {
              geo: {
                map: clickResult.name
              }
            }
            this.chartInstance.setOption(changeOption)
          })
        // console.log('click')
        // console.log(res.name + '-to-' + name2pinyin[res.name])
        // const path = '/static/map/province/' + name2pinyin[res.name] + '.json'
        // console.log(path)
        // const provinceName = name2pinyin[res.name]
        // 添加省名
        // if (res.name === '内蒙古') {
        //   this.province = res.name + '自治区'
        // } else if (res.name === '新疆') {
        //   this.province = res.name + '维吾尔自治区'
        // } else if (res.name === '西藏') {
        //   this.province = res.name + '自治区'
        // } else if (res.name === '宁夏') {
        //   this.province = res.name + '回族自治区'
        // } else if (res.name === '广西') {
        //   this.province = res.name + '壮族自治区'
        // } else if (res.name === '香港' || res.name === '澳门') {
        //   this.province = res.name + '特别行政区'
        // } else {
        //   this.province = res.name
        // }
        // 在mapData缓存中查找地图数据,不存在时再发起请求
        // console.log(provinceName + ':' + this.mapData[provinceName])
        // 未找到，在服务器中获取
        // if (this.mapData[provinceName]) {
        //   const changeOption = {
        //     geo: {
        //       map: provinceName
        //     }
        //   }
        //
        //   this.chartInstance.setOption(changeOption)
        // } else {
        //   axios.get('http://192.168.2.9:8888/static/map/province/' + provinceName + '.json')
        //     .then((res) => {
        //       this.mapData[provinceName] = res.data
        //       console.log(this.mapData)
        //       this.$echarts.registerMap(provinceName, res.data)
        //       const changeOption = {
        //         geo: {
        //           map: provinceName
        //         }
        //       }
        //       this.chartInstance.setOption(changeOption)
        //     })
        // }
      })
      // this.chartInstance.on('dblclick', (res) => {
      //   console.log('double Click')
      //   const changeOption = {
      //     geo: {
      //       map: 'china'
      //     }
      //   }
      //   this.chartInstance.setOption(changeOption)
      // })
    },

    getData: function (res) {
      // 获取数据
      // this.$http.get('map').then((res) => {
      axios.get('/static/data/map.json').then((res) => {
        this.initData = res.data
        // console.log(this.initData)
        this.updateChart()
      })
      // this.initData = res
      // console.log(this.initData)
      // this.updateChart()
    },

    updateChart: function () {
      // this.resultArr = this.initData.map((item) => {
      //   return this.resultArr[item.children.name] = item.children.result
      // })
      const legendArr = this.initData.map((item) => {
        return item.name
      })
      const seriesArr = this.initData.map((item) => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendArr,
          orient: 'vertical',
          bottom: '8%',
          left: '8%'
        },
        tooltip: {
          formatter: (arg) => {
            // this.initData.map((item) => {
            //   if (item.children.name === arg.name) {
            //     // console.log(item.children.result)
            //   }
            // })
            return '[' + arg.name + ']<br>' + '服务效能指数为: null'
          }
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

    screenAdapter: function () {
      this.standardSize = this.$refs.map_ref.offsetWidth / 100 * 3
      const adapterOption = {
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
            fontSize: this.standardSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    backMap: function () {
      this.currentMap = this.parentMap
      axios.get('/static/map/chinaMapData/' + this.currentMap + '.json')
        .then((axiosResult) => {
          // 加载上级地图
          this.province = getMapName(this.currentMap)
          const changeOption = {
            geo: {
              map: this.province
            }
          }
          this.chartInstance.setOption(changeOption)
          // 更新地图关系
          // const parent = axiosResult.data.features[0].properties.parent.adcode
          // const acroutes = axiosResult.data.features[0].properties.acroutes
          // if (this.currentMap === parent) {
          //   this.parentMap = acroutes[acroutes.length - 2]
          // } else {
          //   this.parentMap = parent
          // }
          const acroutes = axiosResult.data.features[0].properties.acroutes
          if (parseInt(this.currentMap) !== parseInt(acroutes[acroutes.length - 1])) {
            this.parentMap = acroutes[acroutes.length - 1]
          } else {
            this.parentMap = acroutes[acroutes.length - 2]
          }
          // this.$echarts.registerMap(clickResult.name, axiosResult.data)
        })
    }
  }
}
</script>

<style scoped>
.span-province {
  font-weight: bold;
  font-family: "微软雅黑";
  position: absolute;
  top: 10%;
  right: 10%;
  color: white;
  z-index: 10;
}

</style>
