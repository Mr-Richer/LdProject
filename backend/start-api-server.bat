@echo off
echo ======================================================
echo 启动后端API服务器 - 用于测试修复
echo ======================================================
echo.

cd %~dp0

:: 编译项目
echo 正在编译项目...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo 编译失败，请检查控制台输出修复任何错误
    pause
    exit /b 1
)
echo 编译完成!

:: 启动服务器
echo.
echo 正在启动后端API服务器...
echo.
echo 提示: 按下 Ctrl+C 可以停止服务器
echo.
call npm run start:dev

pause 