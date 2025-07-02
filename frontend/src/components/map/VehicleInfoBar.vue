<template>
  <div class="vehicle-info-bar" v-if="show && vehiclesInfo.length > 0">
    <div class="info-bar-header">
      <h4>车辆实时信息</h4>
      <el-button 
        link
        size="small" 
        @click="closeBar"
      >
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="info-bar-content">
      <el-table 
        :data="vehiclesInfo" 
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
</template>

<script>
import { Close, Warning } from '@element-plus/icons-vue'
import { getStatusType, getStatusText } from '@/utils/mapUtils'

export default {
  name: 'VehicleInfoBar',
  components: {
    Close,
    Warning
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    vehiclesInfo: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeBar = () => {
      emit('close')
    }

    return {
      closeBar,
      getStatusType,
      getStatusText
    }
  }
}
</script>

<style scoped>
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
@media (max-width: 768px) {
  .vehicle-info-bar {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
}
</style> 