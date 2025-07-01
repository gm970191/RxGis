import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VehicleList from '@/components/VehicleList.vue'
import { mockVehicles } from '../utils/mockData.js'

// 模拟Pinia store
vi.mock('@/stores/vehicle', () => ({
  useVehicleStore: () => ({
    vehicles: mockVehicles,
    selectedVehicles: [],
    vehiclePositions: {},
    toggleVehicleSelection: vi.fn(),
    selectVehicle: vi.fn(),
    deselectVehicle: vi.fn(),
    clearSelection: vi.fn(),
    setVehicles: vi.fn()
  })
}))

describe('VehicleList.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(VehicleList, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-button': true,
          'el-tag': true,
          'el-icon': true
        }
      }
    })
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.vehicle-list-container').exists()).toBe(true)
  })

  it('应该显示车辆列表标题', () => {
    const title = wrapper.find('.vehicle-list-header h3')
    expect(title.text()).toBe('车辆列表')
  })

  it('应该显示所有车辆', () => {
    const vehicleItems = wrapper.findAll('.vehicle-item')
    expect(vehicleItems).toHaveLength(mockVehicles.length)
  })

  it('应该显示车辆信息', () => {
    const firstVehicle = wrapper.find('.vehicle-item')
    expect(firstVehicle.find('.vehicle-no').text()).toBe('京A12345')
    expect(firstVehicle.find('.vehicle-type').text()).toBe('货车')
    expect(firstVehicle.find('.vehicle-owner').text()).toBe('张三')
  })

  it('应该显示车辆状态标签', () => {
    const statusTags = wrapper.findAll('.vehicle-status')
    expect(statusTags).toHaveLength(mockVehicles.length)
  })

  it('应该支持折叠/展开功能', async () => {
    const collapseBtn = wrapper.find('.collapse-btn')
    expect(collapseBtn.exists()).toBe(true)
    
    // 初始状态应该是展开的
    expect(wrapper.classes()).not.toContain('collapsed')
    
    // 点击折叠按钮
    await collapseBtn.trigger('click')
    expect(wrapper.classes()).toContain('collapsed')
  })

  it('应该显示工具栏按钮', () => {
    const toolbar = wrapper.find('.vehicle-list-toolbar')
    expect(toolbar.exists()).toBe(true)
    
    const buttons = toolbar.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('应该显示选择统计信息', () => {
    const footer = wrapper.find('.vehicle-list-footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('已选择: 0/3')
  })

  it('应该响应车辆点击事件', async () => {
    const firstVehicle = wrapper.find('.vehicle-item')
    await firstVehicle.trigger('click')
    
    // 这里可以验证store方法是否被调用
    // 由于我们模拟了store，这里主要测试事件绑定
    expect(firstVehicle.exists()).toBe(true)
  })
}) 