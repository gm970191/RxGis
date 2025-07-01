@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 地图中心位置设置测试
echo ========================================
echo.

echo 🚀 启动地图中心位置设置测试...
echo.

echo 📍 测试功能说明:
echo    - 使用OpenStreetMap显示真实地图
echo    - 三个预设位置: 天安门、北京东部、北京东北部
echo    - 点击任意位置，地图将以该位置为中心
echo    - 可以清楚看到地图中心变化效果
echo.

echo 🌐 测试页面地址:
echo    http://localhost:8665/test/simple-map-test.html
echo.

echo 📋 测试步骤:
echo    1. 打开测试页面
echo    2. 点击右侧任意位置按钮
echo    3. 观察地图中心变化效果
echo    4. 使用"测试所有位置"按钮进行自动测试
echo    5. 点击地图上的标记查看详细信息
echo.

echo ⚠️  注意: 确保前端服务器运行在端口 8665
echo.

echo 🎯 开始测试...
echo.

start http://localhost:8665/test/simple-map-test.html

echo ✅ 测试页面已打开
echo.
echo 💡 提示: 如果页面无法访问，请确保:
echo    1. 前端服务器正在运行 (npm run dev)
echo    2. 服务器端口为 8665
echo    3. 测试文件存在于 frontend/test/ 目录中
echo.

echo 🔧 功能特性:
echo    - 真实地图显示 (OpenStreetMap)
echo    - 平滑的地图中心切换动画
echo    - 位置标记和弹出信息
echo    - 实时状态显示和操作日志
echo    - 自动测试功能
echo.

pause 