<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    
    <!-- 地图控制面板 -->
    <MapControls 
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @fit-bounds="fitBounds"
      @clear-markers="clearMarkers"
    />
    
    <!-- 车辆信息面板 -->
    <VehicleInfoPanel 
      :vehicle="selectedVehicle"
      :position="selectedVehiclePosition"
      @close="closeInfoPanel"
    />
    
    <!-- 车辆实时信息栏 -->
    <VehicleInfoBar 
      :show="showVehicleInfoBar"
      :vehicles-info="selectedVehiclesInfo"
      @close="closeVehicleInfoBar"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch, inject } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import { mockApiCall } from '@/utils/mockData'
import { safeSetCenter, isValidCoordinates } from '@/utils/coordinateUtils'
import { getLocationAddress, getAlarmInfo, formatTime } from '@/utils/mapUtils'
import { useMap } from '@/composables/useMap'
import { useVehicleMarkers } from '@/composables/useVehicleMarkers'
import { useMapBounds } from '@/composables/useMapBounds'
import MapControls from './map/MapControls.vue'
import VehicleInfoPanel from './map/VehicleInfoPanel.vue'
import VehicleInfoBar from './map/VehicleInfoBar.vue'

export default {
  name: 'MapContainer',
  components: {
    MapControls,
    VehicleInfoPanel,
    VehicleInfoBar
  },
  setup() {
    const vehicleStore = useVehicleStore()
    const updateTimer = ref(null)
    const selectedVehicle = ref(null)
    const selectedVehiclePosition = ref(null)
    const lastSelectedVehicle = ref(null)
    const lastSelectedVehiclePosition = ref(null)
    
    // 注入父组件提供的状态
    const showVehicleInfoBar = inject('showVehicleInfoBar', ref(false))
    const toggleVehicleInfoBar = inject('toggleVehicleInfoBar', () => {})
    
    const selectedVehicles = computed(() => vehicleStore.getSelectedVehicles)
    const vehiclePositions = computed(() => vehicleStore.getVehiclePositions)
    const vehicles = computed(() => vehicleStore.getAllVehicles)
    
    // 使用组合式函数
    const { map, initializeMap, zoomIn, zoomOut, fitBounds } = useMap()
    const { markers, updateMapMarkers, updateMarkerPositions, clearMarkers } = useVehicleMarkers(map)
    const { adjustMapBounds, focusOnVehicle } = useMapBounds(map)
    
    // 计算选中车辆的实时信息表格数据
    const selectedVehiclesInfo = computed(() => {
      if (!showVehicleInfoBar.value) return []
      
      return selectedVehicles.value.map(vehicleId => {
        const vehicle = vehicles.value.find(v => v.id === vehicleId)
        const position = vehiclePositions.value[vehicleId]
        
        if (!vehicle) return null
        
        return {
          id: vehicle.id,
          vehicleNo: vehicle.vehicleNo,
          speed: position ? position.speed : 0,
          direction: position ? position.direction : 0,
          status: vehicle.status,
          alarm: getAlarmInfo(vehicle.id),
          location: position ? getLocationAddress(position) : '未知位置',
          updateTime: position ? formatTime(position.locationTime) : '--'
        }
      }).filter(Boolean)
    })
    
    // 显示车辆信息
    const showVehicleInfo = (vehicle, position) => {
      selectedVehicle.value = vehicle
      selectedVehiclePosition.value = position
      // 同步更新状态栏显示的车辆信息
      lastSelectedVehicle.value = vehicle
      lastSelectedVehiclePosition.value = position
    }
    
    // 关闭信息面板
    const closeInfoPanel = () => {
      selectedVehicle.value = null
      selectedVehiclePosition.value = null
    }
    
    // 关闭车辆实时信息栏
    const closeVehicleInfoBar = () => {
      showVehicleInfoBar.value = false
    }
    
    // 更新车辆位置
    const updateVehiclePositions = async () => {
      try {
        const positions = await mockApiCall(500)
        
        // 更新store中的位置数据
        Object.keys(positions).forEach(vehicleId => {
          vehicleStore.updateVehiclePosition(vehicleId, positions[vehicleId])
        })
        
        // 更新标记位置
        updateMarkerPositions(vehiclePositions.value)
      } catch (error) {
        console.error('更新车辆位置失败:', error)
      }
    }
    
    // 监听选中车辆变化
    watch(selectedVehicles, (newSelected, oldSelected) => {
      // 更新地图标记
      updateMapMarkers(newSelected, vehicles.value, vehiclePositions.value, showVehicleInfo)
      
      // 更新状态栏显示的车辆信息 - 显示当前选中的车辆
      if (newSelected.length > 0) {
        // 获取当前选中的车辆（最后选中的）
        const currentVehicleId = newSelected[newSelected.length - 1]
        const vehicle = vehicles.value.find(v => v.id === currentVehicleId)
        const position = vehiclePositions.value[currentVehicleId]
        
        if (vehicle) {
          lastSelectedVehicle.value = vehicle
          lastSelectedVehiclePosition.value = position
        }
        
        if (newSelected.length === 1) {
          // 只有一个车辆时，聚焦到该车辆
          focusOnVehicle(newSelected[0], vehiclePositions.value, newSelected)
        } else {
          // 多个车辆时，调整视野显示所有车辆
          // 只有在有有效位置数据时才调整视野
          const hasValidPositions = newSelected.some(vehicleId => {
            const pos = vehiclePositions.value[vehicleId]
            return pos && isValidCoordinates(pos)
          })
          
          if (hasValidPositions) {
            adjustMapBounds(newSelected, vehiclePositions.value)
          } else {
            console.warn('选中的车辆都没有有效的位置数据，跳过视野调整')
          }
        }
      } else {
        // 没有选中车辆时，清空状态栏
        lastSelectedVehicle.value = null
        lastSelectedVehiclePosition.value = null
      }
    }, { deep: true })
    
    // 监听车辆中心定位请求
    watch(() => vehicleStore.getCenterMapToVehicle, (vehicleId, oldVehicleId) => {
      console.log('Watch triggered:', { vehicleId, oldVehicleId, map: !!map.value })
      
      if (vehicleId) {
        // 如果地图还未初始化，延迟重试
        if (!map.value) {
          console.log('地图未初始化，延迟重试定位请求')
          setTimeout(() => {
            // 重新设置定位请求，触发重试
            vehicleStore.setCenterMapToVehicle(vehicleId)
          }, 1000)
          return
        }
        
        const position = vehiclePositions.value[vehicleId]
        console.log('Position data:', position)
        
        if (position) {
          // 检查坐标有效性
          if (isValidCoordinates(position)) {
            // 获取当前缩放级别
            const currentZoom = map.value.getZoom()
            
            // 使用安全的方法设置地图中心，保持当前缩放级别
            if (safeSetCenter(map.value, position.lng, position.lat)) {
              // 保持当前缩放级别，不强制改变
              console.log(`地图已定位到车辆 ${vehicleId} 位置: [${position.lng}, ${position.lat}], 当前缩放级别: ${currentZoom}`)
              
              // 同时显示车辆信息面板
              const vehicle = vehicles.value.find(v => v.id === vehicleId)
              if (vehicle) {
                showVehicleInfo(vehicle, position)
              }
            }
          } else {
            console.warn(`车辆 ${vehicleId} 的坐标无效: [${position.lng}, ${position.lat}]`)
          }
        } else {
          console.warn(`车辆 ${vehicleId} 没有位置数据`)
        }
        
        // 清除定位请求
        vehicleStore.clearCenterMapToVehicle()
      }
    }, { immediate: true })
    
    // 监听位置数据变化，只更新标记位置，不调整视野
    watch(vehiclePositions, () => {
      // 更新标记位置
      updateMarkerPositions(vehiclePositions.value)
      
      // 更新状态栏中的位置信息
      if (lastSelectedVehicle.value) {
        const position = vehiclePositions.value[lastSelectedVehicle.value.id]
        if (position && isValidCoordinates(position)) {
          lastSelectedVehiclePosition.value = position
        }
      }
    }, { deep: true })
    
    // 监听车辆信息栏显示状态，控制数据更新
    watch(showVehicleInfoBar, (newValue) => {
      if (newValue) {
        // 显示信息栏时，立即更新一次数据
        updateVehiclePositions()
      }
      // 隐藏时不更新数据，节省资源
    })
    
    onMounted(async () => {
      // 初始化地图
      await initializeMap()
      
      // 启动定时更新（只在信息栏显示时更新）
      updateVehiclePositions()
      updateTimer.value = setInterval(() => {
        if (showVehicleInfoBar.value) {
          updateVehiclePositions()
        }
      }, 3000)
      
      // 确保初始选中第一辆车
      if (selectedVehicles.value.length === 0 && vehicles.value.length > 0) {
        vehicleStore.selectVehicle(vehicles.value[0].id)
      }
      
      // 监听车辆聚焦事件
      window.addEventListener('focus-vehicle', (event) => {
        const { vehicleId } = event.detail
        focusOnVehicle(vehicleId, vehiclePositions.value, selectedVehicles.value)
      })
      
      // 监听地图标记更新事件
      window.addEventListener('update-map-markers', () => {
        updateMapMarkers(selectedVehicles.value, vehicles.value, vehiclePositions.value, showVehicleInfo)
      })
    })
    
    onUnmounted(() => {
      if (updateTimer.value) {
        clearInterval(updateTimer.value)
      }
      
      // 移除事件监听
      window.removeEventListener('focus-vehicle', (event) => {
        const { vehicleId } = event.detail
        focusOnVehicle(vehicleId, vehiclePositions.value, selectedVehicles.value)
      })
      
      window.removeEventListener('update-map-markers', () => {
        updateMapMarkers(selectedVehicles.value, vehicles.value, vehiclePositions.value, showVehicleInfo)
      })
    })
    
    return {
      selectedVehicle,
      selectedVehiclePosition,
      lastSelectedVehicle,
      lastSelectedVehiclePosition,
      selectedVehicles,
      showVehicleInfoBar,
      selectedVehiclesInfo,
      zoomIn,
      zoomOut,
      fitBounds,
      clearMarkers,
      closeInfoPanel,
      closeVehicleInfoBar
    }
  }
}
</script>

<style scoped>
/* MapContainer 组件样式 */

/* 地图容器 */
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

/* 车辆标记样式 */
:deep(.vehicle-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.vehicle-marker:hover) {
  transform: scale(1.1);
  z-index: 1000;
}

:deep(.vehicle-icon) {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #fff;
}

:deep(.vehicle-icon img) {
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

:deep(.vehicle-plate) {
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}
</style> 