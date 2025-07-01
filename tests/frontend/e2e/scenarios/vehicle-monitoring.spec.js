import { test, expect } from '@playwright/test'

test.describe('Vehicle Monitoring System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002')
    await page.waitForLoadState('networkidle')
  })

  test('should display map and vehicle list on homepage', async ({ page }) => {
    // 验证地图容器
    await expect(page.locator('.map-container')).toBeVisible()
    await expect(page.locator('#map')).toBeVisible()
    
    // 验证车辆列表
    await expect(page.locator('.vehicle-list-container')).toBeVisible()
    await expect(page.locator('.vehicle-list-header h3')).toHaveText('车辆列表')
  })

  test('should show vehicle markers on map', async ({ page }) => {
    // 等待车辆标记加载
    await page.waitForTimeout(2000)
    
    // 验证车辆标记存在
    await expect(page.locator('.vehicle-marker')).toBeVisible()
    
    // 验证车牌号码显示
    await expect(page.locator('.vehicle-plate')).toBeVisible()
  })

  test('should handle vehicle selection in list', async ({ page }) => {
    // 点击车辆列表中的车辆
    await page.locator('.vehicle-item').first().click()
    
    // 验证选择状态
    await expect(page.locator('.selection-info')).toContainText('已选择: 1/8')
  })

  test('should show vehicle info in status bar when clicking marker', async ({ page }) => {
    // 等待车辆标记加载
    await page.waitForTimeout(2000)
    
    // 点击车辆标记
    await page.locator('.vehicle-marker').first().click()
    
    // 验证状态栏显示
    await expect(page.locator('.map-status-bar')).toBeVisible()
    await expect(page.locator('.vehicle-no')).toBeVisible()
  })

  test('should handle select all vehicles', async ({ page }) => {
    // 点击全选按钮
    await page.locator('button:has-text("全选")').click()
    
    // 验证所有车辆被选中
    await expect(page.locator('.selection-info')).toContainText('已选择: 8/8')
  })

  test('should handle clear selection', async ({ page }) => {
    // 先全选
    await page.locator('button:has-text("全选")').click()
    
    // 再清空
    await page.locator('button:has-text("清空")').click()
    
    // 验证选择被清空
    await expect(page.locator('.selection-info')).toContainText('已选择: 0/8')
  })

  test('should show vehicle statistics', async ({ page }) => {
    // 验证统计信息显示
    await expect(page.locator('.status-stats')).toBeVisible()
    await expect(page.locator('.stat-item')).toHaveCount(4)
    await expect(page.locator('.stat-dot')).toHaveCount(4)
  })

  test('should handle vehicle list collapse', async ({ page }) => {
    // 点击折叠按钮
    await page.locator('.collapse-btn').click()
    
    // 验证列表被折叠
    await expect(page.locator('.vehicle-list-container')).toHaveClass(/collapsed/)
  })

  test('should update vehicle positions periodically', async ({ page }) => {
    // 等待初始位置加载
    await page.waitForTimeout(2000)
    
    // 记录初始位置
    const initialPosition = await page.locator('.vehicle-marker').first().boundingBox()
    
    // 等待位置更新（3秒）
    await page.waitForTimeout(4000)
    
    // 验证位置发生变化（车辆移动）
    const newPosition = await page.locator('.vehicle-marker').first().boundingBox()
    expect(newPosition.x).not.toBe(initialPosition.x)
    expect(newPosition.y).not.toBe(initialPosition.y)
  })

  test('should show different vehicle status colors', async ({ page }) => {
    // 等待车辆标记加载
    await page.waitForTimeout(2000)
    
    // 验证不同状态的车辆有不同的车牌颜色
    const plates = await page.locator('.vehicle-plate').all()
    expect(plates.length).toBeGreaterThan(0)
    
    // 验证至少有一个车牌有背景色
    const firstPlate = plates[0]
    const backgroundColor = await firstPlate.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('should handle map controls', async ({ page }) => {
    // 验证地图控制按钮存在
    await expect(page.locator('button[title="放大"]')).toBeVisible()
    await expect(page.locator('button[title="缩小"]')).toBeVisible()
    await expect(page.locator('button[title="适应所有车辆"]')).toBeVisible()
    await expect(page.locator('button[title="清除标记"]')).toBeVisible()
    
    // 测试放大按钮
    await page.locator('button[title="放大"]').click()
    
    // 测试缩小按钮
    await page.locator('button[title="缩小"]').click()
  })
}) 