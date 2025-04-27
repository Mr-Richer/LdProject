@echo off
chcp 65001
echo ======================================================
echo 中国文化课程平台 - 综合启动脚本
echo ======================================================
echo.

cd %~dp0

echo 检查依赖项...
if not exist node_modules (
  echo 首次运行，正在安装依赖...
  call npm install
  if %errorlevel% neq 0 (
    echo 安装依赖失败，请检查网络连接或手动运行 npm install
    pause
    exit /b 1
  )
  echo 依赖安装完成!
) else (
  echo 依赖已安装，跳过安装步骤
)

echo.
echo 检查环境配置文件...
if not exist .env (
  echo 警告: 未找到.env文件
  echo 创建默认.env文件...
  
  echo # 数据库配置 > .env
  echo DB_TYPE=mysql >> .env
  echo DB_HOST=localhost >> .env
  echo DB_PORT=3307 >> .env
  echo DB_USERNAME=root >> .env
  echo DB_PASSWORD=ruichen >> .env
  echo DB_DATABASE=db_test >> .env
  echo DB_SYNCHRONIZE=true >> .env
  
  echo # 应用配置 >> .env
  echo PORT=3000 >> .env
  echo NODE_ENV=development >> .env
  
  echo # JWT配置 >> .env
  echo JWT_SECRET=your_jwt_secret_key >> .env
  echo JWT_EXPIRES_IN=7d >> .env
  
  echo .env文件已创建!
) else (
  echo .env文件已存在
)

echo.
echo 检查数据库连接...
node -e "const mysql = require('mysql2/promise'); (async () => { try { const conn = await mysql.createConnection({host:'localhost',port:3307,user:'root',password:'ruichen',database:'db_test'}); console.log('数据库连接成功!'); conn.end(); } catch(e) { console.error('数据库连接失败:', e.message); process.exit(1); } })();"

if %errorlevel% neq 0 (
  echo 数据库连接失败，请检查数据库配置或确保MySQL服务已启动
  echo 请修改.env文件中的数据库配置，然后重新运行此脚本
  pause
  exit /b 1
)

echo.
echo 选择启动模式:
echo [1] 仅启动后端服务
echo [2] 仅启动PPTist前端
echo [3] 同时启动后端服务和PPTist前端
echo [4] 启动全部服务（后端、PPTist和课程平台）
echo.
set /p choice=请输入选项(1-4): 

if "%choice%"=="1" (
  echo.
  echo 启动后端开发服务器...
  echo.
  echo 提示: 按下 Ctrl+C 可以停止服务器
  echo.
  call npm run start:dev
) else if "%choice%"=="2" (
  echo.
  echo 启动PPTist前端服务...
  echo.
  echo 提示: 按下 Ctrl+C 可以停止服务器
  echo.
  cd ../PPTist-master
  call npm run dev
) else if "%choice%"=="3" (
  echo.
  echo 同时启动后端服务和PPTist前端...
  echo.
  echo 提示: 这将打开两个命令窗口，分别运行后端和前端服务
  echo 关闭窗口可停止相应的服务
  echo.
  
  start cmd /k "chcp 65001 && cd %~dp0 && npm run start:dev"
  
  start cmd /k "chcp 65001 && cd %~dp0\..\PPTist-master && npm run dev"
  
  echo 服务已在新窗口中启动
) else if "%choice%"=="4" (
  echo.
  echo 启动全部服务（后端、PPTist和课程平台）...
  echo.
  echo 提示: 这将打开三个命令窗口，分别运行所需服务
  echo 关闭窗口可停止相应的服务
  echo.
  
  start cmd /k "chcp 65001 && cd %~dp0 && npm run start:dev"
  
  start cmd /k "chcp 65001 && cd %~dp0\..\PPTist-master && npm run dev"
  
  echo 服务已在新窗口中启动
  
  echo.
  echo 等待5秒，让服务启动...
  timeout /t 5 /nobreak > nul
  
  echo.
  echo 打开浏览器访问课程平台...
  start http://localhost:3000/admin
) else (
  echo 无效的选项，请重新运行脚本选择正确的启动模式
)

pause 