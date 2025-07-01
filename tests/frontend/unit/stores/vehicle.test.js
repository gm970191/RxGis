import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVehicleStore } from '../../../../frontend/src/stores/vehicle'

describe('Vehicle Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useVehicleStore()
  })

  it('should initialize with empty state', () => {
    expect(store.getAllVehicles).toEqual([])
    expect(store.getSelectedVehicles).toEqual([])
    expect(store.getVehiclePositions).toEqual({})
  })

  it('should add vehicles', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      terminalId: 'T001',
      vehicleType: '货车',
      ownerName: '张三',
      contactPhone: '13800138001',
      status: 1
    }

    store.addVehicle(vehicle)
    expect(store.getAllVehicles).toContain(vehicle)
  })

  it('should select vehicle', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      status: 1
    }

    store.addVehicle(vehicle)
    store.selectVehicle('001')
    expect(store.getSelectedVehicles).toContain('001')
  })

  it('should deselect vehicle', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      status: 1
    }

    store.addVehicle(vehicle)
    store.selectVehicle('001')
    store.deselectVehicle('001')
    expect(store.getSelectedVehicles).not.toContain('001')
  })

  it('should select all vehicles', () => {
    const vehicles = [
      { id: '001', vehicleNo: '京A12345', status: 1 },
      { id: '002', vehicleNo: '京B67890', status: 2 },
      { id: '003', vehicleNo: '京C11111', status: 0 }
    ]

    vehicles.forEach(vehicle => store.addVehicle(vehicle))
    store.selectAllVehicles()
    expect(store.getSelectedVehicles).toHaveLength(3)
    expect(store.getSelectedVehicles).toContain('001')
    expect(store.getSelectedVehicles).toContain('002')
    expect(store.getSelectedVehicles).toContain('003')
  })

  it('should clear all selections', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      status: 1
    }

    store.addVehicle(vehicle)
    store.selectVehicle('001')
    store.clearSelection()
    expect(store.getSelectedVehicles).toHaveLength(0)
  })

  it('should update vehicle position', () => {
    const position = {
      lat: 39.90923,
      lng: 116.397428,
      speed: 60,
      direction: 90,
      altitude: 100,
      locationTime: new Date().toISOString()
    }

    store.updateVehiclePosition('001', position)
    expect(store.getVehiclePositions['001']).toEqual(position)
  })

  it('should get vehicle by id', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      status: 1
    }

    store.addVehicle(vehicle)
    const foundVehicle = store.getVehicleById('001')
    expect(foundVehicle).toEqual(vehicle)
  })

  it('should return null for non-existent vehicle', () => {
    const foundVehicle = store.getVehicleById('999')
    expect(foundVehicle).toBeNull()
  })

  it('should toggle vehicle selection', () => {
    const vehicle = {
      id: '001',
      vehicleNo: '京A12345',
      status: 1
    }

    store.addVehicle(vehicle)
    
    // 第一次点击选中
    store.toggleVehicleSelection('001')
    expect(store.getSelectedVehicles).toContain('001')
    
    // 第二次点击取消选中
    store.toggleVehicleSelection('001')
    expect(store.getSelectedVehicles).not.toContain('001')
  })
}) 