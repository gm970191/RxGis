/**
 * 创建占位符图标文件
 * 用于防止404错误，实际使用时请替换为真实图标
 */

import fs from 'fs'
import path from 'path'

// 图标目录
const iconDir = path.join(process.cwd(), 'public', 'icons', 'vehicles')

// 确保目录存在
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true })
}

// 需要的图标文件列表
const iconFiles = [
  'truck-online.png',
  'truck-parking.png', 
  'truck-offline.png',
  'bus-online.png',
  'bus-parking.png',
  'bus-offline.png',
  'car-online.png',
  'car-parking.png',
  'car-offline.png',
  'van-online.png',
  'van-parking.png',
  'van-offline.png',
  'box-online.png',
  'box-parking.png',
  'box-offline.png'
]

console.log('🚀 创建占位符图标文件...')

// 创建占位符文件
iconFiles.forEach(fileName => {
  const filePath = path.join(iconDir, fileName)
  
  // 创建一个简单的SVG内容作为占位符
  const svgContent = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
  <text x="16" y="20" text-anchor="middle" font-size="10" fill="#666">${fileName.replace('.png', '')}</text>
</svg>`
  
  // 将SVG内容写入文件（虽然文件名是.png，但内容可以是SVG）
  fs.writeFileSync(filePath, svgContent)
  console.log(`✅ 创建: ${fileName}`)
})

console.log('\n📝 注意:')
console.log('   - 这些是占位符文件，用于防止404错误')
console.log('   - 实际使用时请替换为真实的PNG图标文件')
console.log('   - 图标文件位置: public/icons/vehicles/')
console.log('   - 建议尺寸: 32x32px 或 48x48px') 