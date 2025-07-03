# 前端测试目录

本目录包含RxGis前端系统的所有测试代码和工具。

## 目录结构

```
tests/frontend/
├── README.md                    # 本说明文档
├── run-tests.bat                # 前端测试运行脚本
├── test.html                    # 前端测试页面
├── test-icons.html              # 车辆图标测试页面
├── test-icons-simple.html       # 简化版图标测试页面
├── vitest.config.js             # Vitest配置
├── unit/                        # 单元测试
│   ├── components/              # 组件测试
│   │   ├── MapContainer.test.js
│   │   └── VehicleList.test.js
│   └── stores/                  # 状态管理测试
│       └── vehicle.test.js
├── integration/                 # 集成测试
│   └── components/              # 组件集成测试
│       └── MapVehicleIntegration.test.js
├── e2e/                         # 端到端测试
│   └── scenarios/               # 测试场景
│       └── vehicle-monitoring.spec.js
├── scripts/                     # 测试脚本
│   ├── README.md                # 脚本说明文档
│   ├── test-project.js          # 项目完整性测试
│   ├── test-server.js           # 服务器测试
│   ├── test-homepage.js         # 首页测试
│   ├── test-vehicle-*.js        # 车辆相关测试
│   ├── test-*.bat               # 批处理测试脚本
│   └── test-simple.ps1          # PowerShell测试脚本
└── utils/                       # 测试工具
    ├── setup.js                 # 测试环境设置
    ├── mockData.js              # 模拟数据
    └── testHelpers.js           # 测试辅助函数
```

## 测试类型

### 1. HTML测试页面
- `test.html` - 前端项目基本功能测试
- `test-icons.html` - 车辆图标显示测试
- `test-icons-simple.html` - 简化版图标性能测试

### 2. 单元测试 (`unit/`)
- **组件测试**: 测试Vue组件的独立功能
- **状态管理测试**: 测试Pinia store的状态管理
- **工具函数测试**: 测试工具函数的正确性

### 3. 集成测试 (`integration/`)
- **组件集成测试**: 测试组件间的交互
- **API集成测试**: 测试与后端API的集成
- **状态集成测试**: 测试状态管理的集成

### 4. 端到端测试 (`e2e/`)
- **用户场景测试**: 测试完整的用户操作流程
- **页面测试**: 测试页面的完整功能
- **工作流测试**: 测试业务流程

### 5. 测试脚本 (`scripts/`)
- **功能验证脚本**: 验证特定功能的正确性
- **批处理脚本**: 自动化测试流程
- **PowerShell脚本**: Windows环境下的测试脚本

## 运行测试

### 使用测试套件
```bash
# 进入前端测试目录
cd tests/frontend

# 运行测试套件
run-tests.bat
```

### 单独运行测试
```bash
# 单元测试
cd frontend
npm run test:unit

# 集成测试
npm run test:integration

# 端到端测试
npm run test:e2e

# 脚本测试
cd tests/frontend/scripts
node test-vehicle-display.js
```

### HTML测试页面
```bash
# 在浏览器中打开测试页面
# tests/frontend/test.html
# tests/frontend/test-icons.html
# tests/frontend/test-icons-simple.html
```

## 测试配置

### Vitest配置
- 支持Vue组件测试
- 支持TypeScript
- 代码覆盖率报告
- 模拟高德地图API

### 测试环境
- jsdom环境
- 全局模拟设置
- Element Plus组件模拟

## 测试数据

### 模拟数据 (`utils/mockData.js`)
- 车辆数据
- 地图数据
- 用户数据

### 测试工具 (`utils/`)
- `setup.js`: 测试环境设置
- `mockData.js`: 模拟数据
- `testHelpers.js`: 测试辅助函数

## 测试覆盖

### 功能覆盖
- ✅ 地图显示功能
- ✅ 车辆列表功能
- ✅ 实时更新功能
- ✅ 交互功能
- ✅ 界面布局

### 性能覆盖
- ✅ 页面加载性能
- ✅ 地图渲染性能
- ✅ 数据更新性能
- ✅ 内存使用情况

### 兼容性覆盖
- ✅ 现代浏览器支持
- ✅ 响应式设计
- ✅ 移动端适配

## 持续集成

### 自动化测试
- 单元测试自动化
- 集成测试自动化
- 端到端测试自动化

### 测试报告
- 测试结果报告
- 代码覆盖率报告
- 性能测试报告

## 最佳实践

### 测试编写
1. **独立性**: 每个测试应该独立运行
2. **可重复性**: 测试结果应该一致
3. **快速性**: 测试应该快速执行
4. **可维护性**: 测试代码应该易于维护

### 测试数据管理
1. **模拟数据**: 使用专门的模拟数据文件
2. **测试环境**: 与开发环境分离
3. **数据清理**: 测试后清理测试数据

### 性能测试
1. **基准测试**: 建立性能基准
2. **监控指标**: 页面加载时间、渲染时间
3. **阈值设置**: 设置性能阈值

## 故障排除

### 常见问题
1. **测试环境问题**: 检查Node.js和npm版本
2. **依赖问题**: 确保所有依赖已正确安装
3. **网络问题**: 检查网络连接和API访问

### 调试方法
1. **查看测试日志**: 检查测试输出信息
2. **使用浏览器调试**: 在浏览器中调试HTML测试页面
3. **检查配置文件**: 验证测试配置是否正确

## 支持

如有测试相关问题，请参考：
1. `scripts/README.md` - 测试脚本详细说明
2. `vitest.config.js` - Vitest配置
3. `utils/setup.js` - 测试环境设置 