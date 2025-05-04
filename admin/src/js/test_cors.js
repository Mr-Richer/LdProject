/**
 * CORS 连接测试工具
 * 用于测试API连接是否存在跨域问题
 */

(function() {
    // 定义测试按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .cors-test-container {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            z-index: 9999;
            width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .cors-test-title {
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .cors-test-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .cors-test-btn:hover {
            background: #0069d9;
        }
        .cors-test-result {
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 3px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 12px;
        }
        .cors-test-success {
            color: green;
            font-weight: bold;
        }
        .cors-test-error {
            color: red;
        }
    `;
    document.head.appendChild(style);

    // 创建测试容器
    const container = document.createElement('div');
    container.className = 'cors-test-container';
    container.innerHTML = `
        <div class="cors-test-title">CORS 连接测试</div>
        <button class="cors-test-btn" id="test-get">测试 GET</button>
        <button class="cors-test-btn" id="test-post">测试 POST</button>
        <button class="cors-test-btn" id="test-quiz">测试生成题目</button>
        <button class="cors-test-btn" id="test-close" style="background:#dc3545">关闭</button>
        <div class="cors-test-result" id="cors-result">点击按钮开始测试...</div>
    `;
    document.body.appendChild(container);

    // 获取结果显示区域
    const resultDiv = document.getElementById('cors-result');

    // 显示结果函数
    function showResult(message, isError = false) {
        const now = new Date().toLocaleTimeString();
        resultDiv.innerHTML += `<div class="${isError ? 'cors-test-error' : ''}">
            [${now}] ${message}
        </div>`;
        resultDiv.scrollTop = resultDiv.scrollHeight;
    }

    // 显示成功消息
    function showSuccess(message) {
        const now = new Date().toLocaleTimeString();
        resultDiv.innerHTML += `<div class="cors-test-success">
            [${now}] ✅ ${message}
        </div>`;
        resultDiv.scrollTop = resultDiv.scrollHeight;
    }

    // 清空结果
    function clearResult() {
        resultDiv.innerHTML = '';
    }

    // 测试GET请求
    document.getElementById('test-get').addEventListener('click', function() {
        clearResult();
        showResult('正在测试GET请求...');
        
        fetch('http://localhost:3000/api/health')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                showSuccess('GET请求成功!');
                showResult('响应数据: ' + JSON.stringify(data));
            })
            .catch(error => {
                showResult('GET请求失败: ' + error.message, true);
            });
    });

    // 测试POST请求
    document.getElementById('test-post').addEventListener('click', function() {
        clearResult();
        showResult('正在测试POST请求...');
        
        fetch('http://localhost:3000/api/health/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ test: true })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                showSuccess('POST请求成功!');
                showResult('响应数据: ' + JSON.stringify(data));
            })
            .catch(error => {
                showResult('POST请求失败: ' + error.message, true);
            });
    });

    // 测试生成题目
    document.getElementById('test-quiz').addEventListener('click', function() {
        clearResult();
        showResult('正在测试题目生成...');
        
        const testParams = {
            prompt: '生成有关中国传统节日的题目',
            quizType: 'single',
            generationMethod: 'random', // 使用随机生成方式，避免依赖AI服务
            count: 2,
            difficulty: 'easy'
        };
        
        fetch('http://localhost:3000/api/ai/quiz/generate-by-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testParams)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                showSuccess('题目生成请求成功!');
                showResult('生成题目数量: ' + (data.data?.questions?.length || 0));
                if (data.data?.questions?.length > 0) {
                    showResult('示例题目: ' + data.data.questions[0].questionText);
                }
            })
            .catch(error => {
                showResult('题目生成请求失败: ' + error.message, true);
            });
    });

    // 关闭测试面板
    document.getElementById('test-close').addEventListener('click', function() {
        container.remove();
    });

    console.log('CORS测试工具已加载');
})(); 