import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [],
    selectedVehicles: [],
    vehiclePositions: {},
    isLoading: false,
    centerMapToVehicle: null
  }),

  getters: {
    // 获取所有车辆
    getAllVehicles: (state) => state.vehicles,
    
    // 获取选中的车辆
    getSelectedVehicles: (state) => state.selectedVehicles,
    
    // 获取车辆位置信息
    getVehiclePositions: (state) => state.vehiclePositions,
    
    // 获取指定车辆的位置
    getVehiclePosition: (state) => (vehicleId) => {
      return state.vehiclePositions[vehicleId] || null
    },
    
    // 获取需要定位到地图中心的车辆
    getCenterMapToVehicle: (state) => state.centerMapToVehicle
  },

  actions: {
    // 设置车辆列表
    setVehicles(vehicles) {
      this.vehicles = vehicles
    },

    // 添加车辆
    addVehicle(vehicle) {
      this.vehicles.push(vehicle)
    },

    // 更新车辆位置
    updateVehiclePosition(vehicleId, position) {
      // 验证坐标有效性
      if (!position || typeof position.lng !== 'number' || typeof position.lat !== 'number') {
        console.warn(`车辆 ${vehicleId} 位置数据无效:`, position)
        return
      }
      
      // 检查是否为NaN
      if (isNaN(position.lng) || isNaN(position.lat)) {
        console.warn(`车辆 ${vehicleId} 坐标包含NaN:`, position)
        return
      }
      
      // 检查经纬度范围
      if (position.lng < -180 || position.lng > 180 || position.lat < -90 || position.lat > 90) {
        console.warn(`车辆 ${vehicleId} 坐标超出有效范围:`, position)
        return
      }
      
      this.vehiclePositions[vehicleId] = {
        ...this.vehiclePositions[vehicleId],
        ...position,
        timestamp: new Date().toISOString()
      }
    },

    // 选择车辆
    selectVehicle(vehicleId) {
      if (!this.selectedVehicles.includes(vehicleId)) {
        this.selectedVehicles.push(vehicleId)
      }
    },

    // 取消选择车辆
    deselectVehicle(vehicleId) {
      const index = this.selectedVehicles.indexOf(vehicleId)
      if (index > -1) {
        this.selectedVehicles.splice(index, 1)
      }
    },

    // 切换车辆选择状态
    toggleVehicleSelection(vehicleId) {
      if (this.selectedVehicles.includes(vehicleId)) {
        this.deselectVehicle(vehicleId)
      } else {
        this.selectVehicle(vehicleId)
      }
    },

    // 清空选择
    clearSelection() {
      this.selectedVehicles = []
    },

    // 设置加载状态
    setLoading(loading) {
      this.isLoading = loading
    },
    
    // 设置需要定位到地图中心的车辆
    setCenterMapToVehicle(vehicleId) {
      console.log('setCenterMapToVehicle called with:', vehicleId)
      this.centerMapToVehicle = vehicleId
      console.log('centerMapToVehicle set to:', this.centerMapToVehicle)
    },
    
    // 清除地图中心定位请求
    clearCenterMapToVehicle() {
      console.log('clearCenterMapToVehicle called')
      this.centerMapToVehicle = null
      console.log('centerMapToVehicle cleared')
    }
  }
}) 