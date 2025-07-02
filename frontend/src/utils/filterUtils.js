/**
 * 车辆过滤工具函数
 */

/**
 * 过滤车辆列表
 * @param {Array} vehicles - 车辆列表
 * @param {Object} filters - 过滤条件
 * @returns {Array} - 过滤后的车辆列表
 */
export const filterVehicles = (vehicles, filters) => {
  if (!vehicles || !Array.isArray(vehicles)) {
    return []
  }

  return vehicles.filter(vehicle => {
    // 车牌号过滤
    if (filters.vehicleNo && filters.vehicleNo.trim()) {
      const vehicleNo = vehicle.vehicleNo || ''
      if (!vehicleNo.toLowerCase().includes(filters.vehicleNo.toLowerCase().trim())) {
        return false
      }
    }

    // 终端号码过滤
    if (filters.terminalId && filters.terminalId.trim()) {
      const terminalId = vehicle.terminalId || ''
      if (!terminalId.toLowerCase().includes(filters.terminalId.toLowerCase().trim())) {
        return false
      }
    }

    // 车辆状态过滤
    if (filters.status !== undefined && filters.status !== null && filters.status !== '') {
      if (vehicle.status !== filters.status) {
        return false
      }
    }

    // 车辆类型过滤
    if (filters.vehicleType && filters.vehicleType !== '') {
      if (vehicle.vehicleType !== filters.vehicleType) {
        return false
      }
    }

    // 车组过滤
    if (filters.groupId && filters.groupId !== '') {
      if (vehicle.groupId !== filters.groupId) {
        return false
      }
    }

    // 公司过滤
    if (filters.company && filters.company !== '') {
      if (vehicle.company !== filters.company) {
        return false
      }
    }

    return true
  })
}

/**
 * 获取车辆类型选项
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 车辆类型选项
 */
export const getVehicleTypeOptions = (vehicles) => {
  if (!vehicles || !Array.isArray(vehicles)) {
    return []
  }

  const types = [...new Set(vehicles.map(v => v.vehicleType).filter(Boolean))]
  return types.map(type => ({
    label: type,
    value: type
  }))
}

/**
 * 获取车组选项
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 车组选项
 */
export const getGroupOptions = (vehicles) => {
  if (!vehicles || !Array.isArray(vehicles)) {
    return []
  }

  const groups = vehicles.reduce((acc, vehicle) => {
    if (vehicle.groupId && vehicle.groupName) {
      const existing = acc.find(g => g.value === vehicle.groupId)
      if (!existing) {
        acc.push({
          label: vehicle.groupName,
          value: vehicle.groupId,
          company: vehicle.company
        })
      }
    }
    return acc
  }, [])

  return groups.sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * 获取公司选项
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 公司选项
 */
export const getCompanyOptions = (vehicles) => {
  if (!vehicles || !Array.isArray(vehicles)) {
    return []
  }

  const companies = [...new Set(vehicles.map(v => v.company).filter(Boolean))]
  return companies.map(company => ({
    label: company,
    value: company
  })).sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * 获取状态选项
 * @returns {Array} - 状态选项
 */
export const getStatusOptions = () => {
  return [
    { label: '全部状态', value: '' },
    { label: '在线', value: 1 },
    { label: '停车', value: 2 },
    { label: '离线', value: 0 }
  ]
}

/**
 * 获取车辆类型选项（包含全部）
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 车辆类型选项
 */
export const getVehicleTypeOptionsWithAll = (vehicles) => {
  const options = getVehicleTypeOptions(vehicles)
  return [
    { label: '全部类型', value: '' },
    ...options
  ]
}

/**
 * 获取车组选项（包含全部）
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 车组选项
 */
export const getGroupOptionsWithAll = (vehicles) => {
  const options = getGroupOptions(vehicles)
  return [
    { label: '全部车组', value: '' },
    ...options
  ]
}

/**
 * 获取公司选项（包含全部）
 * @param {Array} vehicles - 车辆列表
 * @returns {Array} - 公司选项
 */
export const getCompanyOptionsWithAll = (vehicles) => {
  const options = getCompanyOptions(vehicles)
  return [
    { label: '全部公司', value: '' },
    ...options
  ]
}

/**
 * 重置过滤条件
 * @returns {Object} - 重置后的过滤条件
 */
export const getDefaultFilters = () => {
  return {
    vehicleNo: '',
    terminalId: '',
    status: '',
    vehicleType: '',
    groupId: '',
    company: ''
  }
}

/**
 * 检查是否有活跃的过滤条件
 * @param {Object} filters - 过滤条件
 * @returns {boolean} - 是否有活跃的过滤条件
 */
export const hasActiveFilters = (filters) => {
  return Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  )
}

/**
 * 获取过滤统计信息
 * @param {Array} allVehicles - 所有车辆
 * @param {Array} filteredVehicles - 过滤后的车辆
 * @returns {Object} - 统计信息
 */
export const getFilterStats = (allVehicles, filteredVehicles) => {
  return {
    total: allVehicles.length,
    filtered: filteredVehicles.length,
    percentage: allVehicles.length > 0 ? Math.round((filteredVehicles.length / allVehicles.length) * 100) : 0
  }
} 