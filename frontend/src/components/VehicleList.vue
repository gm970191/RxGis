<template>
  <div 
    class="vehicle-list-container" 
    :class="{ 'collapsed': isCollapsed }"
    :style="containerStyle"
    ref="containerRef"
  >
    <!-- 拖拽手柄 -->
    <div 
      class="drag-handle"
      @mousedown="startDrag"
      v-show="!isCollapsed"
    >
      <el-icon><Rank /></el-icon>
    </div>
    
    <!-- 调整大小手柄 -->
    <div 
      class="resize-handle resize-handle-right"
      @mousedown="(e) => startResize('right', e)"
      v-show="!isCollapsed"
    ></div>
    <div 
      class="resize-handle resize-handle-bottom"
      @mousedown="(e) => startResize('bottom', e)"
      v-show="!isCollapsed"
    ></div>
    <div 
      class="resize-handle resize-handle-corner"
      @mousedown="(e) => startResize('corner', e)"
      v-show="!isCollapsed"
    ></div>
    
    <div class="vehicle-list-header">
      <h3>车辆列表</h3>
      <el-button 
        link
        @click="toggleCollapse"
        class="collapse-btn"
      >
        <el-icon>
          <ArrowLeft v-if="!isCollapsed" />
          <ArrowRight v-else />
        </el-icon>
      </el-button>
    </div>
    
    <div class="vehicle-list-content" v-show="!isCollapsed">
      <div class="vehicle-list-toolbar">
        <div class="toolbar-left">
          <el-button 
            size="small" 
            type="primary" 
            @click="selectAll"
            :disabled="vehicles.length === 0"
          >
            全选
          </el-button>
          <el-button 
            size="small" 
            @click="clearSelection"
            :disabled="selectedVehicles.length === 0"
          >
            清空
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <span class="selection-info">已选择: {{ selectedVehicles.length }}/{{ vehicles.length }}</span>
        </div>
      </div>
      
      <div class="vehicle-list-items">
        <div 
          v-for="vehicle in vehicles" 
          :key="vehicle.id"
          class="vehicle-item"
          :class="{ 'selected': isCurrentViewVehicle(vehicle.id) }"
          @click="handleViewVehicle(vehicle.id, $event)"
        >
          <input
            type="checkbox"
            class="vehicle-checkbox"
            :checked="isSelected(vehicle.id)"
            @click.stop="toggleVehicleSelection(vehicle.id)"
          />
          <div class="vehicle-info">
            <div class="vehicle-no">{{ vehicle.vehicleNo }}</div>
            <div class="vehicle-details">
              <span class="vehicle-type">{{ vehicle.vehicleType }}</span>
              <span class="vehicle-owner">{{ vehicle.ownerName }}</span>
            </div>
          </div>
          
          <div class="vehicle-status">
            <el-tag 
              :type="getStatusType(vehicle.status)"
              size="small"
            >
              {{ getStatusText(vehicle.status) }}
            </el-tag>
          </div>
          
          <div class="vehicle-position" v-if="getVehiclePosition(vehicle.id)">
            <div class="position-info">
              <span class="speed">{{ getVehiclePosition(vehicle.id).speed }}km/h</span>
              <span class="direction">{{ getVehiclePosition(vehicle.id).direction }}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 统计信息始终显示 -->
    <div class="vehicle-list-footer" v-show="!isCollapsed">
      <div class="status-stats">
        <div class="stat-item">
          <div class="stat-dot moving"></div>
          <span>行驶: {{ movingCount }}</span>
        </div>
        <div class="stat-item">
          <div class="stat-dot stopped"></div>
          <span>停车: {{ stoppedCount }}</span>
        </div>
        <div class="stat-item">
          <div class="stat-dot offline"></div>
          <span>离线: {{ offlineCount }}</span>
        </div>
        <div class="stat-item">
          <div class="stat-dot online"></div>
          <span>在线: {{ onlinePercentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import { mockVehicles } from '@/utils/mockData'

export default {
  name: 'VehicleList',
  setup() {
    const vehicleStore = useVehicleStore()
    const isCollapsed = ref(false)
    const containerRef = ref(null)
    
    // 位置和大小状态
    const position = ref({ x: 20, y: 20 })
    const size = ref({ width: 380, height: 600 })
    
    // 拖拽和调整大小状态
    const isDragging = ref(false)
    const isResizing = ref(false)
    const resizeDirection = ref('')
    const dragStart = ref({ x: 0, y: 0 })
    const startPosition = ref({ x: 0, y: 0 })
    const startSize = ref({ width: 0, height: 0 })
    
    // 初始化车辆数据
    if (vehicleStore.vehicles.length === 0) {
      vehicleStore.setVehicles(mockVehicles)
    }
    
    // 默认选中第一辆车
    if (vehicleStore.getSelectedVehicles.length === 0 && vehicleStore.getAllVehicles.length > 0) {
      vehicleStore.selectVehicle(vehicleStore.getAllVehicles[0].id)
    }
    
    const vehicles = computed(() => vehicleStore.getAllVehicles)
    const selectedVehicles = computed(() => vehicleStore.getSelectedVehicles)
    const vehiclePositions = computed(() => vehicleStore.getVehiclePositions)
    
    // 计算容器样式
    const containerStyle = computed(() => ({
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      width: isCollapsed.value ? '60px' : `${size.value.width}px`,
      height: isCollapsed.value ? '60px' : `${size.value.height}px`
    }))
    
    const isSelected = (vehicleId) => {
      return selectedVehicles.value.includes(vehicleId)
    }
    
    const getVehiclePosition = (vehicleId) => {
      return vehiclePositions.value[vehicleId]
    }
    
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }
    
    // 当前查看车辆ID
    const currentViewVehicleId = ref(vehicleStore.getAllVehicles.length > 0 ? vehicleStore.getAllVehicles[0].id : null)
    
    // 判断是否为当前查看车辆
    const isCurrentViewVehicle = (vehicleId) => {
      return currentViewVehicleId.value === vehicleId
    }
    
    // 点击整行：切换当前查看车辆（地图中心），不影响复选框
    const handleViewVehicle = (vehicleId, event) => {
      // 如果点击的是复选框，忽略
      if (event.target && event.target.classList.contains('vehicle-checkbox')) return
      currentViewVehicleId.value = vehicleId
      vehicleStore.setCenterMapToVehicle(vehicleId)
    }
    
    // 复选框切换选择状态
    const toggleVehicleSelection = (vehicleId) => {
      if (isSelected(vehicleId)) {
        vehicleStore.deselectVehicle(vehicleId)
      } else {
        vehicleStore.selectVehicle(vehicleId)
      }
    }
    
    const selectAll = () => {
      vehicles.value.forEach(vehicle => {
        vehicleStore.selectVehicle(vehicle.id)
      })
    }
    
    const clearSelection = () => {
      vehicleStore.clearSelection()
    }
    
    const movingCount = computed(() => vehicles.value.filter(vehicle => vehicle.status === 1).length)
    const stoppedCount = computed(() => vehicles.value.filter(vehicle => vehicle.status === 2).length)
    const offlineCount = computed(() => vehicles.value.filter(vehicle => vehicle.status === 0).length)
    const onlinePercentage = computed(() => {
      const totalVehicles = vehicles.value.length
      const onlineVehicles = movingCount.value
      return totalVehicles > 0 ? ((onlineVehicles / totalVehicles) * 100).toFixed(2) : '0.00'
    })
    
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
    
    // 拖拽功能
    const startDrag = (e) => {
      e.preventDefault()
      isDragging.value = true
      dragStart.value = { x: e.clientX, y: e.clientY }
      startPosition.value = { ...position.value }
      
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', stopDrag)
    }
    
    const handleDrag = (e) => {
      if (!isDragging.value) return
      
      const deltaX = e.clientX - dragStart.value.x
      const deltaY = e.clientY - dragStart.value.y
      
      position.value = {
        x: startPosition.value.x + deltaX,
        y: startPosition.value.y + deltaY
      }
      
      // 边界检查
      const maxX = window.innerWidth - size.value.width
      const maxY = window.innerHeight - size.value.height
      
      position.value.x = Math.max(0, Math.min(position.value.x, maxX))
      position.value.y = Math.max(0, Math.min(position.value.y, maxY))
    }
    
    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
    }
    
    // 调整大小功能
    const startResize = (direction, e) => {
      e.preventDefault()
      e.stopPropagation()
      
      isResizing.value = true
      resizeDirection.value = direction
      dragStart.value = { x: e.clientX, y: e.clientY }
      startSize.value = { ...size.value }
      
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
    }
    
    const handleResize = (e) => {
      if (!isResizing.value) return
      
      const deltaX = e.clientX - dragStart.value.x
      const deltaY = e.clientY - dragStart.value.y
      
      if (resizeDirection.value === 'right' || resizeDirection.value === 'corner') {
        const newWidth = startSize.value.width + deltaX
        size.value.width = Math.max(300, Math.min(newWidth, window.innerWidth - position.value.x - 20))
      }
      
      if (resizeDirection.value === 'bottom' || resizeDirection.value === 'corner') {
        const newHeight = startSize.value.height + deltaY
        size.value.height = Math.max(400, Math.min(newHeight, window.innerHeight - position.value.y - 20))
      }
    }
    
    const stopResize = () => {
      isResizing.value = false
      resizeDirection.value = ''
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }
    
    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    })
    
    return {
      isCollapsed,
      containerRef,
      containerStyle,
      vehicles,
      selectedVehicles,
      vehiclePositions,
      isSelected,
      getVehiclePosition,
      toggleCollapse,
      toggleVehicleSelection,
      selectAll,
      clearSelection,
      movingCount,
      stoppedCount,
      offlineCount,
      onlinePercentage,
      getStatusType,
      getStatusText,
      startDrag,
      startResize,
      isCurrentViewVehicle,
      handleViewVehicle,
      currentViewVehicleId
    }
  }
}
</script>

