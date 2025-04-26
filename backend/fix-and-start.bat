@echo off
echo ====================================
echo 数据库修复和服务器启动工具
echo ====================================
echo.

:: 检查node是否安装
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查npm是否安装
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到npm，请确保安装了完整的Node.js
    pause
    exit /b 1
)

:: 检查是否需要安装依赖
if not exist "node_modules" (
    echo 正在安装依赖，这可能需要几分钟...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo 安装依赖失败，请检查网络连接或手动运行 'npm install'
        pause
        exit /b 1
    )
    echo 依赖安装完成!
)

:: 运行数据库修复脚本
echo 正在运行数据库修复脚本...
node db-fix.js --start

:: 检查是否需要编译
if not exist "dist" (
    echo 正在编译项目...
    npm run build
    if %ERRORLEVEL% neq 0 (
        echo 编译失败，请检查控制台输出修复任何错误
        pause
        exit /b 1
    )
    echo 编译完成!
)

:: 启动服务器
echo 正在启动服务器...
npm run start:dev

pause 