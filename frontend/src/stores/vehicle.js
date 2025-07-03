import { defineStore } from 'pinia'
import { allMockVehicles, getVehicleStats, getRealTimeAlarms } from '@/utils/mockData'

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: allMockVehicles, // 使用100辆车的模拟数据
    selectedVehicles: [],
    vehiclePositions: {},
    isLoading: false,
    centerMapToVehicle: null,
    vehicleStats: getVehicleStats(), // 添加车辆统计信息
    // 告警相关状态
    alarms: [],
    alarmSettings: {
      showAlarmPopup: true,
      enableAlarmSound: true
    }
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
    getCenterMapToVehicle: (state) => state.centerMapToVehicle,
    
    // 获取车辆统计信息
    getVehicleStats: (state) => state.vehicleStats,
    
    // 获取未读告警
    getUnreadAlarms: (state) => state.alarms.filter(alarm => !alarm.isRead),
    
    // 获取告警设置
    getAlarmSettings: (state) => state.alarmSettings
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
    },
    
    // 告警相关方法
    
    // 获取实时告警数据
    async fetchRealTimeAlarms() {
      try {
        const newAlarms = await getRealTimeAlarms()
        if (newAlarms.length > 0) {
          // 添加新告警到列表
          this.alarms.unshift(...newAlarms)
          
          // 限制告警数量，保留最新的50条
          if (this.alarms.length > 50) {
            this.alarms = this.alarms.slice(0, 50)
          }
          
          return newAlarms
        }
        return []
      } catch (error) {
        console.error('获取告警数据失败:', error)
        return []
      }
    },
    
    // 标记告警为已读
    markAlarmAsRead(alarmId) {
      const alarm = this.alarms.find(a => a.id === alarmId)
      if (alarm) {
        alarm.isRead = true
      }
    },
    
    // 标记所有告警为已读
    markAllAlarmsAsRead() {
      this.alarms.forEach(alarm => {
        alarm.isRead = true
      })
    },
    
    // 删除告警
    removeAlarm(alarmId) {
      const index = this.alarms.findIndex(a => a.id === alarmId)
      if (index > -1) {
        this.alarms.splice(index, 1)
      }
    },
    
    // 清空所有告警
    clearAllAlarms() {
      this.alarms = []
    },
    
    // 切换告警弹窗显示
    toggleAlarmPopup() {
      this.alarmSettings.showAlarmPopup = !this.alarmSettings.showAlarmPopup
    },
    
    // 切换告警提示音
    toggleAlarmSound() {
      this.alarmSettings.enableAlarmSound = !this.alarmSettings.enableAlarmSound
    }
  }
}) 