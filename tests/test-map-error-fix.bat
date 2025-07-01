@echo off
echo 地图错误修复测试
echo =================

echo.
echo 1. 检查前端服务器状态...
netstat -an | findstr :8665
if %errorlevel% neq 0 (
    echo 前端服务器未运行，请先启动服务器
    echo 运行命令: cd frontend && npm run dev
    pause
    exit /b 1
)

echo.
echo 2. 打开测试页面...
start http://localhost:8665/map-error-fix-test.html

echo.
echo 3. 测试说明:
echo    - 页面会自动初始化地图
echo    - 点击"测试有效坐标"验证坐标验证功能
echo    - 点击"测试无效坐标"验证错误处理
echo    - 点击"添加测试车辆"测试车辆定位功能
echo    - 点击"测试地图错误"验证错误处理机制
echo.
echo 4. 检查控制台日志:
echo    - 打开浏览器开发者工具 (F12)
echo    - 查看 Console 标签页
echo    - 确认没有地图相关错误
echo.
echo 5. 验证修复效果:
echo    - 地图正常显示
echo    - 坐标验证正常工作
echo    - 无效坐标被正确处理
echo    - 车辆定位功能正常
echo    - 错误处理机制有效
echo.
pause 