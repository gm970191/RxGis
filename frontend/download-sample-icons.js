/**
 * 图标下载助手脚本
 * 注意: 这只是一个示例脚本，实际使用时需要手动下载图标
 */

import fs from 'fs'
import path from 'path'
import { getAllRequiredIcons } from './src/utils/iconUtils.js'

// 创建图标目录
const iconDir = path.join(process.cwd(), 'public', 'icons', 'vehicles')
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true })
}

// 获取所有需要的图标
const icons = getAllRequiredIcons()

console.log('🚀 图标下载助手')
console.log('=' * 50)
console.log(`📁 图标目录: ${iconDir}`)
console.log(`📋 需要下载 ${icons.length} 个图标文件`)
console.log()

// 生成下载指南
let guide = '# 图标下载指南\n\n'
guide += '## 📥 快速下载方法\n\n'

guide += '### 方法1: 使用在线图标服务\n\n'
guide += '1. 访问 https://icons8.com/icons/set/truck\n'
guide += '2. 搜索对应的车辆类型\n'
guide += '3. 下载PNG格式，32x32或48x48尺寸\n'
guide += '4. 重命名为对应的文件名\n\n'

guide += '### 方法2: 使用Flaticon\n\n'
guide += '1. 访问 https://www.flaticon.com/search?word=truck\n'
guide += '2. 下载免费图标\n'
guide += '3. 调整颜色和尺寸\n\n'

guide += '### 方法3: 使用SVG转PNG\n\n'
guide += '1. 从 https://feathericons.com/ 下载SVG\n'
guide += '2. 使用在线工具转换为PNG\n'
guide += '3. 调整尺寸为32x32或48x48\n\n'

guide += '## 🎨 颜色规范\n\n'
guide += '- **在线状态**: 绿色 (#52c41a)\n'
guide += '- **停车状态**: 黄色 (#faad14)\n'
guide += '- **离线状态**: 红色 (#ff4d4f)\n\n'

guide += '## 📋 图标清单\n\n'

icons.forEach((icon, index) => {
  guide += `${index + 1}. \`${icon.fileName}\`\n`
  guide += `   - 车辆类型: ${icon.vehicleIcon} ${icon.vehicleType}\n`
  guide += `   - 状态: ${icon.statusText}\n`
  guide += `   - 颜色: ${icon.status === 0 ? '#ff4d4f' : icon.status === 1 ? '#52c41a' : '#faad14'}\n\n`
})

guide += '## ⚠️ 注意事项\n\n'
guide += '1. 确保图标文件名完全匹配\n'
guide += '2. 使用PNG格式，支持透明背景\n'
guide += '3. 建议尺寸32x32px或48x48px\n'
guide += '4. 保持统一的设计风格\n'
guide += '5. 如果图标不存在，系统会使用默认图标\n\n'

guide += '## 🔧 测试方法\n\n'
guide += '1. 将图标文件放入 `public/icons/vehicles/` 目录\n'
guide += '2. 启动开发服务器: `npm run dev`\n'
guide += '3. 查看地图上的车辆图标是否正确显示\n'

// 保存指南
const guidePath = path.join(process.cwd(), 'ICON_DOWNLOAD_GUIDE.md')
fs.writeFileSync(guidePath, guide, 'utf8')

console.log('✅ 下载指南已生成: ICON_DOWNLOAD_GUIDE.md')
console.log()
console.log('📋 需要下载的图标文件:')
console.log()

icons.forEach((icon, index) => {
  const color = icon.status === 0 ? '#ff4d4f' : icon.status === 1 ? '#52c41a' : '#faad14'
  console.log(`${String(index + 1).padStart(2)}. ${icon.fileName.padEnd(20)} ${icon.vehicleIcon} ${icon.vehicleType.padEnd(6)} ${icon.statusText.padEnd(4)} ${color}`)
})

console.log()
console.log('💡 提示:')
console.log('   - 可以先下载几个图标进行测试')
console.log('   - 如果图标不存在，系统会使用默认图标')
console.log('   - 建议使用统一的设计风格')
console.log('   - 图标文件应该放在: public/icons/vehicles/') 