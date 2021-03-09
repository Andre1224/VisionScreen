<template>
  <div class="screen-container" :style="backgroundColor" ref="screen_ref">
    <header class="screen-header">
      <div>
        <img :src="headerBorderSrc" alt=""  class="screen-header-img">
      </div>
      <span class="logo">
        <img :src="？logoSrc" alt=""  class="screen-header-logo">
      </span>
      <span class="title" :style="titleStyle">XXXXXXXXXXXXXXXXX</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="changeTheme">
        <span class="datetime" v-text="timeData" :style="timeDateStyle"></span>
      </div>
    </header>
    <div class="screen-body">

      <section class="screen-left">

<!--        <div id="left-top" class="fullscreen">-->
        <div id="left-top" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 馆内场地使用情况 -->
          <stock ref="stock"></stock>
          <div class="resize">
            <span :style="titleColor" @click="changeSize('stock')"  :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

        <div id="left-middle" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 城市文化活动发展趋势 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

        <div id="left-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 省级文化场馆综合排名 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('rank')"  :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

      </section>

      <section class="screen-middle">

        <div id="middle-top" :class="[fullScreenStatus.chinaMap ? 'fullscreen' : '']">
          <!-- 重点文化服务地图 -->
          <china-map ref="chinaMap"></china-map>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('chinaMap')"  :class="['iconfont', fullScreenStatus.chinaMap ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

        <div id="middle-bottom" :class="[fullScreenStatus.radar ? 'fullscreen' : '']">
          <!-- 服务效能雷达图 -->
          <radar ref="radar"></radar>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('radar')"  :class="['iconfont', fullScreenStatus.radar ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>

        </div>
        <div class="copyRightText">
          <span><a href="http://www.beian.gov.cn/portal/recordQuery" style="text-decoration: none;color: white">&nbsp;</a></span>
          <span><a href="https://beian.miit.gov.cn/#/Integrated/index" style="text-decoration: none;color: white;margin-left: 20px">陕ICP备20002864号-1</a></span>
        </div>
      </section>

      <section class="screen-right">

        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 资源类别 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('hot')"  :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

        <div id="right-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">

          <!-- 热门资源下载统计 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <span  :style="titleColor" @click="changeSize('seller')"  :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>

<script>
import chinaMap from '@/components/chinaMap.vue'
import hot from '@/components/hot.vue'
import rank from '@/components/rank.vue'
import seller from '@/components/seller.vue'
import stock from '@/components/stock.vue'
import trend from '@/components/trend.vue'
import radar from '@/components/radar'
import { mapState } from 'vuex'
import { getThemeValue } from '../../public/static/lib/theme'

export default {
  name: 'screen',
  data () {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        chinaMap: false,
        hot: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false,
        radar: false
      },
      timeData: null,
      timer: null,
      screenWidth: null
    }
  },
  computed: {
    ...mapState(['theme']),
    // 主背景色
    backgroundColor () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor
      }
    },
    // 主背景标题颜色
    titleStyle () {
      return {
        color: getThemeValue(this.theme).titleColor,
        fontSize: this.screenWidth * 0.012 + 'px',
        fontWeight: 'bold'
      }
    },
    timeDateStyle () {
      return {
        color: getThemeValue(this.theme).titleColor,
        fontSize: this.screenWidth * 0.01 + 'px'
      }
    },
    // logo样式
    logoSrc () {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    // 主题切换图标样式
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    // 主背景顶部框线样式
    headerBorderSrc () {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    }
  },
  created () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.getTimeData()
    }, 1000)
    // 注册接收到数据的回调函数
    // this.$socket.registerCallBack('fullScreen', this.recvFullScreen)
    // this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  mounted () {
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
    this.getTimeData()
  },
  destroyed () {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    // this.$socket.unRegisterCallBack('fullScreen')
    // this.$socket.unRegisterCallBack('themeChange')
  },
  methods: {
    screenAdapter: function () {
      this.screenWidth = this.$refs.screen_ref.offsetWidth
      console.log('Screen width is: ' + this.screenWidth + 'px now')
    },
    recvThemeChange: function () {
      this.$store.commit('changeTheme')
    },
    changeTheme: function () {
      // 修改主题
      this.$store.commit('changeTheme')
      // this.$socket.send({
      //   action: 'themeChange',
      //   socketType: 'themeChange',
      //   chartName: '',
      //   value: ''
      // })
    },

    recvFullScreen: function (data) {
      // 取出图表和动作
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    getTimeData: function () {
      const time = new Date()
      this.timeData = time.getFullYear() + '年' + time.getMonth() + 1 + '月' + time.getDate() + '日' + ' ' + time.toLocaleTimeString()
    },
    changeSize (chartName) {
      // console.log(chartName)
      // 1.改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      // this.$refs[chartName].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
      // 将数据发送给服务端
      // this.$socket.send({
      //   action: 'fullScreen',
      //   socketType: 'fullScreen',
      //   chartName: chartName,
      //   value: !this.fullScreenStatus[chartName]
      // })
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
    }
  },
  components: {
    hot,
    chinaMap,
    rank,
    seller,
    stock,
    trend,
    radar
  }
}
</script>

<style scoped>
 /*全屏样式的定义*/
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #040726;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

}

 .screen-header-img {
   padding-top: 11px;
   width: 100%;
   height: 42px;
 }

.screen-header-logo {
  margin-top: 1%;
  padding-left: 2.5%;
  width: 24%;
}

.title {
 position: absolute;
 left: 50%;
 top: 50%;
 font-size: 20px;
 transform: translate(-50%, -50%);
}

.title-right {
 display: flex;
 align-items: center;
 position:absolute;
 right: 0px;
 top: 50%;
 transform: translateY(-80%);
}

.qiehuan {
 width: 28px;
 height: 21px;
 cursor: pointer;
}

.datetime {
 font-size: 15px;
 margin-left: 10px;
}

.logo {
 position: absolute;
 left: 0px;
 top: 80%;
 transform: translateY(-80%);
}

.screen-body {
   width: 100%;
   height: 100%;
   display: flex;
   margin-top: 10px;
}

.screen-left {
   height: 100%;
   width: 30%;
}

#left-top {
   height: 28%;
   position: relative;
}
#left-middle {
  height: 28%;
  margin-top: 15px;
  position: relative;
}

#left-bottom {
   height: 28%;
   margin-top: 15px;
   position: relative;
}

.screen-middle {
   height: 100%;
   width: 40%;
   margin-left: 1%;
   margin-right: 1%;
}

#middle-top {
   width: 100%;
   height: 50%;
   position: relative;
}
#middle-bottom {
   margin-top: 15px;
   width: 100%;
   height: 36%;
   position: relative;
}

.screen-right {
   height: 100%;
   width: 30%;
}

#right-top {
   height: 40%;
   position: relative;
}
#right-bottom {
   height: 46%;
   margin-top: 15px;
   position: relative;
}

.resize {
   position: absolute;
   right: 20px;
   top: 20px;
   cursor: pointer;
}

.copyRightText {
  width: 100%;
  position: relative;
  margin-top: 20px;
  font-size: 8px;
  text-align: center;
}
</style>
