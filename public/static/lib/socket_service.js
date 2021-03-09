export default class SocketService {
  // 单例socket对象
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 服务点链接对象
  ws = null

  // 连接状态
  connected = false
  sendRetryCount = 0 // 重新发送次数

  connectRetryCount = 0 // 重连服务器次数

  // 存储回调函数
  callBackMapping = {}
  // 定义链接服务器方法
  connect () {
    // 链接服务器
    if (!window.WebSocket) {
      return console.log('浏览器不支持WebCoket')
    }
    this.ws = new WebSocket('ws://192.168.2.9:9999')

    // 监听链接成功事件
    this.ws.onopen = () => {
      console.log('==========[ Connect Success ]==========')
      this.connected = true
      // 重置重连计数器
      this.connectRetryCount = 0
    }
    // 监听链接失败事件
    this.ws.onclose = () => {
      console.log('==========[ Connect Failure ]==========')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    // 监听服务端消息事件
    this.ws.onmessage = (msg) => {
      console.log('==========[ received Message from Backend Server ]==========')
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          console.log('=========callBackMapping============' + this.callBackMapping[socketType])
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 回调函数注册
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消指定回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据
  send (data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 1000 * this.sendRetryCount)
    }
  }
}
