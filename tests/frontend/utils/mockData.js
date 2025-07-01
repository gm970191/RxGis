// 测试用车辆数据
export const testVehicles = [
  {
    id: '001',
    vehicleNo: '京A12345',
    terminalId: 'T001',
    vehicleType: '货车',
    ownerName: '张三',
    contactPhone: '13800138001',
    status: 1  // 行驶中
  },
  {
    id: '002',
    vehicleNo: '京B67890',
    terminalId: 'T002',
    vehicleType: '客车',
    ownerName: '李四',
    contactPhone: '13800138002',
    status: 2  // 停车
  },
  {
    id: '003',
    vehicleNo: '京C11111',
    terminalId: 'T003',
    vehicleType: '货车',
    ownerName: '王五',
    contactPhone: '13800138003',
    status: 0  // 离线
  }
]

// 测试用位置数据
export const testPositions = {
  '001': {
    lat: 39.90923,
    lng: 116.397428,
    altitude: 100,
    speed: 60,
    direction: 90,
    locationTime: new Date().toISOString()
  },
  '002': {
    lat: 39.91523,
    lng: 116.403428,
    altitude: 95,
    speed: 0,  // 停车状态速度为0
    direction: 180,
    locationTime: new Date().toISOString()
  },
  '003': {
    lat: 39.90523,
    lng: 116.393428,
    altitude: 105,
    speed: 0,  // 离线状态速度为0
    direction: 270,
    locationTime: new Date().toISOString()
  }
}

// 模拟API调用
export const mockApiCall = (delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(testPositions)
    }, delay)
  })
}

// 生成测试位置数据
export const generateTestPositions = () => {
  const positions = {}
  testVehicles.forEach(vehicle => {
    if (vehicle.status === 0 || vehicle.status === 2) {
      // 停车或离线车辆，位置不变，速度为0
      positions[vehicle.id] = {
        ...testPositions[vehicle.id],
        speed: 0,
        locationTime: new Date().toISOString()
      }
    } else {
      // 行驶车辆，位置变化，速度随机
      const basePosition = testPositions[vehicle.id]
      const offsetLat = (Math.random() - 0.5) * 0.01
      const offsetLng = (Math.random() - 0.5) * 0.01
      
      positions[vehicle.id] = {
        lat: basePosition.lat + offsetLat,
        lng: basePosition.lng + offsetLng,
        altitude: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 80) + 10,
        direction: Math.floor(Math.random() * 360),
        locationTime: new Date().toISOString()
      }
    }
  })
  return positions
}

// 测试用告警数据
export const testAlarms = {
  '001': '超速告警',
  '003': '疲劳驾驶'
}

// 测试用状态文本
export const getStatusText = (status) => {
  switch (status) {
    case 1: return '在线'
    case 2: return '停车'
    case 0: return '离线'
    default: return '未知状态'
  }
}

// 测试用状态类型
export const getStatusType = (status) => {
  switch (status) {
    case 1: return 'success'
    case 2: return 'warning'
    case 0: return 'danger'
    default: return 'info'
  }
}

// 测试用的模拟车辆数据
export const mockVehicles = [
  {
    id: '001',
    vehicleNo: '京A12345',
    terminalId: 'T001',
    vehicleType: '货车',
    ownerName: '张三',
    contactPhone: '13800138001',
    status: 1
  },
  {
    id: '002',
    vehicleNo: '京B67890',
    terminalId: 'T002',
    vehicleType: '客车',
    ownerName: '李四',
    contactPhone: '13800138002',
    status: 1
  },
  {
    id: '003',
    vehicleNo: '京C11111',
    terminalId: 'T003',
    vehicleType: '货车',
    ownerName: '王五',
    contactPhone: '13800138003',
    status: 0
  }
]

// 测试用的车辆位置数据
export const mockVehiclePositions = {
  '001': {
    lat: 39.9042,
    lng: 116.4074,
    altitude: 50,
    speed: 60,
    direction: 90,
    locationTime: '2024-01-01T12:00:00.000Z'
  },
  '002': {
    lat: 39.9142,
    lng: 116.4174,
    altitude: 45,
    speed: 45,
    direction: 180,
    locationTime: '2024-01-01T12:00:00.000Z'
  },
  '003': {
    lat: 39.8942,
    lng: 116.3974,
    altitude: 55,
    speed: 0,
    direction: 0,
    locationTime: '2024-01-01T12:00:00.000Z'
  }
}

// 生成随机位置数据
export function generateRandomPosition() {
  return {
    lat: 39.4 + Math.random() * 0.5,
    lng: 116.4 + Math.random() * 0.5,
    altitude: Math.floor(Math.random() * 100) + 50,
    speed: Math.floor(Math.random() * 80) + 10,
    direction: Math.floor(Math.random() * 360),
    locationTime: new Date().toISOString()
  }
}

// 模拟API响应
export const mockApiResponses = {
  vehicles: {
    success: {
      code: 200,
      message: 'success',
      data: mockVehicles
    },
    error: {
      code: 500,
      message: 'Internal Server Error',
      data: null
    }
  },
  positions: {
    success: {
      code: 200,
      message: 'success',
      data: mockVehiclePositions
    },
    error: {
      code: 500,
      message: 'Internal Server Error',
      data: null
    }
  }
}

// 模拟用户数据
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    role: 'admin',
    email: 'admin@rxgis.com'
  },
  {
    id: 2,
    username: 'user1',
    name: '用户1',
    role: 'user',
    email: 'user1@rxgis.com'
  }
]

// 模拟系统配置
export const mockSystemConfig = {
  mapCenter: [116.397428, 39.90923],
  defaultZoom: 11,
  refreshInterval: 3000,
  maxVehicles: 1000
} 