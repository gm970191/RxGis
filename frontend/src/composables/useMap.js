import { ref, onMounted, onUnmounted } from 'vue'
import { initMap } from '@/utils/mapUtils'

/**
 * 地图管理组合式函数
 */
export function useMap(containerId = 'map', options = {}) {
  const map = ref(null)
  const isMapReady = ref(false)
  const mapError = ref(null)

  /**
   * 初始化地图
   */
  const initializeMap = async () => {
    try {
      map.value = await initMap(containerId, options)
      isMapReady.value = true
      mapError.value = null
      console.log('地图初始化完成')
    } catch (error) {
      console.error('地图初始化失败:', error)
      mapError.value = error.message
      isMapReady.value = false
    }
  }

  /**
   * 地图控制方法
   */
  const zoomIn = () => {
    if (map.value) {
      map.value.setZoom(map.value.getZoom() + 1)
    }
  }

  const zoomOut = () => {
    if (map.value) {
      map.value.setZoom(map.value.getZoom() - 1)
    }
  }

  const setZoom = (zoom) => {
    if (map.value) {
      map.value.setZoom(zoom)
    }
  }

  const getZoom = () => {
    if (map.value) {
      return map.value.getZoom()
    }
    return null
  }

  const setCenter = (lng, lat) => {
    if (map.value) {
      map.value.setCenter([lng, lat])
    }
  }

  const getCenter = () => {
    if (map.value) {
      return map.value.getCenter()
    }
    return null
  }

  const fitBounds = (bounds) => {
    if (map.value && bounds) {
      try {
        map.value.setBounds(bounds)
      } catch (error) {
        console.warn('设置地图边界失败:', error)
      }
    }
  }

  /**
   * 地图事件监听
   */
  const addMapListener = (event, handler) => {
    if (map.value) {
      map.value.on(event, handler)
    }
  }

  const removeMapListener = (event, handler) => {
    if (map.value) {
      map.value.off(event, handler)
    }
  }

  /**
   * 地图状态检查
   */
  const isMapLoaded = () => {
    return map.value !== null && isMapReady.value
  }

  /**
   * 销毁地图
   */
  const destroyMap = () => {
    if (map.value) {
      map.value.destroy()
      map.value = null
      isMapReady.value = false
    }
  }

  return {
    // 响应式数据
    map,
    isMapReady,
    mapError,
    
    // 方法
    initializeMap,
    zoomIn,
    zoomOut,
    setZoom,
    getZoom,
    setCenter,
    getCenter,
    fitBounds,
    addMapListener,
    removeMapListener,
    isMapLoaded,
    destroyMap
  }
} 