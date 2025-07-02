/**
 * 图标管理工具
 */

/**
 * 车辆类型配置
 */
export const VEHICLE_TYPES = {
  '货车': {
    name: 'truck',
    icon: '🚛',
    description: '货运车辆'
  },
  '客车': {
    name: 'bus',
    icon: '🚌',
    description: '客运车辆'
  },
  '轿车': {
    name: 'car',
    icon: '🚗',
    description: '小型轿车'
  },
  '面包车': {
    name: 'van',
    icon: '🚐',
    description: '面包车'
  },
  '厢式车': {
    name: 'box',
    icon: '📦',
    description: '厢式货车'
  }
}

/**
 * 车辆状态配置
 */
export const VEHICLE_STATUS = {
  0: {
    name: 'offline',
    text: '离线',
    color: '#ff4d4f',
    type: 'danger'
  },
  1: {
    name: 'online',
    text: '在线',
    color: '#52c41a',
    type: 'success'
  },
  2: {
    name: 'parking',
    text: '停车',
    color: '#faad14',
    type: 'warning'
  }
}

/**
 * 获取图标文件名
 * @param {string} vehicleType - 车辆类型
 * @param {number} status - 车辆状态
 * @returns {string} - 图标文件名
 */
export const getIconFileName = (vehicleType, status = 1) => {
  const typeConfig = VEHICLE_TYPES[vehicleType] || VEHICLE_TYPES['货车']
  const statusConfig = VEHICLE_STATUS[status] || VEHICLE_STATUS[1]
  
  return `${typeConfig.name}-${statusConfig.name}.png`
}

/**
 * 获取图标完整路径
 * @param {string} vehicleType - 车辆类型
 * @param {number} status - 车辆状态
 * @returns {string} - 图标完整路径
 */
export const getIconPath = (vehicleType, status = 1) => {
  const fileName = getIconFileName(vehicleType, status)
  return `/icons/vehicles/${fileName}`
}

/**
 * 检查图标是否存在
 * @param {string} iconPath - 图标路径
 * @returns {Promise<boolean>} - 图标是否存在
 */
export const checkIconExists = async (iconPath) => {
  try {
    const response = await fetch(iconPath, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn(`图标检查失败: ${iconPath}`, error)
    return false
  }
}

/**
 * 获取所有需要的图标文件列表
 * @returns {Array} - 图标文件列表
 */
export const getAllRequiredIcons = () => {
  const icons = []
  
  Object.keys(VEHICLE_TYPES).forEach(vehicleType => {
    Object.keys(VEHICLE_STATUS).forEach(status => {
      const fileName = getIconFileName(vehicleType, parseInt(status))
      const path = getIconPath(vehicleType, parseInt(status))
      
      icons.push({
        fileName,
        path,
        vehicleType,
        status: parseInt(status),
        statusText: VEHICLE_STATUS[parseInt(status)].text,
        vehicleIcon: VEHICLE_TYPES[vehicleType].icon
      })
    })
  })
  
  return icons
}

/**
 * 生成图标清单报告
 * @returns {string} - 图标清单报告
 */
export const generateIconReport = () => {
  const icons = getAllRequiredIcons()
  let report = '# 车辆图标清单\n\n'
  
  report += `总计需要 ${icons.length} 个图标文件\n\n`
  
  Object.keys(VEHICLE_TYPES).forEach(vehicleType => {
    const typeConfig = VEHICLE_TYPES[vehicleType]
    report += `## ${typeConfig.icon} ${vehicleType}\n\n`
    
    const typeIcons = icons.filter(icon => icon.vehicleType === vehicleType)
    typeIcons.forEach(icon => {
      const statusConfig = VEHICLE_STATUS[icon.status]
      report += `- \`${icon.fileName}\` - ${statusConfig.text} (${statusConfig.color})\n`
    })
    
    report += '\n'
  })
  
  return report
} 