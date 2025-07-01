# WEB服务前台设计文档

## 1. 系统概述

WEB服务前台是基于Vue.js开发的单页面应用(SPA)，主要提供车辆监控、系统管理、报表查询等功能。系统采用响应式设计，支持多终端访问。

## 2. 技术架构

### 2.1 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.x | 前端框架 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Element Plus | 2.x | UI组件库 |
| Axios | 1.x | HTTP客户端 |
| ECharts | 5.x | 图表组件 |
| 高德地图API | 最新版 | 地图服务 |
| WebSocket | - | 实时通信 |

### 2.2 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   ├── common/        # 通用组件
│   │   ├── map/           # 地图相关组件
│   │   └── charts/        # 图表组件
│   ├── views/             # 页面组件
│   │   ├── dashboard/     # 仪表板
│   │   ├── map/           # 地图页面
│   │   ├── vehicle/       # 车辆管理
│   │   ├── terminal/      # 终端管理
│   │   ├── report/        # 报表页面
│   │   └── system/        # 系统管理
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── api/               # API接口
│   ├── utils/             # 工具函数
│   ├── styles/            # 样式文件
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json
└── vite.config.js         # 构建配置
```

## 3. 核心模块设计

### 3.1 基于地图的位置显示模块

#### 3.1.1 功能概述
- 实时显示车辆位置
- 历史轨迹回放
- 车辆状态监控
- 地理围栏管理

#### 3.1.2 组件设计

**MapContainer.vue** - 地图容器组件
```vue
<template>
  <div class="map-container">
    <div id="map" class="map-content"></div>
    <MapToolbar @tool-click="handleToolClick" />
    <VehicleList :vehicles="vehicles" @vehicle-select="handleVehicleSelect" />
    <TrackPlayer v-if="showTrackPlayer" :vehicle="selectedVehicle" />
  </div>
</template>
```

**VehicleMarker.vue** - 车辆标记组件
```vue
<template>
  <div class="vehicle-marker" :class="statusClass">
    <div class="marker-icon"></div>
    <div class="vehicle-info">
      <div class="vehicle-no">{{ vehicle.vehicleNo }}</div>
      <div class="vehicle-speed">{{ vehicle.speed }}km/h</div>
    </div>
  </div>
</template>
```

#### 3.1.3 实时位置更新机制

**WebSocket连接管理**
```javascript
// stores/websocket.js
export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    connected: false,
    vehicleUpdates: [],
    connection: null
  }),
  
  actions: {
    connect() {
      this.connection = new WebSocket(WS_URL);
      this.connection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleVehicleUpdate(data);
      };
    },
    
    handleVehicleUpdate(data) {
      // 更新车辆位置信息
      this.vehicleUpdates.push(data);
      // 通知地图组件更新
    }
  }
});
```

#### 3.1.4 历史轨迹回放

**TrackPlayer.vue** - 轨迹回放组件
```vue
<template>
  <div class="track-player">
    <div class="player-controls">
      <el-button @click="play">播放</el-button>
      <el-button @click="pause">暂停</el-button>
      <el-slider v-model="progress" @change="seekTo" />
      <span>{{ currentTime }}</span>
    </div>
    <div class="track-info">
      <div>开始时间: {{ trackInfo.startTime }}</div>
      <div>结束时间: {{ trackInfo.endTime }}</div>
      <div>总距离: {{ trackInfo.totalDistance }}km</div>
    </div>
  </div>
</template>
```

### 3.2 系统配置管理模块

#### 3.2.1 功能概述
- 用户管理
- 车辆管理
- 终端设备管理
- 系统参数配置
- 权限管理

#### 3.2.2 用户管理

**UserManagement.vue**
```vue
<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="addUser">新增用户</el-button>
        </div>
      </template>
      
      <el-table :data="users" v-loading="loading">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="editUser(row)">编辑</el-button>
            <el-button @click="deleteUser(row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
```

#### 3.2.3 车辆管理

**VehicleManagement.vue**
```vue
<template>
  <div class="vehicle-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车辆管理</span>
          <el-button type="primary" @click="addVehicle">新增车辆</el-button>
        </div>
      </template>
      
      <el-table :data="vehicles" v-loading="loading">
        <el-table-column prop="vehicleNo" label="车牌号" />
        <el-table-column prop="terminalId" label="终端ID" />
        <el-table-column prop="vehicleType" label="车辆类型" />
        <el-table-column prop="ownerName" label="车主" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="viewLocation(row)">查看位置</el-button>
            <el-button @click="viewTrack(row)">查看轨迹</el-button>
            <el-button @click="editVehicle(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
```

### 3.3 报表与日志模块

#### 3.3.1 功能概述
- 车辆行驶记录查询
- 告警记录查询
- 车辆行驶统计
- 车载终端消息统计

#### 3.3.2 报表组件设计

**ReportDashboard.vue** - 报表仪表板
```vue
<template>
  <div class="report-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalVehicles }}</div>
            <div class="stat-label">总车辆数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-number">{{ stats.onlineVehicles }}</div>
            <div class="stat-label">在线车辆</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-number">{{ stats.todayAlarms }}</div>
            <div class="stat-label">今日告警</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalDistance }}</div>
            <div class="stat-label">总里程(km)</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>车辆状态分布</template>
          <div id="vehicleStatusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>告警趋势</template>
          <div id="alarmTrendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
