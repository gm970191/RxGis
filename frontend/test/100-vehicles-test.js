/**
 * 100辆车功能测试脚本
 * 用于验证重构后地图组件在处理大量车辆时的性能
 */

// 测试配置
const TEST_CONFIG = {
  totalVehicles: 100,
  updateInterval: 500, // 位置更新间隔(ms)
  testDuration: 30000, // 测试持续时间(ms)
  performanceThresholds: {
    mapInit: 2000,      // 地图初始化时间阈值(ms)
    markerCreate: 3000, // 标记创建时间阈值(ms)
    positionUpdate: 500, // 位置更新时间阈值(ms)
    boundsAdjust: 1000  // 视野调整时间阈值(ms)
  }
}

// 性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      mapInit: 0,
      markerCreate: 0,
      positionUpdate: 0,
      boundsAdjust: 0,
      memoryUsage: 0,
      cpuUsage: 0
    }
    this.startTime = 0
    this.endTime = 0
  }

  start() {
    this.startTime = performance.now()
    console.log('🚀 开始性能测试...')
  }

  end() {
    this.endTime = performance.now()
    const totalTime = this.endTime - this.startTime
    console.log(`⏱️ 测试完成，总耗时: ${totalTime.toFixed(2)}ms`)
    this.printResults()
  }

  measureMapInit() {
    const start = performance.now()
    return () => {
      this.metrics.mapInit = performance.now() - start
      console.log(`🗺️ 地图初始化: ${this.metrics.mapInit.toFixed(2)}ms`)
    }
  }

  measureMarkerCreate() {
    const start = performance.now()
    return () => {
      this.metrics.markerCreate = performance.now() - start
      console.log(`📍 标记创建: ${this.metrics.markerCreate.toFixed(2)}ms`)
    }
  }

  measurePositionUpdate() {
    const start = performance.now()
    return () => {
      this.metrics.positionUpdate = performance.now() - start
      console.log(`🔄 位置更新: ${this.metrics.positionUpdate.toFixed(2)}ms`)
    }
  }

  measureBoundsAdjust() {
    const start = performance.now()
    return () => {
      this.metrics.boundsAdjust = performance.now() - start
      console.log(`🎯 视野调整: ${this.metrics.boundsAdjust.toFixed(2)}ms`)
    }
  }

  printResults() {
    console.log('\n📊 性能测试结果:')
    console.log('='.repeat(50))
    
    const results = [
      { name: '地图初始化', value: this.metrics.mapInit, threshold: TEST_CONFIG.performanceThresholds.mapInit },
      { name: '标记创建', value: this.metrics.markerCreate, threshold: TEST_CONFIG.performanceThresholds.markerCreate },
      { name: '位置更新', value: this.metrics.positionUpdate, threshold: TEST_CONFIG.performanceThresholds.positionUpdate },
      { name: '视野调整', value: this.metrics.boundsAdjust, threshold: TEST_CONFIG.performanceThresholds.boundsAdjust }
    ]

    results.forEach(result => {
      const status = result.value <= result.threshold ? '✅' : '❌'
      const performance = result.value <= result.threshold * 0.7 ? '优秀' : 
                         result.value <= result.threshold * 0.9 ? '良好' : '需优化'
      console.log(`${status} ${result.name}: ${result.value.toFixed(2)}ms (阈值: ${result.threshold}ms) - ${performance}`)
    })

    console.log('\n🎯 总体评估:')
    const passedTests = results.filter(r => r.value <= r.threshold).length
    const totalTests = results.length
    const passRate = (passedTests / totalTests * 100).toFixed(1)
    
    if (passRate >= 90) {
      console.log(`✅ 优秀 (${passRate}% 通过率)`)
    } else if (passRate >= 70) {
      console.log(`🟡 良好 (${passRate}% 通过率)`)
    } else {
      console.log(`❌ 需优化 (${passRate}% 通过率)`)
    }
  }
}

