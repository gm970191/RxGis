// 模拟车辆数据
export const mockVehicles = [
  {
    id: '001',
    vehicleNo: '京A12345',
    terminalId: 'T001',
    vehicleType: '货车',
    ownerName: '张三',
    contactPhone: '13800138001',
    status: 1  // 1: 行驶中, 2: 停车, 0: 离线
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
    status: 1  // 行驶中
  },
  {
    id: '004',
    vehicleNo: '京D22222',
    terminalId: 'T004',
    vehicleType: '客车',
    ownerName: '赵六',
    contactPhone: '13800138004',
    status: 0  // 离线
  },
  {
    id: '005',
    vehicleNo: '京E33333',
    terminalId: 'T005',
    vehicleType: '货车',
    ownerName: '钱七',
    contactPhone: '13800138005',
    status: 1  // 行驶中
  },
  {
    id: '006',
    vehicleNo: '京F44444',
    terminalId: 'T006',
    vehicleType: '货车',
    ownerName: '孙八',
    contactPhone: '13800138006',
    status: 2  // 停车
  },
  {
    id: '007',
    vehicleNo: '京G55555',
    terminalId: 'T007',
    vehicleType: '客车',
    ownerName: '周九',
    contactPhone: '13800138007',
    status: 1  // 行驶中
  },
  {
    id: '008',
    vehicleNo: '京H66666',
    terminalId: 'T008',
    vehicleType: '货车',
    ownerName: '吴十',
    contactPhone: '13800138008',
    status: 0  // 离线
  }
]

// 北京周边坐标范围
const BEIJING_BOUNDS = {
  minLat: 39.4,
  maxLat: 40.2,
  minLng: 115.7,
  maxLng: 117.4
}

// 生成随机坐标
export function generateRandomPosition() {
  const lat = BEIJING_BOUNDS.minLat + Math.random() * (BEIJING_BOUNDS.maxLat - BEIJING_BOUNDS.minLat)
  const lng = BEIJING_BOUNDS.minLng + Math.random() * (BEIJING_BOUNDS.maxLng - BEIJING_BOUNDS.minLng)
  return { lat, lng }
}

// 生成车辆位置数据
export function generateVehiclePositions() {
  const positions = {}
  
  // 存储上次的位置，用于停车和离线车辆
  if (!window.lastVehiclePositions) {
    window.lastVehiclePositions = {}
  }
  
  mockVehicles.forEach(vehicle => {
    let position
    
    if (vehicle.status === 0 || vehicle.status === 2) {
      // 离线或停车车辆，位置不变，速度为0
      if (window.lastVehiclePositions[vehicle.id]) {
        position = { ...window.lastVehiclePositions[vehicle.id] }
        position.speed = 0 // 强制速度为0
        position.locationTime = new Date().toISOString()
      } else {
        // 第一次生成位置
        const basePosition = generateRandomPosition()
        position = {
          lat: basePosition.lat,
          lng: basePosition.lng,
          altitude: Math.floor(Math.random() * 100) + 50,
          speed: 0, // 停车或离线车辆速度为0
          direction: Math.floor(Math.random() * 360),
          locationTime: new Date().toISOString()
        }
      }
    } else {
      // 行驶中的车辆，位置会变化
      const basePosition = generateRandomPosition()
      // 添加一些随机偏移，模拟车辆移动
      const offsetLat = (Math.random() - 0.5) * 0.01
      const offsetLng = (Math.random() - 0.5) * 0.01
      
      position = {
        lat: basePosition.lat + offsetLat,
        lng: basePosition.lng + offsetLng,
        altitude: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 80) + 10,
        direction: Math.floor(Math.random() * 360),
        locationTime: new Date().toISOString()
      }
    }
    
    // 保存当前位置
    window.lastVehiclePositions[vehicle.id] = { ...position }
    positions[vehicle.id] = position
  })
  
  return positions
}

// 模拟API调用
export function mockApiCall(delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateVehiclePositions())
    }, delay)
  })
} 