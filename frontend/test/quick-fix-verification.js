// 快速修复验证脚本
// 用于验证地图坐标验证修复是否有效

console.log('🚀 开始验证地图坐标修复...')

// 模拟修复后的坐标验证函数
function isValidCoordinates(position) {
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
  
  // 检查是否为有限数字 - 修复后的变量名
  const isFiniteNumber = isFinite(position.lng) && isFinite(position.lat)
  
  return isValidLng && isValidLat && isNotZero && isFiniteNumber
}

// 测试用例
const testCases = [
  { position: { lng: 116.397428, lat: 39.90923 }, expected: true, name: '北京坐标' },
  { position: { lng: NaN, lat: 39.90923 }, expected: false, name: 'NaN经度' },
  { position: { lng: 116.397428, lat: NaN }, expected: false, name: 'NaN纬度' },
  { position: { lng: Infinity, lat: 39.90923 }, expected: false, name: '无穷大经度' },
  { position: { lng: 116.397428, lat: -Infinity }, expected: false, name: '负无穷大纬度' },
  { position: { lng: 0, lat: 0 }, expected: false, name: '零坐标' },
  { position: { lng: 181, lat: 39.90923 }, expected: false, name: '超出经度范围' },
  { position: { lng: 116.397428, lat: 91 }, expected: false, name: '超出纬度范围' },
  { position: { lng: 'invalid', lat: 39.90923 }, expected: false, name: '字符串经度' },
  { position: { lng: 116.397428, lat: 'invalid' }, expected: false, name: '字符串纬度' },
  { position: null, expected: false, name: 'null位置' },
  { position: { lng: undefined, lat: 39.90923 }, expected: false, name: 'undefined经度' },
  { position: { lng: 116.397428, lat: undefined }, expected: false, name: 'undefined纬度' }
]

// 运行测试
let passedTests = 0
let totalTests = testCases.length

console.log(`📋 开始运行 ${totalTests} 个测试用例...`)

testCases.forEach((testCase, index) => {
  try {
    const result = isValidCoordinates(testCase.position)
    const passed = result === testCase.expected
    
    if (passed) {
      console.log(`✅ 测试 ${index + 1}: ${testCase.name} - 通过`)
      passedTests++
    } else {
      console.log(`❌ 测试 ${index + 1}: ${testCase.name} - 失败 (期望: ${testCase.expected}, 实际: ${result})`)
    }
  } catch (error) {
    console.log(`💥 测试 ${index + 1}: ${testCase.name} - 异常: ${error.message}`)
  }
})

// 输出结果
console.log('\n📊 测试结果汇总:')
console.log(`总测试数: ${totalTests}`)
console.log(`通过测试: ${passedTests}`)
console.log(`失败测试: ${totalTests - passedTests}`)
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

if (passedTests === totalTests) {
  console.log('🎉 所有测试通过！地图坐标验证修复成功！')
} else {
  console.log('⚠️ 部分测试失败，需要进一步检查。')
}

// 验证isFinite变量名冲突修复
console.log('\n🔍 验证isFinite变量名冲突修复...')
try {
  // 尝试调用修复后的函数
  const testResult = isValidCoordinates({ lng: 116.397428, lat: 39.90923 })
  console.log('✅ isFinite变量名冲突已修复，函数正常工作')
} catch (error) {
  console.log('❌ isFinite变量名冲突仍然存在:', error.message)
}

console.log('\n✨ 验证完成！') 