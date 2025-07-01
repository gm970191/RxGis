import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VehicleList from '../../../../frontend/src/components/VehicleList.vue'

describe('VehicleList', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(VehicleList)
  })

  it('should render vehicle list container', () => {
    expect(wrapper.find('.vehicle-list-container').exists()).toBe(true)
    expect(wrapper.find('.vehicle-list-header').exists()).toBe(true)
    expect(wrapper.find('.vehicle-list-header h3').text()).toBe('车辆列表')
  })

  it('should render toolbar with buttons', () => {
    expect(wrapper.find('.vehicle-list-toolbar').exists()).toBe(true)
    expect(wrapper.find('button:has-text("全选")').exists()).toBe(true)
    expect(wrapper.find('button:has-text("清空")').exists()).toBe(true)
  })

  it('should show selection info in toolbar', () => {
    expect(wrapper.find('.selection-info').exists()).toBe(true)
    expect(wrapper.find('.selection-info').text()).toContain('已选择: 0/8')
  })

  it('should render status statistics', () => {
    expect(wrapper.find('.status-stats').exists()).toBe(true)
    expect(wrapper.findAll('.stat-item')).toHaveLength(4)
    expect(wrapper.findAll('.stat-dot')).toHaveLength(4)
  })

  it('should handle select all', async () => {
    const selectAllBtn = wrapper.find('button:has-text("全选")')
    await selectAllBtn.trigger('click')
    
    // 验证选择信息更新
    expect(wrapper.find('.selection-info').text()).toContain('已选择: 8/8')
  })

  it('should handle clear selection', async () => {
    // 先全选
    const selectAllBtn = wrapper.find('button:has-text("全选")')
    await selectAllBtn.trigger('click')
    
    // 再清空
    const clearBtn = wrapper.find('button:has-text("清空")')
    await clearBtn.trigger('click')
    
    // 验证选择信息更新
    expect(wrapper.find('.selection-info').text()).toContain('已选择: 0/8')
  })

  it('should toggle collapse state', async () => {
    const collapseBtn = wrapper.find('.collapse-btn')
    await collapseBtn.trigger('click')
    
    expect(wrapper.find('.vehicle-list-container').classes()).toContain('collapsed')
  })

  it('should display correct vehicle count', () => {
    // 假设有8辆车
    expect(wrapper.find('.selection-info').text()).toContain('/8')
  })

  it('should show status dots with correct colors', () => {
    const dots = wrapper.findAll('.stat-dot')
    expect(dots[0].classes()).toContain('moving')
    expect(dots[1].classes()).toContain('stopped')
    expect(dots[2].classes()).toContain('offline')
    expect(dots[3].classes()).toContain('online')
  })
}) 