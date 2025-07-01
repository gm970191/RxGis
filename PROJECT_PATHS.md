# RxGis 项目路径说明

## 项目根目录结构

```
RxGis/
├── docs/                    # 设计文档
├── frontend/               # Vue前端代码
├── backend/                # Python后端代码 (待开发)
├── jt808server/           # JT808服务器代码 (待开发)
├── tests/                  # 测试目录
└── README.md              # 项目说明
```

## 关键路径说明

### 前端相关路径
- **前端根目录**: `frontend/`
- **前端源码**: `frontend/src/`
- **前端组件**: `frontend/src/components/`
- **前端页面**: `frontend/src/views/`
- **前端状态管理**: `frontend/src/stores/`
- **前端工具函数**: `frontend/src/utils/`
- **前端测试**: `tests/frontend/`

### 测试相关路径
- **测试根目录**: `tests/`
- **前端测试**: `tests/frontend/`
- **后端测试**: `tests/backend/`
- **JT808服务器测试**: `tests/jt808server/`
- **终端模拟器测试**: `tests/terminal-simulator/`
- **系统测试**: `tests/system/`

### 前端测试子目录
- **单元测试**: `tests/frontend/unit/`
- **集成测试**: `tests/frontend/integration/`
- **端到端测试**: `tests/frontend/e2e/`
- **测试工具**: `tests/frontend/utils/`
- **功能测试页面**: `tests/frontend/unit/components/` (HTML测试页面)

### 组件测试路径
- **组件单元测试**: `tests/frontend/unit/components/`
- **功能测试页面**: `tests/frontend/unit/components/` (HTML测试页面)
- **状态管理测试**: `tests/frontend/unit/stores/`
- **工具函数测试**: `tests/frontend/unit/utils/`
- **页面测试**: `tests/frontend/unit/views/`

## 重要文件路径

### 前端核心文件
- **主入口**: `frontend/src/main.js`
- **App组件**: `frontend/src/App.vue`
- **路由配置**: `frontend/src/router/index.js`
- **状态管理**: `frontend/src/stores/`
- **车辆列表组件**: `frontend/src/components/VehicleList.vue`
- **地图容器组件**: `frontend/src/components/MapContainer.vue`

### 测试配置文件
- **前端测试配置**: `tests/frontend/vitest.config.js`
- **后端测试配置**: `tests/backend/pytest.ini`
- **JT808测试配置**: `tests/jt808server/pytest.ini`

### 测试数据文件
- **模拟数据**: `tests/frontend/utils/mockData.js`
- **测试辅助**: `tests/frontend/utils/testHelpers.js`
- **测试设置**: `tests/frontend/utils/setup.js`
- **功能测试页面**: `tests/frontend/unit/components/` (HTML测试页面)

## 开发环境路径

### 前端开发
- **开发服务器**: `http://localhost:3000`
- **构建输出**: `frontend/dist/`
- **依赖管理**: `frontend/package.json`

### 后端开发 (计划)
- **开发服务器**: `http://localhost:8000`
- **API文档**: `http://localhost:8000/docs`
- **依赖管理**: `backend/requirements.txt`

### JT808服务器 (计划)
- **服务器端口**: `localhost:7611`
- **依赖管理**: `jt808server/requirements.txt`

## 测试运行路径

### 前端测试运行
```bash
# 在项目根目录运行
cd frontend
npm run test:unit          # 单元测试
npm run test:integration   # 集成测试
npm run test:e2e          # 端到端测试
```

### 后端测试运行 (计划)
```bash
# 在项目根目录运行
cd tests/backend
pytest                    # 运行所有测试
pytest tests/unit/        # 单元测试
pytest tests/integration/ # 集成测试
```

## 注意事项

1. **前端开发**: 必须在 `frontend/` 目录下运行 npm 命令
2. **测试运行**: 前端测试在 `tests/frontend/` 目录下
3. **文件创建**: 新文件必须放在正确的目录结构中
4. **路径引用**: 使用相对路径时要注意当前工作目录

## 常用命令路径

```bash
# 前端开发
cd frontend
npm install
npm run dev

# 前端测试
cd tests/frontend
npm run test:unit

# 项目根目录操作
cd /d/Projects/RxGis
```

---

**重要提醒**: 创建新文件时，请严格按照此路径结构放置文件，避免路径错误。 