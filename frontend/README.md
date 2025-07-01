# RxGis 前端项目

基于 Vue 3 + Vite + Element Plus 的车辆监控系统前端

## 功能特性

- 🗺️ 高德地图集成，实时显示车辆位置
- 📱 响应式设计，支持移动端
- 🚗 车辆列表管理，支持多选
- ⚡ 3秒自动刷新车辆位置数据
- 🎨 现代化UI设计
- 📊 实时状态监控

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI组件库
- **Pinia** - Vue状态管理
- **Vue Router** - Vue官方路由
- **高德地图API** - 地图服务

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   │   ├── VehicleList.vue # 车辆列表组件
│   │   └── MapContainer.vue # 地图容器组件
│   │   
│   ├── views/              # 页面
│   │   └── Home.vue        # 主页
│   │   
│   ├── stores/             # 状态管理
│   │   └── vehicle.js      # 车辆状态
│   │   
│   ├── utils/              # 工具函数
│   │   └── mockData.js     # 模拟数据
│   │   
│   ├── router/             # 路由配置
│   │   
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
└── README.md               # 项目说明
```

## 主要功能

### 1. 车辆列表
- 显示所有车辆信息
- 支持多选车辆
- 可折叠/展开
- 实时显示车辆状态和位置信息

### 2. 地图显示
- 集成高德地图
- 实时显示选中车辆位置
- 支持地图缩放、平移
- 点击车辆标记查看详细信息

### 3. 实时数据更新
- 每3秒自动刷新车辆位置
- 使用模拟数据演示
- 支持真实API接入

## 配置说明

### 高德地图API

在 `src/components/MapContainer.vue` 中需要配置高德地图API密钥：

```javascript
script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=YOUR_AMAP_KEY'
```

请替换 `YOUR_AMAP_KEY` 为你的高德地图API密钥。

### 开发环境配置

项目已配置开发环境代理，API请求会自动转发到 `http://localhost:8000`。

## 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建新的 `.vue` 文件
2. 在需要使用的页面中导入并注册组件

### 状态管理

使用 Pinia 进行状态管理，车辆相关状态在 `src/stores/vehicle.js` 中定义。

### 样式规范

- 使用 Element Plus 组件库
- 自定义样式使用 scoped CSS
- 响应式设计支持移动端

## 部署

### Docker 部署

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

### 静态部署

构建完成后，将 `dist` 目录部署到任何静态文件服务器即可。

## 注意事项

1. 开发时需要配置高德地图API密钥
2. 生产环境需要配置正确的API地址
3. 建议使用HTTPS协议访问地图服务

## 许可证

MIT License 