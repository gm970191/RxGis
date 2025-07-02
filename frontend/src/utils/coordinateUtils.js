/**
 * 坐标验证工具函数
 */

/**
 * 检查坐标是否有效
 * @param {Object} position - 位置对象，包含 lng 和 lat 属性
 * @returns {boolean} - 坐标是否有效
 */
export const isValidCoordinates = (position) => {
  if (!position || typeof position.lng !== 'number' || typeof position.lat !== 'number') {
    return false
  }
  
  // 检查是否为NaN
  if (isNaN(position.lng) || isNaN(position.lat)) {
    return false
  }
  
  // 检查经纬度范围是否合理
  const isValidLng = position.lng >= -180 && position.lng <= 180
  const isValidLat = position.lat >= -90 && position.lat <= 90
  
  // 检查是否为0坐标（通常表示无效坐标）
  const isNotZero = position.lng !== 0 || position.lat !== 0
  
  // 检查是否为有限数字
  const isFiniteNumber = isFinite(position.lng) && isFinite(position.lat)
  
  return isValidLng && isValidLat && isNotZero && isFiniteNumber
}

/**
 * 安全设置地图中心
 * @param {Object} map - 地图实例
 * @param {number} lng - 经度
 * @param {number} lat - 纬度
 * @returns {boolean} - 设置是否成功
 */
export const safeSetCenter = (map, lng, lat) => {
  if (!map) return false
  
  // 确保坐标是数字类型
  const numLng = Number(lng)
  const numLat = Number(lat)
  
  // 验证坐标
  if (typeof numLng !== 'number' || typeof numLat !== 'number' || 
      isNaN(numLng) || isNaN(numLat) ||
      !isFinite(numLng) || !isFinite(numLat) ||
      numLng < -180 || numLng > 180 || numLat < -90 || numLat > 90) {
    console.warn('无效的坐标:', { lng: numLng, lat: numLat })
    return false
  }
  
  try {
    map.setCenter([numLng, numLat])
    return true
  } catch (error) {
    console.error('设置地图中心失败:', error)
    return false
  }
}

/**
 * 格式化坐标显示
 * @param {number} lng - 经度
 * @param {number} lat - 纬度
 * @param {number} precision - 精度，默认4位小数
 * @returns {string} - 格式化后的坐标字符串
 */
export const formatCoordinates = (lng, lat, precision = 4) => {
  return `(${lng.toFixed(precision)}, ${lat.toFixed(precision)})`
}

/**
 * 计算两点之间的距离（米）
 * @param {number} lng1 - 第一个点的经度
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lng2 - 第二个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @returns {number} - 距离（米）
 */
export const calculateDistance = (lng1, lat1, lng2, lat2) => {
  const R = 6371000 // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
} 