<style scoped>
/* VehicleList 组件样式 */

/* 容器样式 */
.vehicle-list-container {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: all 0.3s ease;
  min-width: 300px;
  min-height: 400px;
}

.vehicle-list-container.collapsed {
  width: 60px !important;
  height: 60px !important;
}

/* 拖拽手柄 */
.drag-handle {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  z-index: 1001;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.drag-handle:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
}

/* 调整大小手柄 */
.resize-handle {
  position: absolute;
  z-index: 1001;
  transition: background-color 0.2s ease;
}

.resize-handle-right {
  right: 0;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
}

.resize-handle-right:hover {
  background: rgba(24, 144, 255, 0.3);
}

.resize-handle-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: ns-resize;
  background: transparent;
}

.resize-handle-bottom:hover {
  background: rgba(24, 144, 255, 0.3);
}

.resize-handle-corner {
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nw-resize;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.resize-handle-corner:hover {
  background: rgba(24, 144, 255, 0.4);
  border-color: rgba(24, 144, 255, 0.6);
}

/* 头部样式 */
.vehicle-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.vehicle-list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.collapse-btn {
  padding: 4px;
}

/* 内容区域 */
.vehicle-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 工具栏 */
.vehicle-list-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: #fafafa;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.selection-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #e6f7ff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #91d5ff;
}

