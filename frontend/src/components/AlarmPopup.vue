<template>
  <div class="alarm-popup-container" v-if="visible && showAlarmPopup">
    <Transition name="alarm-slide">
      <div class="alarm-popup" v-if="currentAlarms.length > 0">
        <div class="alarm-header">
          <div class="alarm-icon">🚨</div>
          <div class="alarm-title">
            <span class="alarm-type">车辆告警信息</span>
            <span class="alarm-count">{{ currentAlarms.length }} 辆车告警</span>
          </div>
          <button class="close-btn" @click="closeAlarm">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        
        <div class="alarm-content">
          <div class="alarm-list">
            <div 
              v-for="alarm in currentAlarms" 
              :key="alarm.id" 
              class="alarm-item"
              :class="`level-${alarm.alarmLevel}`"
            >
              <div class="alarm-item-main">
                <div class="alarm-item-left">
                  <span class="alarm-item-icon">{{ alarm.alarmIcon }}</span>
                  <div class="alarm-item-info">
                    <div class="vehicle-info">
                      <span class="vehicle-no">{{ alarm.vehicleNo }}</span>
                      <span class="alarm-type">{{ alarm.alarmTypeName }}</span>
                    </div>
                    <div class="time-info">{{ formatTime(alarm.alarmTime) }}</div>
                  </div>
                </div>
                <div class="alarm-item-right">
                  <span class="alarm-level">{{ getLevelText(alarm.alarmLevel) }}</span>
                  <div class="alarm-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="locateVehicle(alarm.vehicleId)"
                      title="定位车辆"
                    >
                      <el-icon><Location /></el-icon>
                    </el-button>
                    <el-button 
                      size="small" 
                      @click="markAsRead(alarm.id)"
                      title="标记已读"
                    >
                      <el-icon><Check /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="alarm-summary">
            <div class="summary-stats">
              <span class="stat-item">
                <span class="stat-label">高级别:</span>
                <span class="stat-value high">{{ getAlarmCountByLevel('high') }}</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">中级别:</span>
                <span class="stat-value medium">{{ getAlarmCountByLevel('medium') }}</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">低级别:</span>
                <span class="stat-value low">{{ getAlarmCountByLevel('low') }}</span>
              </span>
            </div>
            
            <div class="summary-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click="locateAllVehicles"
              >
                <el-icon><Location /></el-icon>
                定位所有车辆
              </el-button>
              <el-button 
                size="small" 
                @click="markAllAsRead"
              >
                <el-icon><Check /></el-icon>
                全部已读
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'
import { useAlarmService } from '@/composables/useAlarmService'
import { Close, Location, Check } from '@element-plus/icons-vue'

