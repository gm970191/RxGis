<template>
  <div class="vehicle-info-panel" v-if="vehicle">
    <div class="info-header">
      <h4>{{ vehicle.vehicleNo }}</h4>
      <el-button 
        link
        size="small" 
        @click="closePanel"
      >
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="info-content">
      <div class="info-item">
        <span class="label">车辆类型:</span>
        <span class="value">{{ vehicle.vehicleType }}</span>
      </div>
      <div class="info-item">
        <span class="label">车主:</span>
        <span class="value">{{ vehicle.ownerName }}</span>
      </div>
      <div class="info-item">
        <span class="label">联系电话:</span>
        <span class="value">{{ vehicle.contactPhone }}</span>
      </div>
      <div class="info-item" v-if="position">
        <span class="label">速度:</span>
        <span class="value speed">{{ position.speed }} km/h</span>
      </div>
      <div class="info-item" v-if="position">
        <span class="label">方向:</span>
        <span class="value">{{ position.direction }}°</span>
      </div>
      <div class="info-item" v-if="position">
        <span class="label">海拔:</span>
        <span class="value">{{ position.altitude }} m</span>
      </div>
      <div class="info-item" v-if="position">
        <span class="label">更新时间:</span>
        <span class="value">{{ formatTime(position.locationTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Close } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/mapUtils'

export default {
  name: 'VehicleInfoPanel',
  components: {
    Close
  },
  props: {
    vehicle: {
      type: Object,
      default: null
    },
    position: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closePanel = () => {
      emit('close')
    }

    return {
      closePanel,
      formatTime
    }
  }
}
</script>

<style scoped>
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .vehicle-info-panel {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .vehicle-info-panel {
    top: 10px;
    right: 10px;
    width: 240px;
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