/* 车辆列表项 */
.vehicle-list-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.vehicle-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1.5px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 10px;
  padding: 10px 12px;
  background: #f8f9fa;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.vehicle-item:hover {
  border-color: #1890ff;
  background: #e6f7ff;
  transform: translateY(-1px);
}

.vehicle-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

/* 复选框 */
.vehicle-checkbox {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #1890ff;
  cursor: pointer;
}

/* 车辆信息 */
.vehicle-info {
  flex: 1;
}

.vehicle-no {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.vehicle-details {
  font-size: 12px;
  color: #666;
}

.vehicle-type {
  margin-right: 8px;
}

/* 车辆状态 */
.vehicle-status {
  margin: 0 8px;
}

/* 车辆位置信息 */
.vehicle-position {
  text-align: right;
}

.position-info {
  font-size: 12px;
  color: #666;
}

.speed {
  display: block;
  color: #52c41a;
  font-weight: 600;
}

.direction {
  display: block;
  color: #666;
}

/* 底部统计 */
.vehicle-list-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

.status-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot.online {
  background: #52c41a;
}

.stat-dot.offline {
  background: #ff4d4f;
}

.stat-dot.moving {
  background: #1890ff;
}

.stat-dot.stopped {
  background: #faad14;
}

.online-percentage {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vehicle-list-container {
    min-width: 280px;
    min-height: 350px;
  }
  
  .vehicle-list-header {
    padding: 12px;
  }
  
  .vehicle-list-header h3 {
    font-size: 14px;
  }
  
  .vehicle-list-toolbar {
    padding: 8px 12px;
  }
  
  .vehicle-item {
    padding: 8px 10px;
  }
  
  .vehicle-no {
    font-size: 13px;
  }
  
  .vehicle-details {
    font-size: 11px;
  }
}
</style> 