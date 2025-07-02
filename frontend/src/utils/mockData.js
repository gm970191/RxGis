// 车组数据
export const vehicleGroups = [
  {
    id: 'G001',
    name: '北京运输一队',
    company: '北京运输有限公司',
    description: '主要负责北京市内货运',
    vehicleCount: 25
  },
  {
    id: 'G002',
    name: '北京客运一队',
    company: '北京客运集团',
    description: '主要负责北京市内客运',
    vehicleCount: 20
  },
  {
    id: 'G003',
    name: '北京物流一队',
    company: '北京物流有限公司',
    description: '主要负责物流配送',
    vehicleCount: 30
  },
  {
    id: 'G004',
    name: '北京快递一队',
    company: '北京快递有限公司',
    description: '主要负责快递配送',
    vehicleCount: 15
  },
  {
    id: 'G005',
    name: '北京租赁一队',
    company: '北京汽车租赁有限公司',
    description: '主要负责汽车租赁',
    vehicleCount: 10
  }
]

// 模拟车辆数据 - 扩充到100辆，添加车组信息
export const mockVehicles = [
  {
    id: '001',
    vehicleNo: '京A12345',
    terminalId: 'T001',
    vehicleType: '货车',
    ownerName: '张三',
    contactPhone: '13800138001',
    groupId: 'G001',
    groupName: '北京运输一队',
    company: '北京运输有限公司',
    status: 1  // 1: 行驶中, 2: 停车, 0: 离线
  },
  {
    id: '002',
    vehicleNo: '京B67890',
    terminalId: 'T002',
    vehicleType: '客车',
    ownerName: '李四',
    contactPhone: '13800138002',
    groupId: 'G002',
    groupName: '北京客运一队',
    company: '北京客运集团',
    status: 2  // 停车
  },
  {
    id: '003',
    vehicleNo: '京C11111',
    terminalId: 'T003',
    vehicleType: '货车',
    ownerName: '王五',
    contactPhone: '13800138003',
    groupId: 'G001',
    groupName: '北京运输一队',
    company: '北京运输有限公司',
    status: 1  // 行驶中
  },
  {
    id: '004',
    vehicleNo: '京D22222',
    terminalId: 'T004',
    vehicleType: '客车',
    ownerName: '赵六',
    contactPhone: '13800138004',
    groupId: 'G002',
    groupName: '北京客运一队',
    company: '北京客运集团',
    status: 0  // 离线
  },
  {
    id: '005',
    vehicleNo: '京E33333',
    terminalId: 'T005',
    vehicleType: '货车',
    ownerName: '钱七',
    contactPhone: '13800138005',
    groupId: 'G003',
    groupName: '北京物流一队',
    company: '北京物流有限公司',
    status: 1  // 行驶中
  },
  {
    id: '006',
    vehicleNo: '京F44444',
    terminalId: 'T006',
    vehicleType: '货车',
    ownerName: '孙八',
    contactPhone: '13800138006',
    groupId: 'G003',
    groupName: '北京物流一队',
    company: '北京物流有限公司',
    status: 2  // 停车
  },
  {
    id: '007',
    vehicleNo: '京G55555',
    terminalId: 'T007',
    vehicleType: '客车',
    ownerName: '周九',
    contactPhone: '13800138007',
    groupId: 'G002',
    groupName: '北京客运一队',
    company: '北京客运集团',
    status: 1  // 行驶中
  },
  {
    id: '008',
    vehicleNo: '京H66666',
    terminalId: 'T008',
    vehicleType: '货车',
    ownerName: '吴十',
    contactPhone: '13800138008',
    groupId: 'G001',
    groupName: '北京运输一队',
    company: '北京运输有限公司',
    status: 0  // 离线
  }
]

// 生成额外的92辆车
const generateAdditionalVehicles = () => {
  const additionalVehicles = []
  const vehicleTypes = ['货车', '客车', '轿车', '面包车', '厢式车']
  const statuses = [0, 1, 2] // 离线、行驶中、停车
  const statusWeights = [0.1, 0.6, 0.3] // 状态分布权重
  
  // 车组分配权重
  const groupWeights = [
    { group: vehicleGroups[0], weight: 0.25 }, // 北京运输一队 25%
    { group: vehicleGroups[1], weight: 0.20 }, // 北京客运一队 20%
    { group: vehicleGroups[2], weight: 0.30 }, // 北京物流一队 30%
    { group: vehicleGroups[3], weight: 0.15 }, // 北京快递一队 15%
    { group: vehicleGroups[4], weight: 0.10 }  // 北京租赁一队 10%
  ]
  
  for (let i = 9; i <= 100; i++) {
    const id = i.toString().padStart(3, '0')
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
    
    // 根据权重随机选择状态
    const random = Math.random()
    let status
    if (random < statusWeights[0]) status = 0
    else if (random < statusWeights[0] + statusWeights[1]) status = 1
    else status = 2
    
    // 根据权重随机选择车组
    const groupRandom = Math.random()
    let selectedGroup = groupWeights[0].group
    let cumulativeWeight = 0
    for (const groupWeight of groupWeights) {
      cumulativeWeight += groupWeight.weight
      if (groupRandom <= cumulativeWeight) {
        selectedGroup = groupWeight.group
        break
      }
    }
    
    // 生成车牌号
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const letter = letters[Math.floor(Math.random() * letters.length)]
    const numbers = Math.floor(Math.random() * 90000) + 10000
    const vehicleNo = `京${letter}${numbers}`
    
    additionalVehicles.push({
      id,
      vehicleNo,
      terminalId: `T${id}`,
      vehicleType,
      ownerName: `车主${i}`,
      contactPhone: `13800138${id}`,
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      company: selectedGroup.company,
      status
    })
  }
  
  return additionalVehicles
}

// 合并所有车辆数据
export const allMockVehicles = [...mockVehicles, ...generateAdditionalVehicles()]

// 北京周边坐标范围 - 扩大范围以容纳更多车辆
const BEIJING_BOUNDS = {
  minLat: 39.2,
  maxLat: 40.4,
  minLng: 115.4,
  maxLng: 117.6
}

// 生成随机坐标
export function generateRandomPosition() {
  const lat = BEIJING_BOUNDS.minLat + Math.random() * (BEIJING_BOUNDS.maxLat - BEIJING_BOUNDS.minLat)
  const lng = BEIJING_BOUNDS.minLng + Math.random() * (BEIJING_BOUNDS.maxLng - BEIJING_BOUNDS.minLng)
  return { lat, lng }
}

// 生成车辆位置数据 - 优化性能
export function generateVehiclePositions() {
  const positions = {}
  
  // 存储上次的位置，用于停车和离线车辆
  if (!window.lastVehiclePositions) {
    window.lastVehiclePositions = {}
  }
  
  // 使用allMockVehicles而不是mockVehicles
  allMockVehicles.forEach(vehicle => {
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

// 模拟API调用 - 优化延迟
export function mockApiCall(delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateVehiclePositions())
    }, delay)
  })
}

// 获取车辆统计信息
export function getVehicleStats() {
  const stats = {
    total: allMockVehicles.length,
    online: allMockVehicles.filter(v => v.status === 1).length,
    parking: allMockVehicles.filter(v => v.status === 2).length,
    offline: allMockVehicles.filter(v => v.status === 0).length
  }
  
  return stats
} 