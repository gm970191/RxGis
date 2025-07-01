@echo off
echo RxGis 轻量化清理脚本
echo ====================

echo.
echo 1. 清理测试文件...
cd tests\frontend
del /q test-*.html 2>nul
del /q debug-*.html 2>nul
del /q simple-*.html 2>nul
del /q vehicle-*.html 2>nul
del /q map-*.html 2>nul
del /q *.bat 2>nul
echo 测试文件清理完成

echo.
echo 2. 清理npm缓存...
cd ..\..\frontend
npm cache clean --force
echo npm缓存清理完成

echo.
echo 3. 检查依赖包...
npm list --depth=0
echo.
echo 建议检查是否有不必要的依赖包

echo.
echo 4. 优化node_modules...
npm prune
echo 未使用的依赖包已清理

echo.
echo 5. 创建轻量化开发配置...
if not exist .vscode mkdir .vscode
echo {> .vscode\settings.json
echo   "editor.formatOnSave": true,>> .vscode\settings.json
echo   "files.exclude": {>> .vscode\settings.json
echo     "**/node_modules": true,>> .vscode\settings.json
echo     "**/dist": true,>> .vscode\settings.json
echo     "**/tests/frontend/test-*.html": true>> .vscode\settings.json
echo   }>> .vscode\settings.json
echo }>> .vscode\settings.json
echo VS Code配置已创建

echo.
echo 6. 更新package.json脚本...
echo 建议添加以下脚本到package.json:
echo   "clean": "rm -rf dist node_modules package-lock.json"
echo   "fresh": "npm run clean && npm install"

echo.
echo 7. 检查项目大小...
dir /s /-c | findstr "个文件"
echo.
echo 项目清理完成！

echo.
echo 下一步建议:
echo 1. 重启开发服务器: npm run dev
echo 2. 检查应用是否正常运行
echo 3. 根据需要调整配置
echo 4. 开始轻量化开发

pause 