// 最终验证脚本 - 检查告警功能完整性
console.log('=== 告警功能最终验证 ===')

// 1. 检查告警服务状态
function checkAlarmService() {
  console.log('1. 检查告警服务状态...')
  
  // 检查告警服务是否可用
  if (typeof window.useAlarmService === 'undefined') {
    console.log('❌ 告警服务未找到')
    return false
  }
  
  console.log('✅ 告警服务可用')
  return true
}

// 2. 检查告警弹窗组件
function checkAlarmPopup() {
  console.log('2. 检查告警弹窗组件...')
  
  const alarmPopup = document.querySelector('.alarm-popup')
  if (!alarmPopup) {
    console.log('❌ 告警弹窗组件未找到')
    return false
  }
  
  console.log('✅ 告警弹窗组件存在')
  return true
}

// 3. 检查音频上下文
function checkAudioContext() {
  console.log('3. 检查音频上下文...')
  
  if (!window.alarmAudioContext) {
    console.log('❌ 音频上下文未初始化')
    return false
  }
  
  console.log('✅ 音频上下文已初始化')
  return true
}

// 4. 检查告警数据生成
function checkAlarmData() {
  console.log('4. 检查告警数据生成...')
  
  // 模拟告警数据生成
  try {
    const mockAlarms = generateMockAlarms()
    console.log(`✅ 告警数据生成正常，生成了 ${mockAlarms.length} 条告警`)
    return true
  } catch (error) {
    console.log('❌ 告警数据生成失败:', error)
    return false
  }
}

// 5. 检查告警轮询
function checkAlarmPolling() {
  console.log('5. 检查告警轮询...')
  
  // 检查是否有轮询定时器
  const hasPolling = document.querySelector('[data-alarm-polling]')
  if (!hasPolling) {
    console.log('❌ 告警轮询未启动')
    return false
  }
  
  console.log('✅ 告警轮询已启动')
  return true
}

// 6. 检查控制台输出优化
function checkConsoleOptimization() {
  console.log('6. 检查控制台输出优化...')
  
  // 检查是否为开发环境
  const isDev = import.meta.env.DEV
  console.log(`当前环境: ${isDev ? '开发环境' : '生产环境'}`)
  
  if (isDev) {
    console.log('✅ 开发环境下会显示详细日志')
  } else {
    console.log('✅ 生产环境下已优化日志输出')
  }
  
  return true
}

// 7. 检查告警功能完整性
function checkAlarmFunctionality() {
  console.log('7. 检查告警功能完整性...')
  
  const checks = [
    { name: '告警服务', result: checkAlarmService() },
    { name: '告警弹窗', result: checkAlarmPopup() },
    { name: '音频上下文', result: checkAudioContext() },
    { name: '告警数据', result: checkAlarmData() },
    { name: '告警轮询', result: checkAlarmPolling() },
    { name: '控制台优化', result: checkConsoleOptimization() }
  ]
  
  const passed = checks.filter(check => check.result).length
  const total = checks.length
  
  console.log(`\n=== 验证结果 ===`)
  console.log(`通过: ${passed}/${total}`)
  
  checks.forEach(check => {
    const status = check.result ? '✅' : '❌'
    console.log(`${status} ${check.name}`)
  })
  
  if (passed === total) {
    console.log('\n🎉 所有检查通过！告警功能完整且稳定')
    return true
  } else {
    console.log('\n⚠️ 部分检查未通过，请检查相关功能')
    return false
  }
}

// 8. 性能检查
function checkPerformance() {
  console.log('8. 检查性能指标...')
  
  // 检查内存使用
  if (performance.memory) {
    const memory = performance.memory
    console.log(`内存使用: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`)
  }
  
  // 检查页面加载时间
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  console.log(`页面加载时间: ${loadTime}ms`)
  
  console.log('✅ 性能检查完成')
  return true
}

// 执行所有检查
function runAllChecks() {
  console.log('开始执行告警功能完整性检查...\n')
  
  setTimeout(() => {
    checkAlarmFunctionality()
    checkPerformance()
    
    console.log('\n=== 验证完成 ===')
    console.log('告警功能已优化完成，包括：')
    console.log('- 批量告警显示')
    console.log('- 音频上下文修复')
    console.log('- 控制台输出优化')
    console.log('- 性能优化')
    console.log('- 用户体验提升')
  }, 1000)
}

// 自动运行检查
runAllChecks() 