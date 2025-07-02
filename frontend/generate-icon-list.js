/**
 * 图标清单生成脚本
 * 运行: node generate-icon-list.js
 */

import { generateIconReport, getAllRequiredIcons } from './src/utils/iconUtils.js'
import fs from 'fs'
import path from 'path'

// 生成图标清单报告
const report = generateIconReport()

// 保存到文件
const reportPath = path.join(process.cwd(), 'ICON_REQUIREMENTS.md')
fs.writeFileSync(reportPath, report, 'utf8')

console.log('✅ 图标清单已生成: ICON_REQUIREMENTS.md')
console.log('\n📋 需要的图标文件:')

const icons = getAllRequiredIcons()
icons.forEach((icon, index) => {
  console.log(`${index + 1}. ${icon.fileName} (${icon.vehicleIcon} ${icon.vehicleType} - ${icon.statusText})`)
})

console.log(`\n📁 图标存放目录: public/icons/vehicles/`)
console.log(`📄 详细说明: public/icons/vehicles/README.md`) 