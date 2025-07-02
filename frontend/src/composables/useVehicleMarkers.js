import { ref } from 'vue'
import { isValidCoordinates } from '@/utils/coordinateUtils'
import { getVehicleIcon, getPlateColor } from '@/utils/mapUtils'

/**
 * 车辆标记管理组合式函数
 */
export function useVehicleMarkers(map) {
  const markers = ref({})

  /**
   * 创建车辆标记
   * @param {Object} vehicle - 车辆对象
   * @param {Object} position - 位置对象
   * @returns {Object|null} - 标记对象或null
   */
  const createVehicleMarker = (vehicle, position) => {
    if (!map.value || !window.AMap) return null
    
    // 验证坐标有效性
    if (!isValidCoordinates(position)) {
      console.warn(`车辆 ${vehicle.id} 坐标无效，跳过创建标记:`, position)
      return null
    }
    
    // 确保坐标是有效的数字
    const lng = Number(position.lng)
    const lat = Number(position.lat)
    if (isNaN(lng) || isNaN(lat)) {
      console.warn(`车辆 ${vehicle.id} 坐标包含NaN，跳过创建标记:`, { lng, lat })
      return null
    }
    
    // 根据状态设置车牌颜色
    const plateColor = getPlateColor(vehicle.status)
    
    // 创建自定义标记内容
    const markerContent = document.createElement('div')
    markerContent.className = 'vehicle-marker'
    markerContent.innerHTML = `
      <div class="vehicle-icon">
        <img src="${getVehicleIcon(vehicle.vehicleType, vehicle.status)}" alt="车辆图标" />
      </div>
      <div class="vehicle-plate" style="background-color: ${plateColor}">${vehicle.vehicleNo}</div>
    `
    
    try {
      const marker = new window.AMap.Marker({
        position: [lng, lat],
        title: vehicle.vehicleNo,
        content: markerContent,
        offset: new window.AMap.Pixel(-20, -40) // 调整偏移量以适应车牌显示
      })
      
      return marker
    } catch (error) {
      console.error(`创建车辆 ${vehicle.id} 标记失败:`, error)
      return null
    }
  }

  /**
   * 更新地图标记
   * @param {Array} selectedVehicles - 选中的车辆ID数组
   * @param {Array} vehicles - 所有车辆数组
   * @param {Object} vehiclePositions - 车辆位置数据
   * @param {Function} onMarkerClick - 标记点击回调
   */
  const updateMapMarkers = (selectedVehicles, vehicles, vehiclePositions, onMarkerClick) => {
    if (!map.value) return
    
    // 获取当前选中的车辆
    const currentSelected = selectedVehicles
    
    // 先添加或更新选中车辆的标记，确保地图上始终有标记
    currentSelected.forEach(vehicleId => {
      const vehicle = vehicles.find(v => v.id === vehicleId)
      const position = vehiclePositions[vehicleId]
      
      if (vehicle && position) {
        // 如果标记已存在，更新位置和内容
        if (markers.value[vehicleId]) {
          const existingMarker = markers.value[vehicleId]
          
          // 更新位置（添加坐标验证）
          if (isValidCoordinates(position)) {
            existingMarker.setPosition([position.lng, position.lat])
          }
          
          // 检查车辆状态是否改变，如果改变则重新创建标记以更新车牌颜色和图标
          const markerContent = existingMarker.getContent()
          if (markerContent) {
            const plateElement = markerContent.querySelector('.vehicle-plate')
            const iconElement = markerContent.querySelector('.vehicle-icon img')
            
            if (plateElement && iconElement) {
              const currentColor = plateElement.style.backgroundColor
              const expectedColor = getPlateColor(vehicle.status)
              const currentIcon = iconElement.src
              const expectedIcon = getVehicleIcon(vehicle.vehicleType, vehicle.status)
              
              if (currentColor !== expectedColor || currentIcon !== expectedIcon) {
                // 状态或图标改变，重新创建标记
                map.value.remove(existingMarker)
                const newMarker = createVehicleMarker(vehicle, position)
                if (newMarker) {
                  // 添加点击事件
                  newMarker.on('click', () => onMarkerClick(vehicle, position))
                  markers.value[vehicleId] = newMarker
                  map.value.add(newMarker)
                }
              }
            }
          }
        } else {
          // 创建新标记（添加坐标验证）
          if (isValidCoordinates(position)) {
            const marker = createVehicleMarker(vehicle, position)
            if (marker) {
              // 添加点击事件
              marker.on('click', () => onMarkerClick(vehicle, position))
              markers.value[vehicleId] = marker
              map.value.add(marker)
            }
          }
        }
      }
    })
    
    // 最后移除不再选中的车辆标记
    Object.keys(markers.value).forEach(vehicleId => {
      if (!currentSelected.includes(vehicleId)) {
        const marker = markers.value[vehicleId]
        if (marker) {
          map.value.remove(marker)
          delete markers.value[vehicleId]
        }
      }
    })
  }

  /**
   * 更新标记位置
   * @param {Object} vehiclePositions - 车辆位置数据
   */
  const updateMarkerPositions = (vehiclePositions) => {
    // 只更新现有标记的位置，不重新创建标记
    Object.keys(markers.value).forEach(vehicleId => {
      const marker = markers.value[vehicleId]
      const position = vehiclePositions[vehicleId]
      
      if (marker && position && isValidCoordinates(position)) {
        // 确保坐标是有效的数字
        const lng = Number(position.lng)
        const lat = Number(position.lat)
        if (!isNaN(lng) && !isNaN(lat)) {
          marker.setPosition([lng, lat])
        }
      }
    })
  }

  /**
   * 清除所有标记
   */
  const clearMarkers = () => {
    Object.values(markers.value).forEach(marker => {
      if (map.value) {
        map.value.remove(marker)
      }
    })
    markers.value = {}
  }

  /**
   * 获取标记数量
   * @returns {number} - 标记数量
   */
  const getMarkerCount = () => {
    return Object.keys(markers.value).length
  }

  return {
    markers,
    createVehicleMarker,
    updateMapMarkers,
    updateMarkerPositions,
    clearMarkers,
    getMarkerCount
  }
} 