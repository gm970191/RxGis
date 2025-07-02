import { isValidCoordinates } from '@/utils/coordinateUtils'

/**
 * 地图视野调整组合式函数
 */
export function useMapBounds(map) {
  /**
   * 备用视野调整方法
   * @param {number} minLng - 最小经度
   * @param {number} maxLng - 最大经度
   * @param {number} minLat - 最小纬度
   * @param {number} maxLat - 最大纬度
   */
  const useBackupMethod = (minLng, maxLng, minLat, maxLat) => {
    // 备用方法：计算中心点和合适的缩放级别
    const centerLng = (minLng + maxLng) / 2
    const centerLat = (minLat + maxLat) / 2
    
    // 计算合适的缩放级别
    const lngDiff = maxLng - minLng
    const latDiff = maxLat - minLat
    const maxDiff = Math.max(lngDiff, latDiff)
    
    // 根据经纬度差值计算缩放级别
    let zoom = 15 // 默认缩放级别
    if (maxDiff > 0.1) zoom = 10
    else if (maxDiff > 0.05) zoom = 11
    else if (maxDiff > 0.02) zoom = 12
    else if (maxDiff > 0.01) zoom = 13
    else if (maxDiff > 0.005) zoom = 14
    else if (maxDiff > 0.002) zoom = 15
    else zoom = 16
    
    console.log('使用备用方法调整视野:', {
      center: [centerLng, centerLat],
      zoom: zoom,
      maxDiff: maxDiff
    })
    
    try {
      // 设置地图中心和缩放级别
      map.value.setCenter([centerLng, centerLat])
      map.value.setZoom(zoom)
      console.log('备用视野调整成功')
    } catch (error) {
      console.error('备用视野调整失败:', error)
    }
  }

  /**
   * 调整地图视野以显示所有选中的车辆
   * @param {Array} selectedVehicles - 选中的车辆ID数组
   * @param {Object} vehiclePositions - 车辆位置数据
   */
  const adjustMapBounds = (selectedVehicles, vehiclePositions) => {
    if (!map.value || selectedVehicles.length === 0) return
    
    console.log('开始调整地图视野，选中的车辆:', selectedVehicles)
    
    const positions = []
    selectedVehicles.forEach(vehicleId => {
      const position = vehiclePositions[vehicleId]
      console.log(`车辆 ${vehicleId} 的位置数据:`, position)
      
      if (position && isValidCoordinates(position)) {
        // 确保坐标是有效的数字
        const lng = Number(position.lng)
        const lat = Number(position.lat)
        if (!isNaN(lng) && !isNaN(lat)) {
          positions.push([lng, lat])
          console.log(`车辆 ${vehicleId} 坐标有效: [${lng}, ${lat}]`)
        } else {
          console.warn(`车辆 ${vehicleId} 坐标转换后为NaN: [${lng}, ${lat}]`)
        }
      } else {
        console.warn(`车辆 ${vehicleId} 位置数据无效或不存在:`, position)
      }
    })
    
    console.log('收集到的有效位置:', positions)
    
    if (positions.length > 0) {
      try {
        // 使用高德地图的正确方式创建边界
        // 首先找到最小和最大的经纬度
        const lngs = positions.map(pos => pos[0])
        const lats = positions.map(pos => pos[1])
        
        const minLng = Math.min(...lngs)
        const maxLng = Math.max(...lngs)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        
        console.log('计算边界范围:', {
          minLng, maxLng, minLat, maxLat,
          positions: positions
        })
        
        // 创建边界对象，使用西南角和东北角坐标
        const bounds = new window.AMap.Bounds(
          [minLng, minLat], // 西南角
          [maxLng, maxLat]  // 东北角
        )
        
        // 检查bounds是否有效
        const southWest = bounds.getSouthWest()
        const northEast = bounds.getNorthEast()
        console.log('边界西南角:', southWest)
        console.log('边界东北角:', northEast)
        
        if (southWest && northEast && 
            !isNaN(southWest.lng) && !isNaN(southWest.lat) &&
            !isNaN(northEast.lng) && !isNaN(northEast.lat)) {
          try {
            // 设置地图视野，包含所有选中的车辆
            map.value.setBounds(bounds)
            console.log('地图视野调整成功')
          } catch (boundsError) {
            console.warn('setBounds失败，使用备用方法:', boundsError)
            // 如果setBounds失败，使用备用方法
            useBackupMethod(minLng, maxLng, minLat, maxLat)
          }
        } else {
          console.warn('无效的地图边界，使用备用方法调整视野')
          useBackupMethod(minLng, maxLng, minLat, maxLat)
        }
      } catch (error) {
        console.error('调整地图视野失败:', error)
        console.error('错误详情:', {
          selectedVehicles: selectedVehicles,
          positions: positions,
          vehiclePositions: vehiclePositions
        })
      }
    } else {
      console.warn('没有有效的车辆位置数据，跳过视野调整')
      console.warn('调试信息:', {
        selectedVehicles: selectedVehicles,
        vehiclePositions: vehiclePositions
      })
    }
  }

  /**
   * 聚焦到指定车辆
   * @param {string} vehicleId - 车辆ID
   * @param {Object} vehiclePositions - 车辆位置数据
   * @param {Array} selectedVehicles - 选中的车辆数组
   */
  const focusOnVehicle = (vehicleId, vehiclePositions, selectedVehicles) => {
    if (!map.value) return
    
    const position = vehiclePositions[vehicleId]
    if (position && isValidCoordinates(position)) {
      // 如果只有一个选中的车辆，聚焦到该车辆
      if (selectedVehicles.length === 1) {
        const { safeSetCenter } = require('@/utils/coordinateUtils')
        if (safeSetCenter(map.value, position.lng, position.lat)) {
          // 保持当前缩放级别，不强制改变
          const currentZoom = map.value.getZoom()
          console.log(`聚焦到车辆 ${vehicleId}，保持当前缩放级别: ${currentZoom}`)
        }
      } else {
        // 如果有多个选中的车辆，调整视野显示所有车辆
        adjustMapBounds(selectedVehicles, vehiclePositions)
      }
    }
  }

  return {
    adjustMapBounds,
    focusOnVehicle,
    useBackupMethod
  }
} 