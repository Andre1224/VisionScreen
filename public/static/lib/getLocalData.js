export function getLocalComponentData (fileName) {
  const DataPath = '../data/' + fileName + '.json'
  const data = require(DataPath)
  return JSON.parse(data)
}

export function getLocalMapData (code) {
  const DataPath = '../map/chinaMapData/' + code + '.json'
  const data = require(DataPath)
  return JSON.parse(data)
}