export default {
  name: 'AlarmPopup',
  components: {
    Close,
    Location,
    Check
  },
  props: {
    alarms: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const vehicleStore = useVehicleStore()
    const { onNewAlarms, startAlarmPolling, stopAlarmPolling } = useAlarmService()
    const visible = ref(false)
    const currentAlarms = ref([])
    
    // 从store获取告警设置
    const showAlarmPopup = computed(() => vehicleStore.getAlarmSettings.showAlarmPopup)
    
    // 获取告警级别文本
    const getLevelText = (level) => {
      const levelMap = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return levelMap[level] || '未知'
    }
    
    // 格式化时间
    const formatTime = (timeString) => {
      const date = new Date(timeString)
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    
    // 播放告警提示音
    const playAlarmSound = () => {
      if (!vehicleStore.getAlarmSettings.enableAlarmSound) return
      
      // 如果音频上下文不存在，说明用户还没有交互，跳过播放
      if (!window.alarmAudioContext) {
        console.log('音频上下文未初始化，跳过播放')
        return
      }
      
      try {
        const audioContext = window.alarmAudioContext
        
        // 如果音频上下文被暂停，尝试恢复
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            playAlarmTone(audioContext)
          }).catch(error => {
            console.warn('无法恢复音频上下文:', error)
          })
        } else {
          playAlarmTone(audioContext)
        }
      } catch (error) {
        console.warn('播放告警提示音失败:', error)
      }
    }
    
    // 播放告警音调
    const playAlarmTone = (audioContext) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
    
    // 显示告警
    const showAlarms = (alarms) => {
      if (!showAlarmPopup.value || alarms.length === 0) return
      
      // 播放提示音
      playAlarmSound()
      
      // 设置当前告警
      currentAlarms.value = alarms
      visible.value = true
      
      // 8秒后自动关闭
      setTimeout(() => {
        closeAlarm()
      }, 8000)
    }
    
    // 关闭告警
    const closeAlarm = () => {
      visible.value = false
      
      // 延迟后清空告警
      setTimeout(() => {
        currentAlarms.value = []
      }, 300)
    }
    
    // 定位车辆
    const locateVehicle = (vehicleId) => {
      vehicleStore.setCenterMapToVehicle(vehicleId)
    }
    
    // 标记为已读
    const markAsRead = (alarmId) => {
      vehicleStore.markAlarmAsRead(alarmId)
      // 从当前显示中移除
      const index = currentAlarms.value.findIndex(a => a.id === alarmId)
      if (index > -1) {
        currentAlarms.value.splice(index, 1)
      }
    }
    
    // 定位所有车辆
    const locateAllVehicles = () => {
      currentAlarms.value.forEach(alarm => {
        vehicleStore.setCenterMapToVehicle(alarm.vehicleId)
      })
    }
    
    // 标记所有为已读
    const markAllAsRead = () => {
      currentAlarms.value.forEach(alarm => {
        vehicleStore.markAlarmAsRead(alarm.id)
      })
      closeAlarm()
    }
    
    // 获取指定级别的告警数量
    const getAlarmCountByLevel = (level) => {
      return currentAlarms.value.filter(alarm => alarm.alarmLevel === level).length
    }
    
    // 监听新告警
    const handleNewAlarms = (newAlarms) => {
      if (newAlarms.length > 0) {
        showAlarms(newAlarms)
      }
    }
    
    onMounted(() => {
      // 开始轮询告警数据
      startAlarmPolling()
      
      // 监听新告警事件
      const cleanup = onNewAlarms((newAlarms) => {
        if (newAlarms.length > 0) {
          showAlarms(newAlarms)
        }
      })
      
      // 添加用户交互监听，用于初始化音频上下文
      const initAudioOnUserInteraction = () => {
        if (!window.alarmAudioContext && vehicleStore.getAlarmSettings.enableAlarmSound) {
          try {
            window.alarmAudioContext = new (window.AudioContext || window.webkitAudioContext)()
            console.log('音频上下文已在用户交互后创建')
            // 移除事件监听器
            document.removeEventListener('click', initAudioOnUserInteraction)
            document.removeEventListener('keydown', initAudioOnUserInteraction)
            document.removeEventListener('touchstart', initAudioOnUserInteraction)
          } catch (error) {
            console.warn('创建音频上下文失败:', error)
          }
        }
      }
      
      // 监听用户交互事件
      document.addEventListener('click', initAudioOnUserInteraction)
      document.addEventListener('keydown', initAudioOnUserInteraction)
      document.addEventListener('touchstart', initAudioOnUserInteraction)
      
      // 保存清理函数
      onUnmounted(() => {
        cleanup()
        stopAlarmPolling()
        // 清理事件监听器
        document.removeEventListener('click', initAudioOnUserInteraction)
        document.removeEventListener('keydown', initAudioOnUserInteraction)
        document.removeEventListener('touchstart', initAudioOnUserInteraction)
      })
    })
    
    onUnmounted(() => {
      // 清理数据
      currentAlarms.value = []
    })
    
    return {
      visible,
      currentAlarms,
      showAlarmPopup,
      getLevelText,
      formatTime,
      showAlarms,
      closeAlarm,
      locateVehicle,
      markAsRead,
      locateAllVehicles,
      markAllAsRead,
      getAlarmCountByLevel,
      handleNewAlarms
    }
  }
}
</script>

<style scoped>
.alarm-popup-container {
  position: fixed;
  bottom: 60px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.alarm-popup {
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  pointer-events: auto;
  overflow: hidden;
}

.alarm-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
}

.alarm-icon {
  font-size: 20px;
  margin-right: 12px;
}

.alarm-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alarm-type {
  font-size: 14px;
  font-weight: 600;
}

.alarm-count {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  width: fit-content;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.alarm-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.alarm-list {
  margin-bottom: 16px;
}

.alarm-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}

.alarm-item:last-child {
  margin-bottom: 0;
}

.alarm-item.level-high {
  border-left: 4px solid #ff4d4f;
}

.alarm-item.level-medium {
  border-left: 4px solid #faad14;
}

.alarm-item.level-low {
  border-left: 4px solid #52c41a;
}

.alarm-item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fafafa;
}

.alarm-item-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.alarm-item-icon {
  font-size: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.alarm-item-info {
  flex: 1;
  min-width: 0;
}

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.vehicle-no {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.alarm-type {
  font-size: 10px;
  color: #666;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 3px;
}

.time-info {
  font-size: 10px;
  color: #999;
}

.alarm-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.alarm-level {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #e8e8e8;
  color: #666;
  font-weight: 500;
}

.alarm-actions {
  display: flex;
  gap: 4px;
}

.alarm-summary {
  border-top: 1px solid #e8e8e8;
  padding-top: 12px;
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #666;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.stat-value.high {
  background: #fff2f0;
  color: #ff4d4f;
}

.stat-value.medium {
  background: #fffbe6;
  color: #faad14;
}

.stat-value.low {
  background: #f6ffed;
  color: #52c41a;
}

.summary-actions {
  display: flex;
  gap: 8px;
}

/* 动画效果 */
.alarm-slide-enter-active,
.alarm-slide-leave-active {
  transition: all 0.3s ease;
}

.alarm-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.alarm-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .alarm-popup-container {
    bottom: 50px;
    right: 10px;
    left: 10px;
  }
  
  .alarm-popup {
    width: 100%;
    max-width: 400px;
  }
  
  .alarm-actions {
    flex-direction: column;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .summary-stats {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style> 