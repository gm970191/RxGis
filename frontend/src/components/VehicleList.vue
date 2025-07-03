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
      <!-- 过滤工具栏 -->
      <div class="vehicle-filter-toolbar" v-show="showFilterPanel">
        <div class="filter-row">
          <el-input
            v-model="filters.vehicleNo"
            placeholder="车牌号"
            size="small"
            clearable
            @input="applyFilters"
            style="width: 120px;"
          >
            <template #prefix>
              <el-icon><Van /></el-icon>
            </template>
          </el-input>
          
          <el-input
            v-model="filters.terminalId"
            placeholder="终端号码"
            size="small"
            clearable
            @input="applyFilters"
            style="width: 120px;"
          >
            <template #prefix>
              <el-icon><Monitor /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filters.status"
            placeholder="状态"
            size="small"
            clearable
            @change="applyFilters"
            style="width: 100px;"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        
        <div class="filter-row">
          <el-select
            v-model="filters.vehicleType"
            placeholder="车辆类型"
            size="small"
            clearable
            @change="applyFilters"
            style="width: 120px;"
          >
            <el-option
              v-for="option in vehicleTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <el-select
            v-model="filters.groupId"
            placeholder="车组"
            size="small"
            clearable
            filterable
            remote
            :remote-method="filterGroupOptions"
            :loading="groupLoading"
            @change="applyFilters"
            style="width: 140px;"
          >
            <el-option
              v-for="option in filteredGroupOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <el-select
            v-model="filters.company"
            placeholder="公司"
            size="small"
            clearable
            filterable
            remote
            :remote-method="filterCompanyOptions"
            :loading="companyLoading"
            @change="applyFilters"
            style="width: 140px;"
          >
            <el-option
              v-for="option in filteredCompanyOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        
        <div class="filter-actions">
          <el-button 
            size="small" 
            @click="resetFilters"
            :disabled="!hasActiveFiltersComputed"
          >
            重置
          </el-button>
        </div>
        
        <div class="filter-stats">
          <span class="stats-info">
            显示: {{ filteredVehicles.length }}/{{ allVehicles.length }} 
            ({{ filterStats.percentage }}%)
          </span>
          <span v-if="hasActiveFiltersComputed" class="active-filters">
            <el-icon><Filter /></el-icon>
            已过滤
          </span>
        </div>
      </div>
      
      <div class="vehicle-list-toolbar">
        <div class="toolbar-left">
          <span class="selection-info">已选择: {{ selectedVehicles.length }}/{{ filteredVehicles.length }}</span>
          <el-button 
            size="small" 
            type="primary" 
            @click="selectAll"
            :disabled="filteredVehicles.length === 0"
            style="margin-left: 10px;"
          >
            全选
          </el-button>
          <el-button 
            size="small" 
            @click="clearSelection"
            :disabled="selectedVehicles.length === 0"
            style="margin-left: 5px;"
          >
            清空
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <el-button 
            size="small" 
            @click="toggleFilterPanel"
            :type="showFilterPanel ? 'primary' : ''"
          >
            <el-icon><Filter /></el-icon>
            {{ showFilterPanel ? '隐藏过滤' : '显示过滤' }}
          </el-button>
        </div>
      </div>
      
      <div class="vehicle-list-items">
        <div 
          v-for="vehicle in filteredVehicles" 
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
              <span class="vehicle-group" v-if="vehicle.groupName">{{ vehicle.groupName }}</span>
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
        
        <!-- 无数据提示 -->
        <div v-if="filteredVehicles.length === 0" class="no-data">
          <el-empty description="暂无符合条件的车辆" />
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import { allMockVehicles } from '@/utils/mockData'
import { 
  filterVehicles, 
  getStatusOptions, 
  getVehicleTypeOptionsWithAll, 
  getGroupOptionsWithAll, 
  getCompanyOptionsWithAll,
  getDefaultFilters,
  hasActiveFilters,
  getFilterStats
} from '@/utils/filterUtils'
import { 
  Rank, 
  ArrowLeft, 
  ArrowRight, 
  Van, 
  Monitor, 
  Filter 
} from '@element-plus/icons-vue'

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
    
    // 初始化车辆数据 - 使用100辆车的数据
    if (vehicleStore.vehicles.length === 0) {
      vehicleStore.setVehicles(allMockVehicles)
    }
    
    // 默认选中第一辆车
    if (vehicleStore.getSelectedVehicles.length === 0 && vehicleStore.getAllVehicles.length > 0) {
      vehicleStore.selectVehicle(vehicleStore.getAllVehicles[0].id)
    }
    
    const allVehicles = computed(() => vehicleStore.getAllVehicles)
    const selectedVehicles = computed(() => vehicleStore.getSelectedVehicles)
    const vehiclePositions = computed(() => vehicleStore.getVehiclePositions)
    
    // 过滤相关
    const filters = ref(getDefaultFilters())
    const showFilterPanel = ref(false)
    
    // 过滤选项
    const statusOptions = computed(() => getStatusOptions())
    const vehicleTypeOptions = computed(() => getVehicleTypeOptionsWithAll(allVehicles.value))
    const groupOptions = computed(() => getGroupOptionsWithAll(allVehicles.value))
    const companyOptions = computed(() => getCompanyOptionsWithAll(allVehicles.value))
    
    // 模糊匹配相关
    const filteredGroupOptions = ref([])
    const filteredCompanyOptions = ref([])
    const groupLoading = ref(false)
    const companyLoading = ref(false)
    
    // 初始化过滤选项
    filteredGroupOptions.value = groupOptions.value
    filteredCompanyOptions.value = companyOptions.value
    
    // 过滤后的车辆
    const filteredVehicles = computed(() => filterVehicles(allVehicles.value, filters.value))
    
    // 过滤统计
    const filterStats = computed(() => getFilterStats(allVehicles.value, filteredVehicles.value))
    const hasActiveFiltersComputed = computed(() => hasActiveFilters(filters.value))
    
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
    
    // 过滤相关方法
    const applyFilters = () => {
      // 过滤逻辑已经在computed中处理
      console.log('应用过滤条件:', filters.value)
    }
    
    const resetFilters = () => {
      filters.value = getDefaultFilters()
    }
    
    const toggleFilterPanel = () => {
      showFilterPanel.value = !showFilterPanel.value
      console.log('过滤面板状态切换:', showFilterPanel.value ? '显示' : '隐藏')
    }
    
    // 模糊匹配方法
    const filterGroupOptions = (query) => {
      if (query !== '') {
        groupLoading.value = true
        setTimeout(() => {
          const filtered = groupOptions.value.filter(option => 
            option.label.toLowerCase().includes(query.toLowerCase())
          )
          filteredGroupOptions.value = filtered
          groupLoading.value = false
        }, 200)
      } else {
        filteredGroupOptions.value = groupOptions.value
      }
    }
    
    const filterCompanyOptions = (query) => {
      if (query !== '') {
        companyLoading.value = true
        setTimeout(() => {
          const filtered = companyOptions.value.filter(option => 
            option.label.toLowerCase().includes(query.toLowerCase())
          )
          filteredCompanyOptions.value = filtered
          companyLoading.value = false
        }, 200)
      } else {
        filteredCompanyOptions.value = companyOptions.value
      }
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
      const allVehicleIds = filteredVehicles.value.map(v => v.id)
      // 清空当前选择，然后选择所有过滤后的车辆
      vehicleStore.clearSelection()
      allVehicleIds.forEach(id => vehicleStore.selectVehicle(id))
    }
    
    const clearSelection = () => {
      vehicleStore.clearSelection()
      console.log('清空选择完成，当前选中车辆数:', vehicleStore.getSelectedVehicles.length)
    }
    
    // 使用store中的统计数据
    const vehicleStats = computed(() => vehicleStore.getVehicleStats)
    const movingCount = computed(() => vehicleStats.value.online)
    const stoppedCount = computed(() => vehicleStats.value.parking)
    const offlineCount = computed(() => vehicleStats.value.offline)
    const onlinePercentage = computed(() => {
      const totalVehicles = vehicleStats.value.total
      const onlineVehicles = vehicleStats.value.online + vehicleStats.value.parking
      return totalVehicles > 0 ? ((onlineVehicles / totalVehicles) * 100).toFixed(1) : '0.0'
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
    
    // 监听车辆数据变化，更新过滤选项
    watch(allVehicles, () => {
      filteredGroupOptions.value = groupOptions.value
      filteredCompanyOptions.value = companyOptions.value
    }, { deep: true })
    
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
      allVehicles,
      filteredVehicles,
      selectedVehicles,
      vehiclePositions,
      filters,
      showFilterPanel,
      statusOptions,
      vehicleTypeOptions,
      groupOptions,
      companyOptions,
      filteredGroupOptions,
      filteredCompanyOptions,
      groupLoading,
      companyLoading,
      filterStats,
      hasActiveFiltersComputed,
      isSelected,
      getVehiclePosition,
      applyFilters,
      resetFilters,
      filterGroupOptions,
      filterCompanyOptions,
      toggleFilterPanel,
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

/* 过滤工具栏样式 */
.vehicle-filter-toolbar {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.stats-info {
  font-weight: 500;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1890ff;
  font-weight: 500;
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
  align-items: center;
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

.vehicle-group {
  margin-left: 8px;
  color: #1890ff;
  font-weight: 500;
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

/* 无数据提示 */
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  color: #999;
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