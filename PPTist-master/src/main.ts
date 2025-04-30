import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Directive from '@/plugins/directive'

const app = createApp(App)
app.use(Icon)
app.use(Directive)
app.use(createPinia())
app.mount('#app')

// 添加消息处理逻辑

// 定义消息类型接口
interface StatusData {
  [key: string]: any;
}

// 通知父窗口PPTist已初始化
try {
  window.parent.postMessage({ 
    type: 'pptist-event', 
    action: 'initialized'
  }, '*');
  console.log('PPTist初始化消息已发送');
} catch (error) {
  console.error('发送初始化消息失败:', error);
}

// 发送状态更新消息到父窗口
function sendStatusUpdate(action: string, data: StatusData | null = null, error: string | null = null) {
  try {
    window.parent.postMessage({
      type: 'pptist-event',
      action,
      data,
      error
    }, '*');
    console.log(`已发送状态更新: ${action}`, data || error || '');
  } catch (err) {
    console.error('发送状态更新失败:', err);
  }
}

// 监听来自父窗口的消息
window.addEventListener('message', event => {
  // 安全检查
  try {
    // 处理消息
    if (event.data && event.data.type) {
      console.log('PPTist收到消息:', event.data);

      // 处理ping消息
      if (event.data.type === 'ping') {
        console.log('收到ping消息，发送pong响应');
        
        // 响应ping
        window.parent.postMessage({ type: 'pong' }, '*');
        return;
      }

      // 处理命令消息
      if (event.data.type === 'pptist-command') {
        const { action, data } = event.data;
        
        // 处理不同命令
        switch (action) {
          case 'load-ppt':
            console.log('收到load-ppt命令:', data);
            
            // 通知父窗口已收到数据，开始加载
            sendStatusUpdate('ppt-loading');
            
            // 检查是否包含URL参数
            if (data && data.url) {
              const url = data.url;
              console.log('准备从URL加载PPT:', url);
              
              // 更新加载状态
              sendStatusUpdate('ppt-loading', { stage: 'fetching', url });
              
              // 从URL加载PPT文件
              fetch(url)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`无法加载PPT文件: ${response.status} ${response.statusText}`);
                  }
                  
                  // 更新加载状态 - 文件已获取，准备处理
                  sendStatusUpdate('ppt-loading', { stage: 'processing' });
                  
                  return response.blob();
                })
                .then(blob => {
                  // 提取文件名
                  const filename = url.substring(url.lastIndexOf('/') + 1);
                  
                  // 创建文件对象
                  const file = new File([blob], filename, { 
                    type: filename.endsWith('.pptx') 
                      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                      : 'application/json'
                  });
                  
                  // 更新加载状态 - 正在读取文件内容
                  sendStatusUpdate('ppt-loading', { stage: 'reading', filename });
                  
                  // 读取文件内容
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (!event.target) {
                      const errorMsg = '文件读取错误: event.target为null';
                      console.error(errorMsg);
                      sendStatusUpdate('ppt-load-error', null, errorMsg);
                      return;
                    }
                    
                    // 更新加载状态 - 准备导入
                    sendStatusUpdate('ppt-loading', { stage: 'importing', filename });
                    
                    // 向自身发送IMPORT_FILE消息，使用PPTist内部支持的格式
                    window.postMessage({
                      type: 'IMPORT_FILE',
                      data: {
                        name: file.name,
                        content: event.target.result
                      }
                    }, '*');
                    
                    console.log('已将PPT数据转发到内部处理器');
                    
                    // 更新加载状态 - 正在渲染
                    sendStatusUpdate('ppt-loading', { stage: 'rendering', filename });
                    
                    // 不需要在这里添加延时通知加载完成，将在实际导入完成后通知
                  };
                  
                  reader.onerror = (error) => {
                    const errorMsg = `读取文件失败: ${error}`;
                    console.error(errorMsg);
                    sendStatusUpdate('ppt-load-error', null, errorMsg);
                  };
                  
                  // 根据文件类型选择读取方式
                  if (filename.endsWith('.pptx')) {
                    reader.readAsArrayBuffer(file);
                  } else {
                    reader.readAsText(file);
                  }
                  
                  // 不再使用固定延时通知加载完成
                })
                .catch(error => {
                  console.error('加载PPT文件失败:', error);
                  
                  // 通知父窗口加载失败
                  sendStatusUpdate('ppt-load-error', null, error.message);
                });
            } else {
              const errorMsg = '缺少URL参数';
              console.error(errorMsg);
              
              // 通知父窗口加载失败
              sendStatusUpdate('ppt-load-error', null, errorMsg);
            }
            break;
          
          default:
            console.warn('未知的PPTist命令:', action);
        }
      }
    }
  } catch (error: any) {
    console.error('处理消息时出错:', error);
    // 通知父窗口处理错误
    try {
      window.parent.postMessage({
        type: 'pptist-event',
        action: 'error',
        error: `处理消息时出错: ${error.message || '未知错误'}`
      }, '*');
    } catch (e) {
      console.error('发送错误通知失败:', e);
    }
  }
});

// 检查是否已经添加过此类消息处理
const hasImportFileHandler = 'importFileHandlerAdded' in window;

