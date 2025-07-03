# RxGis 快速开始指南

## 🚀 立即开始

### 1. 运行轻量化清理脚本
```bash
# Windows
cleanup-for-lightweight.bat

# 或手动执行
cd tests/frontend
del /q test-*.html debug-*.html simple-*.html
cd ../../frontend
npm cache clean --force
npm prune
```

### 2. 启动开发服务器
```bash
cd frontend
npm run dev
```

### 3. 访问应用
打开浏览器访问: http://localhost:8665

## 📋 当前功能

### ✅ 已完成功能
- **地图显示**: 高德地图集成
- **车辆列表**: 可拖拽、可调整大小
- **车辆定位**: 点击车辆自动定位到地图中心
- **车辆选择**: 复选框选择功能
- **实时信息**: 车辆状态和位置信息显示
- **错误处理**: 完善的错误处理机制

### 🎯 核心组件
- `MapContainer.vue`: 地图容器组件
- `VehicleList.vue`: 车辆列表组件
- `Home.vue`: 主页面组件
- `vehicle.js`: 车辆状态管理

## 🛠️ 开发命令

### 基础命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 轻量化命令
```bash
npm run clean        # 清理项目文件
npm run fresh        # 重新安装依赖
npm run lightweight  # 轻量化启动
```

### 测试命令
```bash
npm run test         # 运行所有测试
npm run test:unit    # 运行单元测试
npm run test:run     # 运行测试并退出
```

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/          # 核心组件
│   │   ├── MapContainer.vue # 地图容器
│   │   └── VehicleList.vue  # 车辆列表
│   ├── views/
│   │   └── Home.vue         # 主页面
│   ├── stores/
│   │   └── vehicle.js       # 车辆状态管理
│   ├── utils/
│   │   └── mockData.js      # 模拟数据
│   └── styles/              # 样式文件
├── public/                  # 静态资源
└── package.json
```

## 🔧 配置说明

### 地图配置
- **API Key**: 高德地图API密钥
- **版本**: 1.4.15 (稳定版本)
- **功能**: 基础地图、标记、定位

### 开发配置
- **端口**: 8665
- **热重载**: 已启用
- **错误处理**: 已配置

## 📊 性能优化

### 已实现的优化
- ✅ 坐标验证机制
- ✅ 地图对象状态检查
- ✅ 错误边界处理
- ✅ 组件懒加载
- ✅ CSS模块化

### 建议的优化
- 🔄 地图标记聚合
- 🔄 虚拟滚动列表
- 🔄 图片懒加载
- 🔄 代码分割

## 🐛 常见问题

### Q: 地图不显示？
A: 检查网络连接和高德地图API密钥

### Q: 车辆列表无法拖拽？
A: 确保浏览器支持拖拽API

### Q: 点击车辆地图不定位？
A: 检查控制台是否有坐标错误

### Q: 应用运行缓慢？
A: 运行轻量化清理脚本

## 📈 下一步开发

### 短期目标（1周）
- [ ] 添加车辆轨迹回放
- [ ] 实现实时数据更新
- [ ] 优化地图性能

### 中期目标（1个月）
- [ ] 添加报警功能
- [ ] 实现数据统计
- [ ] 完善用户界面

### 长期目标（3个月）
- [ ] 添加用户权限管理
- [ ] 实现多地图支持
- [ ] 优化系统架构

## 💡 开发技巧

### 1. 调试技巧
```javascript
// 在组件中添加调试日志
console.log('组件状态:', this.$data)

// 使用Vue DevTools
// 安装Vue DevTools浏览器扩展
```

### 2. 性能监控
```javascript
// 监控组件渲染时间
const startTime = performance.now()
// ... 组件渲染
console.log('渲染时间:', performance.now() - startTime)
```

### 3. 错误处理
```javascript
// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  // 发送错误报告
}
```

## 📞 技术支持

### 文档资源
- [Vue 3 官方文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [高德地图API文档](https://lbs.amap.com/)

### 项目资源
- `LIGHTWEIGHT_START_GUIDE.md`: 轻量化开始指南
- `MAP_ERROR_FIX_REPORT.md`: 地图错误修复报告
- `PROJECT_PATHS.md`: 项目路径说明

### 联系方式
- 查看Git提交历史了解开发过程
- 参考V0.1版本代码
- 查看测试报告了解功能验证

---

**开始开发吧！** 🚀 