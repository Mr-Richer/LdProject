/**
 * 使用最简单的curl请求测试API
 * 以排除可能的fetch或其他JS环境问题
 */
const { exec } = require('child_process');

// 最简单的测试数据
const simplestData = {
  questions: [
    {
      type: "choice",
      question: "简单测试题目",
      options: "[]",
      answer: "A"
    }
  ],
  quizId: 1,
  chapterId: 1
};

// 执行curl命令
function runCurl() {
  // 将数据转换为JSON并正确处理引号
  const jsonData = JSON.stringify(simplestData).replace(/"/g, '\\"');
  
  // 在Windows PowerShell中需要特别注意引号处理
  const curlCommand = `curl -X POST http://localhost:3000/api/quiz/save-questions -H "Content-Type: application/json" -d "${jsonData}"`;
  
  console.log('执行命令:', curlCommand);
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('执行错误:', error);
      return;
    }
    
    console.log('=== 响应输出 ===');
    console.log(stdout);
    
    if (stderr) {
      console.error('错误输出:', stderr);
    }
  });
}

// 写入临时文件执行测试
function runWithFile() {
  const fs = require('fs');
  const path = require('path');
  
  // 创建临时JSON文件
  const tempFile = path.join(__dirname, 'temp-data.json');
  fs.writeFileSync(tempFile, JSON.stringify(simplestData, null, 2));
  
  // 使用文件执行curl
  const curlCommand = `curl -X POST http://localhost:3000/api/quiz/save-questions -H "Content-Type: application/json" -d @${tempFile}`;
  
  console.log('执行文件命令:', curlCommand);
  
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('执行错误:', error);
      return;
    }
    
    console.log('=== 响应输出 ===');
    console.log(stdout);
    
    if (stderr) {
      console.error('错误输出:', stderr);
    }
    
    // 清理临时文件
    fs.unlinkSync(tempFile);
  });
}

// 执行测试
console.log('使用文件方式测试API');
runWithFile(); 