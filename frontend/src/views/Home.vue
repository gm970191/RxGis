<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <div class="logo">
          <h1>RxGis 车辆监控系统</h1>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="small">
            <el-icon><Setting /></el-icon>
            系统设置
          </el-button>
          <el-button size="small">
            <el-icon><User /></el-icon>
            用户中心
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 车辆列表组件 -->
      <VehicleList />
      
      <!-- 地图容器 -->
      <MapContainer />
    </div>
    
    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-content">
        <div class="status-item">
          <span class="label">在线车辆:</span>
          <span class="value">{{ onlineVehiclesCount }}</span>
        </div>
        <div class="status-item">
          <span class="label">选中车辆:</span>
          <span class="value">{{ selectedVehiclesCount }}</span>
        </div>
        <div class="status-item">
          <span class="label">最后更新:</span>
          <span class="value">{{ lastUpdateTime }}</span>
        </div>
        <div class="status-item">
          <span class="label">系统状态:</span>
          <span class="value status-online">正常</span>
        </div>
        
        <!-- 车辆信息栏控制按钮 -->
        <div class="status-controls">
          <el-button 
            :type="showVehicleInfoBar ? 'primary' : 'default'"
            size="small"
            @click="toggleVehicleInfoBar"
            :disabled="selectedVehiclesCount === 0"
            title="车辆实时信息"
          >
            <el-icon><InfoFilled /></el-icon>
            <span class="button-text">车辆信息</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, provide } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import VehicleList from '@/components/VehicleList.vue'
import MapContainer from '@/components/MapContainer.vue'
import { InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: {
    VehicleList,
    MapContainer
  },
  setup() {
    const vehicleStore = useVehicleStore()
    const lastUpdateTime = ref('--')
    const showVehicleInfoBar = ref(false)
    
    const onlineVehiclesCount = computed(() => {
      return vehicleStore.getAllVehicles.filter(v => v.status === 1).length
    })
    
    const selectedVehiclesCount = computed(() => {
      return vehicleStore.getSelectedVehicles.length
    })
    
    // 切换车辆信息栏显示状态
    const toggleVehicleInfoBar = () => {
      showVehicleInfoBar.value = !showVehicleInfoBar.value
    }
    
    // 更新最后更新时间
    const updateLastUpdateTime = () => {
      lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    }
    
    // 向子组件提供状态
    provide('showVehicleInfoBar', showVehicleInfoBar)
    provide('toggleVehicleInfoBar', toggleVehicleInfoBar)
    
    onMounted(() => {
      updateLastUpdateTime()
      // 每分钟更新一次时间
      setInterval(updateLastUpdateTime, 60000)
    })
    
    return {
      onlineVehiclesCount,
      selectedVehiclesCount,
      lastUpdateTime,
      showVehicleInfoBar,
      toggleVehicleInfoBar
    }
  }
}
</script>

<style scoped>
/* Home 页面样式 */

.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.header {
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* 底部状态栏 */
.status-bar {
  height: 40px;
  background: white;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.status-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-item .label {
  font-size: 12px;
  color: #666;
}

.status-item .value {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.status-online {
  color: #52c41a !important;
}

.status-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.button-text {
  margin-left: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo h1 {
    font-size: 16px;
  }
  
  .status-content {
    padding: 0 16px;
    gap: 16px;
  }
  
  .status-item {
    gap: 4px;
  }
  
  .status-item .label,
  .status-item .value {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .header {
    height: 50px;
  }
  
  .logo h1 {
    font-size: 14px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .status-bar {
    height: 35px;
  }
  
  .status-content {
    gap: 12px;
  }
}
</style> 