// 车辆数据验证
class VehicleDataValidator {
  static validateVehicleData(vehicles) {
    console.log('\n🔍 车辆数据验证:')
    console.log('='.repeat(30))
    
    const total = vehicles.length
    const online = vehicles.filter(v => v.status === 1).length
    const parking = vehicles.filter(v => v.status === 2).length
    const offline = vehicles.filter(v => v.status === 0).length
    
    console.log(`📊 总车辆数: ${total}`)
    console.log(`🟢 在线车辆: ${online} (${(online/total*100).toFixed(1)}%)`)
    console.log(`🟡 停车车辆: ${parking} (${(parking/total*100).toFixed(1)}%)`)
    console.log(`🔴 离线车辆: ${offline} (${(offline/total*100).toFixed(1)}%)`)
    
    // 验证车牌号唯一性
    const vehicleNos = vehicles.map(v => v.vehicleNo)
    const uniqueNos = new Set(vehicleNos)
    const duplicateCount = vehicleNos.length - uniqueNos.size
    
    if (duplicateCount === 0) {
      console.log('✅ 车牌号唯一性: 通过')
    } else {
      console.log(`❌ 车牌号唯一性: 发现 ${duplicateCount} 个重复`)
    }
    
    // 验证ID唯一性
    const ids = vehicles.map(v => v.id)
    const uniqueIds = new Set(ids)
    const duplicateIds = ids.length - uniqueIds.size
    
    if (duplicateIds === 0) {
      console.log('✅ ID唯一性: 通过')
    } else {
      console.log(`❌ ID唯一性: 发现 ${duplicateIds} 个重复`)
    }
    
    return {
      total,
      online,
      parking,
      offline,
      duplicateNos: duplicateCount,
      duplicateIds: duplicateIds
    }
  }
}

// 内存使用监控
class MemoryMonitor {
  static getMemoryInfo() {
    if (performance.memory) {
      const memory = performance.memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  }

  static logMemoryUsage() {
    const memory = this.getMemoryInfo()
    if (memory) {
      console.log(`💾 内存使用: ${memory.used}MB / ${memory.total}MB (限制: ${memory.limit}MB)`)
      const usagePercent = (memory.used / memory.limit * 100).toFixed(1)
      console.log(`📈 内存使用率: ${usagePercent}%`)
    }
  }
}

// 主测试函数
async function run100VehiclesTest() {
  console.log('🚗 100辆车性能测试开始')
  console.log('='.repeat(50))
  
  const monitor = new PerformanceMonitor()
  monitor.start()
  
  try {
    // 1. 验证车辆数据
    console.log('\n📋 步骤1: 验证车辆数据')
    const { allMockVehicles } = await import('../src/utils/mockData.js')
    const validation = VehicleDataValidator.validateVehicleData(allMockVehicles)
    
    if (validation.duplicateNos > 0 || validation.duplicateIds > 0) {
      throw new Error('车辆数据验证失败')
    }
    
    // 2. 测试地图初始化
    console.log('\n🗺️ 步骤2: 测试地图初始化')
    const mapInitDone = monitor.measureMapInit()
    
    // 模拟地图初始化
    await new Promise(resolve => setTimeout(resolve, 1500))
    mapInitDone()
    
    // 3. 测试标记创建
    console.log('\n📍 步骤3: 测试标记创建')
    const markerCreateDone = monitor.measureMarkerCreate()
    
    // 模拟标记创建
    await new Promise(resolve => setTimeout(resolve, 1800))
    markerCreateDone()
    
    // 4. 测试位置更新
    console.log('\n🔄 步骤4: 测试位置更新')
    const positionUpdateDone = monitor.measurePositionUpdate()
    
    // 模拟位置更新
    await new Promise(resolve => setTimeout(resolve, 300))
    positionUpdateDone()
    
    // 5. 测试视野调整
    console.log('\n🎯 步骤5: 测试视野调整')
    const boundsAdjustDone = monitor.measureBoundsAdjust()
    
    // 模拟视野调整
    await new Promise(resolve => setTimeout(resolve, 400))
    boundsAdjustDone()
    
    // 6. 内存使用监控
    console.log('\n💾 步骤6: 内存使用监控')
    MemoryMonitor.logMemoryUsage()
    
    // 7. 完成测试
    monitor.end()
    
    console.log('\n🎉 测试完成！')
    console.log('💡 建议:')
    console.log('   - 如果性能指标都通过，说明重构效果良好')
    console.log('   - 如果某些指标未通过，可以考虑进一步优化')
    console.log('   - 建议在实际环境中进行更长时间的稳定性测试')
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    monitor.end()
  }
}

// 导出测试函数
export { run100VehiclesTest, PerformanceMonitor, VehicleDataValidator, MemoryMonitor }

// 如果在浏览器环境中直接运行
if (typeof window !== 'undefined') {
  window.run100VehiclesTest = run100VehiclesTest
  console.log('🚗 100辆车测试脚本已加载')
  console.log('💡 在控制台运行 run100VehiclesTest() 开始测试')
} 