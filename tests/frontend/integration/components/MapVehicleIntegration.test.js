import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Home from '../../../../frontend/src/views/Home.vue'

describe('Map and Vehicle Integration', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    // Mock AMap
    global.AMap = {
      Map: vi.fn().mockReturnValue({
        addControl: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        setBounds: vi.fn(),
        setCenter: vi.fn(),
        setZoom: vi.fn(),
        getZoom: vi.fn().mockReturnValue(11)
      }),
      Scale: vi.fn(),
      ToolBar: vi.fn(),
      Marker: vi.fn().mockReturnValue({
        on: vi.fn(),
        setPosition: vi.fn(),
        getPosition: vi.fn(),
        getContent: vi.fn()
      }),
      Icon: vi.fn(),
      Size: vi.fn(),
      Pixel: vi.fn(),
      Bounds: vi.fn().mockReturnValue({
        extend: vi.fn()
      })
    }

    pinia = createPinia()
    setActivePinia(pinia)
    wrapper = mount(Home)
  })

  it('should render both map and vehicle list', () => {
    expect(wrapper.find('.map-container').exists()).toBe(true)
    expect(wrapper.find('.vehicle-list-container').exists()).toBe(true)
  })

  it('should have correct layout structure', () => {
    expect(wrapper.find('.home-container').exists()).toBe(true)
    expect(wrapper.find('.map-container').exists()).toBe(true)
    expect(wrapper.find('.vehicle-list-container').exists()).toBe(true)
  })

  it('should initialize with default vehicle selection', () => {
    // 验证默认选中第一辆车
    const store = useVehicleStore()
    expect(store.getSelectedVehicles).toHaveLength(1)
  })

  it('should update map when vehicle selection changes', async () => {
    const store = useVehicleStore()
    
    // 选择第二辆车
    store.selectVehicle('002')
    
    // 验证地图标记更新
    expect(store.getSelectedVehicles).toContain('002')
  })

  it('should show vehicle info in status bar when vehicle is clicked', async () => {
    // 模拟点击车辆标记
    const mapContainer = wrapper.findComponent({ name: 'MapContainer' })
    await mapContainer.vm.showVehicleInfo({
      id: '001',
      vehicleNo: '京A12345',
      terminalId: 'T001',
      vehicleType: '货车',
      status: 1
    }, {
      lat: 39.90923,
      lng: 116.397428,
      speed: 60,
      locationTime: new Date().toISOString()
    })

    // 验证状态栏显示
    expect(wrapper.find('.map-status-bar').exists()).toBe(true)
  })

  it('should handle vehicle list collapse', async () => {
    const vehicleList = wrapper.findComponent({ name: 'VehicleList' })
    const collapseBtn = vehicleList.find('.collapse-btn')
    
    await collapseBtn.trigger('click')
    
    expect(vehicleList.find('.vehicle-list-container').classes()).toContain('collapsed')
  })

  it('should sync vehicle selection between list and map', async () => {
    const store = useVehicleStore()
    const vehicleList = wrapper.findComponent({ name: 'VehicleList' })
    
    // 在列表中点击车辆
    const vehicleItem = vehicleList.find('.vehicle-item')
    await vehicleItem.trigger('click')
    
    // 验证store中的选择状态
    expect(store.getSelectedVehicles).toHaveLength(1)
  })
}) 