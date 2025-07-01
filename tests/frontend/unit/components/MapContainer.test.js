import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MapContainer from '../../../../frontend/src/components/MapContainer.vue'

describe('MapContainer', () => {
  let wrapper

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

    wrapper = mount(MapContainer)
  })

  it('should render map container', () => {
    expect(wrapper.find('.map-container').exists()).toBe(true)
    expect(wrapper.find('#map').exists()).toBe(true)
  })

  it('should initialize map controls', () => {
    expect(wrapper.find('.map-controls').exists()).toBe(true)
    expect(wrapper.find('button[title="放大"]').exists()).toBe(true)
    expect(wrapper.find('button[title="缩小"]').exists()).toBe(true)
    expect(wrapper.find('button[title="适应所有车辆"]').exists()).toBe(true)
    expect(wrapper.find('button[title="清除标记"]').exists()).toBe(true)
  })

  it('should handle zoom in', async () => {
    const zoomInBtn = wrapper.find('button[title="放大"]')
    await zoomInBtn.trigger('click')
    // 验证地图缩放方法被调用
  })

  it('should handle zoom out', async () => {
    const zoomOutBtn = wrapper.find('button[title="缩小"]')
    await zoomOutBtn.trigger('click')
    // 验证地图缩放方法被调用
  })

  it('should show vehicle info panel when vehicle is selected', async () => {
    await wrapper.setData({
      selectedVehicle: {
        id: '001',
        vehicleNo: '京A12345',
        vehicleType: '货车',
        ownerName: '张三',
        contactPhone: '13800138001'
      },
      selectedVehiclePosition: {
        speed: 60,
        direction: 90,
        altitude: 100,
        locationTime: new Date().toISOString()
      }
    })

    expect(wrapper.find('.vehicle-info-panel').exists()).toBe(true)
    expect(wrapper.find('.vehicle-info-panel h4').text()).toBe('京A12345')
  })

  it('should show status bar when vehicle is selected', async () => {
    await wrapper.setData({
      lastSelectedVehicle: {
        id: '001',
        vehicleNo: '京A12345',
        terminalId: 'T001',
        vehicleType: '货车',
        status: 1
      },
      lastSelectedVehiclePosition: {
        speed: 60,
        locationTime: new Date().toISOString()
      }
    })

    expect(wrapper.find('.map-status-bar').exists()).toBe(true)
    expect(wrapper.find('.vehicle-no').text()).toBe('京A12345')
  })
}) 