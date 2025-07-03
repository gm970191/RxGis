import { ref, onMounted, onUnmounted } from 'vue'
import { useVehicleStore } from '@/stores/vehicle'

export function useAlarmService() {
  const vehicleStore = useVehicleStore()
  const alarmInterval = ref(null)
  const isPolling = ref(false)
  
  // 开始轮询告警数据
  const startAlarmPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    if (import.meta.env.DEV) {
      console.log('开始轮询告警数据...')
    }
    
    // 立即执行一次
    pollAlarms()
    
    // 每3秒轮询一次
    alarmInterval.value = setInterval(pollAlarms, 3000)
  }
  
  // 停止轮询告警数据
  const stopAlarmPolling = () => {
    if (alarmInterval.value) {
      clearInterval(alarmInterval.value)
      alarmInterval.value = null
    }
    isPolling.value = false
    if (import.meta.env.DEV) {
      console.log('停止轮询告警数据')
    }
  }
  
  // 轮询告警数据
  const pollAlarms = async () => {
    try {
      const newAlarms = await vehicleStore.fetchRealTimeAlarms()
      
      if (newAlarms.length > 0) {
        // 只在开发环境下输出详细日志
        if (import.meta.env.DEV) {
          console.log(`获取到 ${newAlarms.length} 条新告警`)
        }
        
        // 触发告警通知事件
        emitAlarmNotification(newAlarms)
      }
    } catch (error) {
      console.error('轮询告警数据失败:', error)
    }
  }
  
  // 触发告警通知事件
  const emitAlarmNotification = (newAlarms) => {
    // 创建自定义事件
    const event = new CustomEvent('newAlarms', {
      detail: { alarms: newAlarms }
    })
    
    // 触发事件
    window.dispatchEvent(event)
  }
  
  // 监听新告警事件
  const onNewAlarms = (callback) => {
    const handler = (event) => {
      callback(event.detail.alarms)
    }
    
    window.addEventListener('newAlarms', handler)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('newAlarms', handler)
    }
  }
  
  // 获取告警统计信息
  const getAlarmStats = () => {
    const alarms = vehicleStore.alarms
    const unreadAlarms = vehicleStore.getUnreadAlarms
    
    return {
      total: alarms.length,
      unread: unreadAlarms.length,
      high: alarms.filter(a => a.alarmLevel === 'high').length,
      medium: alarms.filter(a => a.alarmLevel === 'medium').length,
      low: alarms.filter(a => a.alarmLevel === 'low').length
    }
  }
  
  // 清空所有告警
  const clearAllAlarms = () => {
    vehicleStore.clearAllAlarms()
  }
  
  // 标记所有告警为已读
  const markAllAsRead = () => {
    vehicleStore.markAllAlarmsAsRead()
  }
  
  // 移除自动轮询，让调用者手动控制
  // onMounted(() => {
  //   // 组件挂载时自动开始轮询
  //   startAlarmPolling()
  // })
  
  // onUnmounted(() => {
  //   // 组件卸载时停止轮询
  //   stopAlarmPolling()
  // })
  
  return {
    isPolling,
    startAlarmPolling,
    stopAlarmPolling,
    pollAlarms,
    onNewAlarms,
    getAlarmStats,
    clearAllAlarms,
    markAllAsRead
  }
} 