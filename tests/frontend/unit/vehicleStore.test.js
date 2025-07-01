import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVehicleStore } from '@/stores/vehicle'
import { mockVehicles, mockVehiclePositions } from '../utils/mockData.js'

describe('Vehicle Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useVehicleStore()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(store.vehicles).toEqual([])
      expect(store.selectedVehicles).toEqual([])
      expect(store.vehiclePositions).toEqual({})
      expect(store.isLoading).toBe(false)
    })
  })

  describe('setVehicles', () => {
    it('应该设置车辆列表', () => {
      store.setVehicles(mockVehicles)
      expect(store.vehicles).toEqual(mockVehicles)
    })
  })

  describe('addVehicle', () => {
    it('应该添加车辆到列表', () => {
      const newVehicle = {
        id: '004',
        vehicleNo: '京F44444',
        terminalId: 'T004',
        vehicleType: '货车',
        ownerName: '赵六',
        contactPhone: '13800138004',
        status: 1
      }
      
      store.addVehicle(newVehicle)
      expect(store.vehicles).toContain(newVehicle)
    })
  })

  describe('updateVehiclePosition', () => {
    it('应该更新车辆位置', () => {
      const vehicleId = '001'
      const position = {
        lat: 39.9042,
        lng: 116.4074,
        altitude: 50,
        speed: 60,
        direction: 90
      }
      
      store.updateVehiclePosition(vehicleId, position)
      expect(store.vehiclePositions[vehicleId]).toEqual({
        ...position,
        timestamp: expect.any(String)
      })
    })

    it('应该保留现有位置数据并更新', () => {
      const vehicleId = '001'
      const initialPosition = { lat: 39.9042, lng: 116.4074 }
      const updatedPosition = { speed: 60, direction: 90 }
      
      store.updateVehiclePosition(vehicleId, initialPosition)
      store.updateVehiclePosition(vehicleId, updatedPosition)
      
      expect(store.vehiclePositions[vehicleId]).toEqual({
        ...initialPosition,
        ...updatedPosition,
        timestamp: expect.any(String)
      })
    })
  })

  describe('selectVehicle', () => {
    it('应该选择车辆', () => {
      store.selectVehicle('001')
      expect(store.selectedVehicles).toContain('001')
    })

    it('不应该重复选择同一车辆', () => {
      store.selectVehicle('001')
      store.selectVehicle('001')
      expect(store.selectedVehicles.filter(id => id === '001')).toHaveLength(1)
    })
  })

  describe('deselectVehicle', () => {
    it('应该取消选择车辆', () => {
      store.selectVehicle('001')
      store.selectVehicle('002')
      store.deselectVehicle('001')
      
      expect(store.selectedVehicles).not.toContain('001')
      expect(store.selectedVehicles).toContain('002')
    })
  })

  describe('toggleVehicleSelection', () => {
    it('应该切换车辆选择状态', () => {
      // 初始状态：未选择
      store.toggleVehicleSelection('001')
      expect(store.selectedVehicles).toContain('001')
      
      // 再次切换：取消选择
      store.toggleVehicleSelection('001')
      expect(store.selectedVehicles).not.toContain('001')
    })
  })

  describe('clearSelection', () => {
    it('应该清空所有选择', () => {
      store.selectVehicle('001')
      store.selectVehicle('002')
      store.clearSelection()
      
      expect(store.selectedVehicles).toEqual([])
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      store.setVehicles(mockVehicles)
      store.updateVehiclePosition('001', mockVehiclePositions['001'])
    })

    it('getAllVehicles应该返回所有车辆', () => {
      expect(store.getAllVehicles).toEqual(mockVehicles)
    })

    it('getSelectedVehicles应该返回选中的车辆', () => {
      store.selectVehicle('001')
      store.selectVehicle('002')
      expect(store.getSelectedVehicles).toEqual(['001', '002'])
    })

    it('getVehiclePositions应该返回所有位置', () => {
      expect(store.getVehiclePositions).toEqual({
        '001': expect.objectContaining(mockVehiclePositions['001'])
      })
    })

    it('getVehiclePosition应该返回指定车辆位置', () => {
      const position = store.getVehiclePosition('001')
      expect(position).toEqual(expect.objectContaining(mockVehiclePositions['001']))
    })

    it('getVehiclePosition应该返回null当车辆不存在时', () => {
      const position = store.getVehiclePosition('999')
      expect(position).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('应该设置加载状态', () => {
      store.setLoading(true)
      expect(store.isLoading).toBe(true)
      
      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })
  })
}) 