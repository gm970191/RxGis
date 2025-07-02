/**
 * 地图工具函数
 */

/**
 * 加载高德地图API
 * @returns {Promise} - 返回AMap对象
 */
export const loadAMap = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    }
    
    // 设置安全密钥（可选）
    // window._AMapSecurityConfig = {
    //   securityJsCode: '您的安全密钥',
    // }
    
    const script = document.createElement('script')
    const apiKey = '7b76094fca96419d18d412ca835c9e88'
    // 使用1.4版本，兼容性更好
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${apiKey}`
    script.onload = () => resolve(window.AMap)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * 初始化地图
 * @param {string} containerId - 地图容器ID
 * @param {Object} options - 地图配置选项
 * @returns {Promise<Object>} - 返回地图实例
 */
export const initMap = async (containerId = 'map', options = {}) => {
  try {
    const AMap = await loadAMap()
    const defaultOptions = {
      zoom: 11,
      center: [116.397428, 39.90923], // 北京天安门
      mapStyle: 'amap://styles/normal'
    }
    
    const map = new AMap.Map(containerId, {
      ...defaultOptions,
      ...options
    })
    
    console.log('地图初始化成功')
    return map
  } catch (error) {
    console.error('地图初始化失败:', error)
    throw error
  }
}

import { getIconPath } from './iconUtils.js'

/**
 * 获取车辆图标URL
 * @param {string} vehicleType - 车辆类型
 * @param {number} status - 车辆状态 (0:离线, 1:在线, 2:停车)
 * @returns {string} - 图标URL
 */
export const getVehicleIcon = (vehicleType, status = 1) => {
  return getIconPath(vehicleType, status)
}

/**
 * 根据状态设置车牌颜色
 * @param {number} status - 车辆状态
 * @returns {string} - 颜色值
 */
export const getPlateColor = (status) => {
  switch (status) {
    case 0: return '#ff4d4f' // 离线 - 红色
    case 1: return '#52c41a' // 行驶 - 绿色
    case 2: return '#faad14' // 停车 - 黄色
    default: return '#1890ff' // 默认 - 蓝色
  }
}

/**
 * 获取状态类型（用于Element Plus标签）
 * @param {number} status - 车辆状态
 * @returns {string} - 状态类型
 */
export const getStatusType = (status) => {
  switch (status) {
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 0:
      return 'danger'
    default:
      return 'info'
  }
}

/**
 * 获取状态文本
 * @param {number} status - 车辆状态
 * @returns {string} - 状态文本
 */
export const getStatusText = (status) => {
  switch (status) {
    case 1:
      return '在线'
    case 2:
      return '停车'
    case 0:
      return '离线'
    default:
      return '未知状态'
  }
}

/**
 * 格式化时间
 * @param {string} timeString - 时间字符串
 * @returns {string} - 格式化后的时间
 */
export const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString('zh-CN')
}

/**
 * 获取位置地址（模拟地理编码）
 * @param {Object} position - 位置对象
 * @returns {string} - 地址字符串
 */
export const getLocationAddress = (position) => {
  // 这里可以集成真实的地理编码服务
  const lat = position.lat.toFixed(4)
  const lng = position.lng.toFixed(4)
  return `北京市 (${lat}, ${lng})`
}

/**
 * 获取告警信息
 * @param {string} vehicleId - 车辆ID
 * @returns {string|null} - 告警信息
 */
export const getAlarmInfo = (vehicleId) => {
  // 模拟告警信息
  const alarms = {
    '001': '超速告警',
    '003': '疲劳驾驶',
    '005': '偏离路线'
  }
  return alarms[vehicleId] || null
} 