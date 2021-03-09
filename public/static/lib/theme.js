const theme = {
  andre: {
    // 主背景色
    backgroundColor: '#161522',
    // 主背景标题颜色
    titleColor: '#FFFFFF',
    // logo样式
    logoSrc: 'logo_light.png',
    // 主题切换图标样式
    themeSrc: 'qiehuan_dark.png',
    // 主背景顶部框线样式
    headerBorderSrc: 'header_border_blue_short.png'

  },
  vintage: {
    backgroundColor: '#FFD180',
    titleColor: '#000000',
    logoSrc: 'logo_dark.png',
    themeSrc: 'qiehuan_light.png',
    headerBorderSrc: 'header_border_white_short.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}