if (!hasImportFileHandler) {
  // 标记已添加处理器
  (window as any).importFileHandlerAdded = true;
  
  // 在window对象上添加一个监听器，用于处理IMPORT_FILE消息
  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'IMPORT_FILE' && e.data.data) {
      console.log('收到IMPORT_FILE消息，尝试处理', e.data.data.name);
      
      try {
        // 创建一个模拟的File对象
        const fileContent = e.data.data.content;
        const fileName = e.data.data.name;
        
        // 创建一个Blob对象
        let blob;
        if (typeof fileContent === 'string') {
          blob = new Blob([fileContent], { type: 'application/json' });
        } else {
          blob = new Blob([fileContent], { 
            type: fileName.endsWith('.pptx') 
              ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
              : 'application/json' 
          });
        }
        
        // 创建File对象
        const file = new File([blob], fileName, { type: blob.type });
        
        // 创建FileList对象的模拟
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;
        
        // 跟踪PPT导入和渲染状态的变量
        let isImporting = true;
        
        // 定义一个函数来检查PPT是否真正渲染完成
        const checkRenderingComplete = () => {
          try {
            // 检查文档中是否存在幻灯片元素作为渲染完成的标志
            const slideElements = document.querySelectorAll('.slide-content-element');
            const hasSlides = slideElements && slideElements.length > 0;
            
            console.log(`检查渲染状态: 发现 ${slideElements ? slideElements.length : 0} 个幻灯片元素`);
            
            if (hasSlides) {
              // 如果找到幻灯片元素，说明已经渲染完成
              console.log('检测到幻灯片已渲染，通知加载完成');
              sendStatusUpdate('ppt-loaded', { filename: fileName });
              return;
            }
            
            // 检查编辑器元素
            const editorElements = document.querySelectorAll('.editor');
            const hasEditor = editorElements && editorElements.length > 0;
            
            if (hasEditor) {
              // 可能内容已加载但没有幻灯片，或者是空PPT
              console.log('检测到编辑器已渲染，通知加载完成');
              sendStatusUpdate('ppt-loaded', { filename: fileName });
              return;
            }
            
            // 如果还在导入中，继续检查
            if (isImporting) {
              setTimeout(checkRenderingComplete, 500);  // 每500ms检查一次
            } else {
              // 如果导入过程结束但没有检测到渲染完成，发送通知
              console.log('导入结束但未检测到渲染，发送加载完成通知');
              sendStatusUpdate('ppt-loaded', { filename: fileName });
            }
          } catch (err) {
            console.error('检查渲染状态时出错:', err);
            // 出错时也发送完成通知，避免界面一直显示加载中
            sendStatusUpdate('ppt-loaded', { filename: fileName });
          }
        };
        
        // 导入文件 - 根据文件类型调用不同的导入函数
        import('./hooks/useImport').then(module => {
          const useImport = module.default;
          const { importPPTXFile, importSpecificFile } = useImport();
          
          // 定义导入完成的回调函数
          const onImportComplete = () => {
            console.log('文件导入处理完成，等待渲染结果');
            // 标记导入已完成
            isImporting = false;
            
            // 如果1.5秒后仍未通过渲染检查发送通知，强制发送
            setTimeout(() => {
              if (isImporting === false) {  // 确保这不会与渲染检查冲突
                console.log('导入完成1.5秒后强制发送加载完成通知');
                sendStatusUpdate('ppt-loaded', { filename: fileName });
              }
            }, 1500);
          };
          
          if (fileName.endsWith('.pptx')) {
            console.log('调用importPPTXFile导入PPTX文件');
            // 通知父窗口正在处理PPTX
            sendStatusUpdate('ppt-loading', { stage: 'parsing-pptx', fileName });
            
            // 开始检查渲染状态
            setTimeout(checkRenderingComplete, 1000);
            
            // 导入PPTX文件
            try {
              importPPTXFile(fileList, true);
              // 导入函数可能不返回Promise，所以使用setTimeout确保在导入处理完成后通知
              setTimeout(onImportComplete, 800);
            } catch (importError: any) {
              console.error('导入PPTX文件失败:', importError);
              sendStatusUpdate('ppt-load-error', null, `导入PPTX文件失败: ${importError.message || '未知错误'}`);
              isImporting = false;
            }
          } else if (fileName.endsWith('.pptist')) {
            console.log('调用importSpecificFile导入PPTIST文件');
            // 通知父窗口正在处理PPTIST
            sendStatusUpdate('ppt-loading', { stage: 'parsing-pptist', fileName });
            
            // 开始检查渲染状态
            setTimeout(checkRenderingComplete, 1000);
            
            // 导入PPTIST文件
            try {
              importSpecificFile(fileList, true);
              // 导入函数可能不返回Promise，所以使用setTimeout确保在导入处理完成后通知
              setTimeout(onImportComplete, 800);
            } catch (importError: any) {
              console.error('导入PPTIST文件失败:', importError);
              sendStatusUpdate('ppt-load-error', null, `导入PPTIST文件失败: ${importError.message || '未知错误'}`);
              isImporting = false;
            }
          } else {
            const errorMsg = `不支持的文件类型: ${fileName}`;
            console.error(errorMsg);
            sendStatusUpdate('ppt-load-error', null, errorMsg);
            isImporting = false;
            return;
          }
          
        }).catch(err => {
          console.error('导入模块加载失败:', err);
          sendStatusUpdate('ppt-load-error', null, `导入模块加载失败: ${err.message || '未知错误'}`);
        });
        
      } catch (error: any) {
        console.error('处理IMPORT_FILE消息时出错:', error);
        sendStatusUpdate('ppt-load-error', null, `处理文件导入时出错: ${error.message || '未知错误'}`);
      }
    }
  });
}
