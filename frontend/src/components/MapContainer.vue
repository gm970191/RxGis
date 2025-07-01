<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    
    <!-- 地图控制面板 -->
    <div class="map-controls">
      <el-button-group>
        <el-button 
          size="small" 
          @click="zoomIn"
          title="放大"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button 
          size="small" 
          @click="zoomOut"
          title="缩小"
        >
          <el-icon><Minus /></el-icon>
        </el-button>
      </el-button-group>
      
      <el-button 
        size="small" 
        @click="fitBounds"
        title="适应所有车辆"
      >
        <el-icon><FullScreen /></el-icon>
      </el-button>
      
      <el-button 
        size="small" 
        @click="clearMarkers"
        title="清除标记"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
    
    <!-- 车辆信息面板 -->
    <div class="vehicle-info-panel" v-if="selectedVehicle">
      <div class="info-header">
        <h4>{{ selectedVehicle.vehicleNo }}</h4>
        <el-button 
          link
          size="small" 
          @click="closeInfoPanel"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="info-content">
        <div class="info-item">
          <span class="label">车辆类型:</span>
          <span class="value">{{ selectedVehicle.vehicleType }}</span>
        </div>
        <div class="info-item">
          <span class="label">车主:</span>
          <span class="value">{{ selectedVehicle.ownerName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话:</span>
          <span class="value">{{ selectedVehicle.contactPhone }}</span>
        </div>
        <div class="info-item" v-if="selectedVehiclePosition">
          <span class="label">速度:</span>
          <span class="value speed">{{ selectedVehiclePosition.speed }} km/h</span>
        </div>
        <div class="info-item" v-if="selectedVehiclePosition">
          <span class="label">方向:</span>
          <span class="value">{{ selectedVehiclePosition.direction }}°</span>
        </div>
        <div class="info-item" v-if="selectedVehiclePosition">
          <span class="label">海拔:</span>
          <span class="value">{{ selectedVehiclePosition.altitude }} m</span>
        </div>
        <div class="info-item" v-if="selectedVehiclePosition">
          <span class="label">更新时间:</span>
          <span class="value">{{ formatTime(selectedVehiclePosition.locationTime) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 车辆实时信息栏 -->
    <div class="vehicle-info-bar" v-if="showVehicleInfoBar && selectedVehicles.length > 0">
      <div class="info-bar-header">
        <h4>车辆实时信息</h4>
        <el-button 
          link
          size="small" 
          @click="closeVehicleInfoBar"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="info-bar-content">
        <el-table 
          :data="selectedVehiclesInfo" 
          size="small"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="vehicleNo" label="车牌号码" width="120" />
          <el-table-column prop="speed" label="速度" width="80">
            <template #default="scope">
              <span class="speed-value">{{ scope.row.speed }} km/h</span>
            </template>
          </el-table-column>
          <el-table-column prop="direction" label="方向" width="80">
            <template #default="scope">
              <span>{{ scope.row.direction }}°</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag 
                :type="getStatusType(scope.row.status)"
                size="small"
              >
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="alarm" label="告警" width="120">
            <template #default="scope">
              <el-tag 
                v-if="scope.row.alarm"
                type="danger" 
                size="small"
              >
                <el-icon><Warning /></el-icon>
                {{ scope.row.alarm }}
              </el-tag>
              <span v-else class="no-alarm">正常</span>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="位置解析" min-width="200">
            <template #default="scope">
              <span class="location-text">{{ scope.row.location }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="140">
            <template #default="scope">
              <span class="time-text">{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch, inject } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import { mockApiCall } from '@/utils/mockData'
import { Plus, Minus, FullScreen, Delete, Close, Warning } from '@element-plus/icons-vue'

export default {
  name: 'MapContainer',
  setup() {
    const vehicleStore = useVehicleStore()
    const map = ref(null)
    const markers = ref({})
    const selectedVehicle = ref(null)
    const selectedVehiclePosition = ref(null)
    const updateTimer = ref(null)
    const lastSelectedVehicle = ref(null)
    const lastSelectedVehiclePosition = ref(null)
    
    // 注入父组件提供的状态
    const showVehicleInfoBar = inject('showVehicleInfoBar', ref(false))
    const toggleVehicleInfoBar = inject('toggleVehicleInfoBar', () => {})
    
    const selectedVehicles = computed(() => vehicleStore.getSelectedVehicles)
    const vehiclePositions = computed(() => vehicleStore.getVehiclePositions)
    const vehicles = computed(() => vehicleStore.getAllVehicles)
    
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
    
    // 根据状态设置车牌颜色
    const getPlateColor = (status) => {
      switch (status) {
        case 0: return '#ff4d4f' // 离线 - 红色
        case 1: return '#52c41a' // 行驶 - 绿色
        case 2: return '#faad14' // 停车 - 黄色
        default: return '#1890ff' // 默认 - 蓝色
      }
    }
    
    // 初始化地图
    const initMap = async () => {
      try {
        const AMap = await loadAMap()
        map.value = new AMap.Map('map', {
          zoom: 11,
          center: [116.397428, 39.90923], // 北京天安门
          mapStyle: 'amap://styles/normal'
        })
        
        // 暂时不添加地图控件，避免兼容性问题
        // 地图基本功能不受影响
        
        console.log('地图初始化成功')
      } catch (error) {
        console.error('地图初始化失败:', error)
      }
    }
    
    // 加载高德地图API
    const loadAMap = () => {
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
    
    // 获取车辆图标
    const getVehicleIcon = (vehicleType, status = 1) => {
      // 使用PNG图标，确保兼容性
      const iconUrls = {
        online: 'https://img.icons8.com/ios-filled/50/52c41a/truck.png',
        parking: 'https://img.icons8.com/ios-filled/50/faad14/truck-delivery.png',
        offline: 'https://img.icons8.com/ios-filled/50/ff4d4f/truck.png'
      }
      
      // 根据状态选择图标
      let iconUrl
      if (status === 0) {
        iconUrl = iconUrls.offline
      } else if (status === 2) {
        iconUrl = iconUrls.parking
      } else {
        iconUrl = iconUrls.online
      }
      
      return iconUrl
    }
    
    // 创建车辆标记
    const createVehicleMarker = (vehicle, position) => {
      if (!map.value || !window.AMap) return null
      
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
      
      const marker = new window.AMap.Marker({
        position: [position.lng, position.lat],
        title: vehicle.vehicleNo,
        content: markerContent,
        offset: new window.AMap.Pixel(-20, -40) // 调整偏移量以适应车牌显示
      })
      
      // 添加点击事件
      marker.on('click', () => {
        showVehicleInfo(vehicle, position)
      })
      
      return marker
    }
    
    // 更新车辆位置
    const updateVehiclePositions = async () => {
      try {
        const positions = await mockApiCall(500)
        
        // 更新store中的位置数据
        Object.keys(positions).forEach(vehicleId => {
          vehicleStore.updateVehiclePosition(vehicleId, positions[vehicleId])
        })
        
        // 只更新现有标记的位置，不重新创建标记
        Object.keys(markers.value).forEach(vehicleId => {
          const marker = markers.value[vehicleId]
          const position = vehiclePositions.value[vehicleId]
          
          if (marker && position && isValidCoordinates(position)) {
            marker.setPosition([position.lng, position.lat])
          }
        })
      } catch (error) {
        console.error('更新车辆位置失败:', error)
      }
    }
    
    // 更新地图标记
    const updateMapMarkers = () => {
      if (!map.value) return
      
      // 获取当前选中的车辆
      const currentSelected = selectedVehicles.value
      
      // 先添加或更新选中车辆的标记，确保地图上始终有标记
      currentSelected.forEach(vehicleId => {
        const vehicle = vehicles.value.find(v => v.id === vehicleId)
        const position = vehiclePositions.value[vehicleId]
        
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
      
      // 调整地图视野以显示所有选中的车辆
      adjustMapBounds()
    }
    
    // 调整地图视野
    const adjustMapBounds = () => {
      if (!map.value || selectedVehicles.value.length === 0) return
      
      const positions = []
      selectedVehicles.value.forEach(vehicleId => {
        const position = vehiclePositions.value[vehicleId]
        if (position && isValidCoordinates(position)) {
          positions.push([position.lng, position.lat])
        }
      })
      
      if (positions.length > 0) {
        try {
          const bounds = new window.AMap.Bounds()
          positions.forEach(pos => {
            bounds.extend(pos)
          })
          
          // 设置地图视野，包含所有选中的车辆
          map.value.setBounds(bounds, {
            padding: [50, 50, 50, 50] // 添加内边距
          })
        } catch (error) {
          console.error('调整地图视野失败:', error)
        }
      }
    }
    
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
    
    // 地图控制方法
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
    
    const fitBounds = () => {
      if (map.value && selectedVehicles.value.length > 0) {
        adjustMapBounds()
      }
    }
    
    const clearMarkers = () => {
      Object.values(markers.value).forEach(marker => {
        map.value.remove(marker)
      })
      markers.value = {}
    }
    
    // 格式化时间
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleString('zh-CN')
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
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
    
    // 获取状态文本
    const getStatusText = (status) => {
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
    
    // 获取位置地址（模拟地理编码）
    const getLocationAddress = (position) => {
      // 这里可以集成真实的地理编码服务
      const lat = position.lat.toFixed(4)
      const lng = position.lng.toFixed(4)
      return `北京市 (${lat}, ${lng})`
    }
    
    // 获取告警信息
    const getAlarmInfo = (vehicleId) => {
      // 模拟告警信息
      const alarms = {
        '001': '超速告警',
        '003': '疲劳驾驶',
        '005': '偏离路线'
      }
      return alarms[vehicleId] || null
    }
    
    // 切换到指定车辆位置
    const focusOnVehicle = (vehicleId) => {
      if (!map.value) return
      
      const position = vehiclePositions.value[vehicleId]
      if (position && isValidCoordinates(position)) {
        // 如果只有一个选中的车辆，聚焦到该车辆
        if (selectedVehicles.value.length === 1) {
          safeSetCenter(position.lng, position.lat)
          map.value.setZoom(15)
        } else {
          // 如果有多个选中的车辆，调整视野显示所有车辆
          adjustMapBounds()
        }
      }
    }
    
    // 监听选中车辆变化，自动聚焦到新选中的车辆
    watch(selectedVehicles, (newSelected, oldSelected) => {
      updateMapMarkers()
      
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
          focusOnVehicle(newSelected[0])
        } else {
          // 多个车辆时，调整视野显示所有车辆
          adjustMapBounds()
        }
      } else {
        // 没有选中车辆时，清空状态栏
        lastSelectedVehicle.value = null
        lastSelectedVehiclePosition.value = null
      }
      
      // 注意：不要在这里清空 selectedVehicle，保持车辆信息面板的显示
      // 只有在用户主动关闭时才清空
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
            // 使用安全的方法设置地图中心
            if (safeSetCenter(position.lng, position.lat)) {
              map.value.setZoom(15) // 设置合适的缩放级别
              
              console.log(`地图已定位到车辆 ${vehicleId} 位置: [${position.lng}, ${position.lat}]`)
              
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
    
    // 检查坐标是否有效
    const isValidCoordinates = (position) => {
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
      
      return isValidLng && isValidLat && isNotZero
    }
    
    // 安全设置地图中心
    const safeSetCenter = (lng, lat) => {
      if (!map.value) return false
      
      // 验证坐标
      if (typeof lng !== 'number' || typeof lat !== 'number' || 
          isNaN(lng) || isNaN(lat) ||
          lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        console.warn('无效的坐标:', { lng, lat })
        return false
      }
      
      try {
        map.value.setCenter([lng, lat])
        return true
      } catch (error) {
        console.error('设置地图中心失败:', error)
        return false
      }
    }
    
    // 监听位置数据变化，只更新标记位置，不调整视野
    watch(vehiclePositions, () => {
      // 只更新现有标记的位置，不重新创建标记
      Object.keys(markers.value).forEach(vehicleId => {
        const marker = markers.value[vehicleId]
        const position = vehiclePositions.value[vehicleId]
        
        if (marker && position) {
          marker.setPosition([position.lng, position.lat])
        }
      })
      
      // 更新状态栏中的位置信息
      if (lastSelectedVehicle.value) {
        const position = vehiclePositions.value[lastSelectedVehicle.value.id]
        if (position) {
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
    
    onMounted(() => {
      initMap()
      
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
        focusOnVehicle(vehicleId)
      })
      
      // 监听地图标记更新事件
      window.addEventListener('update-map-markers', () => {
        updateMapMarkers()
      })
    })
    
    onUnmounted(() => {
      if (updateTimer.value) {
        clearInterval(updateTimer.value)
      }
      
      // 移除事件监听
      window.removeEventListener('focus-vehicle', (event) => {
        const { vehicleId } = event.detail
        focusOnVehicle(vehicleId)
      })
      
      window.removeEventListener('update-map-markers', () => {
        updateMapMarkers()
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
      closeVehicleInfoBar,
      formatTime,
      getStatusType,
      getStatusText,
      getLocationAddress,
      getAlarmInfo,
      isValidCoordinates,
      safeSetCenter
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

/* 地图控制面板 */
.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 车辆信息面板 */
.vehicle-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.info-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-content {
  padding: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.value.speed {
  color: #52c41a;
  font-weight: 600;
}

/* 车辆实时信息栏 */
.vehicle-info-bar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow: hidden;
}

.info-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.info-bar-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.info-bar-content {
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.speed-value {
  color: #52c41a;
  font-weight: 600;
}

.no-alarm {
  color: #52c41a;
  font-size: 12px;
}

.location-text {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.time-text {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .vehicle-detail-info {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .vehicle-info-panel {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .map-controls {
    top: 10px;
    right: 10px;
  }
  
  .vehicle-info-panel {
    top: 10px;
    right: 10px;
    width: 240px;
  }
  
  .map-status-bar {
    bottom: 10px;
    left: 10px;
    right: 10px;
    padding: 12px;
  }
  
  .vehicle-detail-info {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .vehicle-basic-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-header {
    padding: 12px;
  }
  
  .info-content {
    padding: 12px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style> 