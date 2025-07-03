# 车辆图标替换说明

## 当前图标实现

当前车辆图标使用SVG格式，通过Base64编码嵌入到代码中。图标位于：
- 文件：`src/components/MapContainer.vue`
- 函数：`getVehicleIcon()`

## 图标特征

### 当前图标设计
- **尺寸**: 32x32像素
- **格式**: SVG矢量图
- **颜色**: 根据车辆状态动态变化
  - 在线/行驶: 绿色 (#52c41a)
  - 离线: 红色 (#ff4d4f)
  - 停车: 橙色 (#faad14)

### 图标元素
- 货车主体（矩形车身）
- 车头（驾驶室）
- 车窗（透明效果）
- 车门（3个门）
- 车轮（2个圆形）
- 车灯（前灯）
- 车牌位置
- 状态指示器（右上角圆点）

## 手工替换方法

### 方法1：替换SVG代码
1. 打开 `src/components/MapContainer.vue`
2. 找到 `getVehicleIcon()` 函数
3. 替换 `btoa()` 函数内的SVG代码
4. 保存文件

### 方法2：使用外部图片文件
1. 将图标文件放入 `public/icons/` 目录
2. 修改 `getVehicleIcon()` 函数：

```javascript
const getVehicleIcon = (vehicleType, status = 1) => {
  const statusMap = {
    0: 'offline',
    1: 'online', 
    2: 'parking'
  }
  const status = statusMap[status] || 'online'
  return `/icons/truck-${status}.png`
}
```

### 方法3：使用在线图标库
1. 使用图标字体（如Font Awesome）
2. 修改图标创建方式：

```javascript
const getVehicleIcon = (vehicleType, status = 1) => {
  return new window.AMap.Icon({
    size: new window.AMap.Size(32, 32),
    image: 'https://your-icon-cdn.com/truck-icon.svg',
    imageSize: new window.AMap.Size(32, 32)
  })
}
```

## 推荐的图标资源

### 免费图标库
- **Font Awesome**: 提供货车图标
- **Material Icons**: Google Material Design图标
- **Feather Icons**: 简洁的SVG图标
- **Heroicons**: 精美的SVG图标

### 图标设计工具
- **Figma**: 在线设计工具
- **Sketch**: Mac设计工具
- **Adobe Illustrator**: 专业矢量设计

## 图标要求

### 技术规格
- **格式**: SVG（推荐）或PNG
- **尺寸**: 32x32像素（地图显示）
- **背景**: 透明
- **颜色**: 支持动态颜色变化

### 设计建议
- 简洁明了，易于识别
- 支持不同状态的颜色变化
- 保持与地图风格一致
- 考虑不同缩放级别的显示效果

## 示例：使用Font Awesome图标

```javascript
// 在index.html中添加Font Awesome
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

// 在组件中使用
const getVehicleIcon = (vehicleType, status = 1) => {
  const iconClass = status === 1 ? 'fa-truck' : 'fa-truck-moving'
  const color = status === 1 ? '#52c41a' : '#ff4d4f'
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32">
      <text x="16" y="20" text-anchor="middle" fill="${color}" font-size="20">
        <i class="${iconClass}"></i>
      </text>
    </svg>
  `)}`
}
```

## 注意事项

1. **性能考虑**: SVG格式文件较小，加载快
2. **兼容性**: 确保图标在不同浏览器中正常显示
3. **可访问性**: 为图标添加适当的alt文本
4. **维护性**: 保持图标命名规范，便于后续维护 