@echo off
chcp 65001 >nul
echo 🚀 开始运行所有子系统测试...
echo.

echo 📱 测试前端系统...
cd /d "%~dp0\frontend"
call run-tests.bat

echo.
echo ✅ 所有测试完成
pause 