```

#### 3.3.3 日志查询组件

**LogQuery.vue** - 日志查询
```vue
<template>
  <div class="log-query">
    <el-card>
      <template #header>
        <span>日志查询</span>
      </template>
      
      <el-form :model="queryForm" inline>
        <el-form-item label="日志类型">
          <el-select v-model="queryForm.logType">
            <el-option label="系统日志" value="system" />
            <el-option label="告警日志" value="alarm" />
            <el-option label="消息日志" value="message" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="车辆">
          <el-select v-model="queryForm.vehicleId" filterable>
            <el-option
              v-for="vehicle in vehicles"
              :key="vehicle.id"
              :label="vehicle.vehicleNo"
              :value="vehicle.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryLogs">查询</el-button>
          <el-button @click="exportLogs">导出</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="logs" v-loading="loading">
        <el-table-column prop="timestamp" label="时间" />
        <el-table-column prop="vehicleNo" label="车牌号" />
        <el-table-column prop="logType" label="日志类型" />
        <el-table-column prop="message" label="日志内容" />
        <el-table-column prop="level" label="级别" />
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>
```

## 4. 状态管理设计

### 4.1 Pinia Store结构

**stores/index.js** - 主状态管理
```javascript
import { createPinia } from 'pinia';

export const pinia = createPinia();

// 注册所有store
import { useUserStore } from './user';
import { useVehicleStore } from './vehicle';
import { useMapStore } from './map';
import { useWebSocketStore } from './websocket';
```

**stores/user.js** - 用户状态
```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    permissions: [],
    token: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission);
    }
  },
  
  actions: {
    async login(credentials) {
      // 登录逻辑
    },
    
    async logout() {
      // 登出逻辑
    },
    
    async getUserInfo() {
      // 获取用户信息
    }
  }
});
```

**stores/vehicle.js** - 车辆状态
```javascript
export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [],
    selectedVehicle: null,
    vehicleStatus: {}
  }),
  
  getters: {
    onlineVehicles: (state) => {
      return state.vehicles.filter(v => v.status === 'online');
    }
  },
  
  actions: {
    async fetchVehicles() {
      // 获取车辆列表
    },
    
    updateVehicleLocation(vehicleId, location) {
      // 更新车辆位置
    }
  }
});
```

## 5. API接口设计

### 5.1 API模块组织

**api/index.js** - API统一导出
```javascript
export * from './auth';
export * from './vehicle';
export * from './terminal';
export * from './report';
export * from './system';
```

**api/vehicle.js** - 车辆相关API
```javascript
import request from '@/utils/request';

export const vehicleApi = {
  // 获取车辆列表
  getVehicles(params) {
    return request.get('/api/vehicles', { params });
  },
  
  // 获取车辆详情
  getVehicle(id) {
    return request.get(`/api/vehicles/${id}`);
  },
  
  // 获取车辆实时位置
  getVehicleLocation(id) {
    return request.get(`/api/vehicles/${id}/location`);
  },
  
  // 获取车辆历史轨迹
  getVehicleTrack(id, params) {
    return request.get(`/api/vehicles/${id}/track`, { params });
  },
  
  // 发送控制命令
  sendCommand(id, command) {
    return request.post(`/api/vehicles/${id}/command`, command);
  }
};
```

## 6. 路由设计

### 6.1 路由配置

**router/index.js**
```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue')
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/map/Index.vue')
      },
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('@/views/vehicle/Index.vue')
      },
      {
        path: 'terminals',
        name: 'Terminals',
        component: () => import('@/views/terminal/Index.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/report/Index.vue')
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/Index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

## 7. 性能优化

### 7.1 代码分割
- 路由级别的代码分割
- 组件懒加载
- 第三方库按需引入

### 7.2 缓存策略
- 车辆列表缓存
- 地图瓦片缓存
- API响应缓存

### 7.3 虚拟滚动
- 大量数据列表使用虚拟滚动
- 历史轨迹点优化显示

## 8. 安全设计

### 8.1 认证授权
- JWT Token认证
- 路由权限控制
- API权限验证

### 8.2 数据安全
- 敏感数据加密
- XSS防护
- CSRF防护

## 9. 测试策略

### 9.1 单元测试
- 组件测试
- Store测试
- 工具函数测试

### 9.2 集成测试
- API接口测试
- 路由测试
- 状态管理测试

### 9.3 E2E测试
- 用户登录流程
- 车辆监控流程
- 报表查询流程

## 10. 部署配置

### 10.1 构建配置
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          map: ['@amap/amap-jsapi-loader'],
          charts: ['echarts']
        }
      }
    }
  }
});
```

### 10.2 环境配置
```javascript
// .env.production
VITE_API_BASE_URL=https://api.rxgis.com
VITE_WS_URL=wss://api.rxgis.com/ws
VITE_MAP_KEY=your_amap_key
``` 