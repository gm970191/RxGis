# RxGis 车辆监控系统

基于 JT808 协议的车辆监控管理系统，支持大规模并发连接和实时位置追踪。

## 项目概述

RxGis 是一个完整的车辆监控解决方案，包含以下核心组件：

- **WEB服务前台**：基于 Vue 3 的现代化用户界面
- **JT808Server**：支持3万并发的 TCP 服务器
- **WEB服务后台**：提供 RESTful API 服务

## 系统架构

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   WEB前台       │ ◄──────────────────► │   WEB后台       │
│   (Vue.js)      │                      │   (Python)      │
└─────────────────┘                      └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│   地图服务       │                      │   数据库集群     │
│   (高德/百度)    │                      │   (MySQL)       │
└─────────────────┘                      └─────────────────┘
                                                │
                                                ▼
┌─────────────────┐    JT808协议        ┌─────────────────┐
│   JT808Server   │ ◄──────────────────► │   车载终端      │
│   (Python)      │                      │   (3万并发)     │
└─────────────────┘                      └─────────────────┘
```

## 快速开始

### 前端开发

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp env.example .env
# 编辑 .env 文件，配置高德地图API密钥
```

4. 启动开发服务器：
```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动

### 后端开发

后端开发文档请参考：
- [WEB后台设计](./docs/WEB后台设计.md)
- [JT808Server设计](./docs/JT808Server设计.md)

## 项目结构

```
RxGis/
├── docs/                    # 设计文档
│   ├── 总体设计.md         # 系统总体设计
│   ├── WEB前台设计.md      # 前端设计文档
│   ├── WEB后台设计.md      # 后端设计文档
│   └── JT808Server设计.md  # JT808服务器设计
├── frontend/               # Vue前端代码
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── views/          # 页面
│   │   ├── stores/         # 状态管理
│   │   └── utils/          # 工具函数
│   ├── package.json        # 前端依赖
│   └── README.md           # 前端说明
├── backend/                # Python后端代码 (待开发)
├── jt808server/           # JT808服务器代码 (待开发)
└── README.md              # 项目说明
```

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI组件库
- **Pinia** - Vue状态管理
- **高德地图API** - 地图服务

### 后端 (计划)
- **FastAPI** - 高性能异步框架
- **asyncio** - 异步TCP服务器
- **MySQL** - 数据库
- **Redis** - 缓存和消息队列

## 主要功能

### 已实现功能
- ✅ 车辆列表管理
- ✅ 地图实时显示
- ✅ 多车辆选择
- ✅ 3秒自动刷新
- ✅ 响应式设计

### 计划功能
- 🔄 实时位置追踪
- 🔄 历史轨迹回放
- 🔄 告警管理
- 🔄 报表统计
- 🔄 用户权限管理

## 开发规范

### Git 提交规范
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 Vue 3 组合式API最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 部署

### 开发环境
```bash
# 前端
cd frontend && npm run dev

# 后端 (待开发)
cd backend && python main.py
```

### 生产环境
```bash
# 前端构建
cd frontend && npm run build

# 后端部署 (待开发)
# 使用 Docker 或直接部署
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。 