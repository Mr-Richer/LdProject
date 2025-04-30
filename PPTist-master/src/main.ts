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
            
            // 通知父窗口已收到数据
            window.parent.postMessage({
              type: 'pptist-event',
              action: 'ppt-loading'
            }, '*');
            
            // 检查是否包含URL参数
            if (data && data.url) {
              const url = data.url;
              console.log('准备从URL加载PPT:', url);
              
              // 从URL加载PPT文件
              fetch(url)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`无法加载PPT文件: ${response.status} ${response.statusText}`);
                  }
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
                  
                  // 读取文件内容
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (!event.target) {
                      console.error('文件读取错误: event.target为null');
                      return;
                    }
                    
                    // 向自身发送IMPORT_FILE消息，使用PPTist内部支持的格式
                    window.postMessage({
                      type: 'IMPORT_FILE',
                      data: {
                        name: file.name,
                        content: event.target.result
                      }
                    }, '*');
                    
                    console.log('已将PPT数据转发到内部处理器');
                  };
                  
                  // 根据文件类型选择读取方式
                  if (filename.endsWith('.pptx')) {
                    reader.readAsArrayBuffer(file);
                  } else {
                    reader.readAsText(file);
                  }
                  
                  // 通知父窗口已加载成功
                  setTimeout(() => {
                    window.parent.postMessage({
                      type: 'pptist-event',
                      action: 'ppt-loaded'
                    }, '*');
                  }, 3000); // 给予足够时间处理文件
                })
                .catch(error => {
                  console.error('加载PPT文件失败:', error);
                  
                  // 通知父窗口加载失败
                  window.parent.postMessage({
                    type: 'pptist-event',
                    action: 'ppt-load-error',
                    error: error.message
                  }, '*');
                });
            } else {
              console.error('缺少URL参数');
              
              // 通知父窗口加载失败
              window.parent.postMessage({
                type: 'pptist-event',
                action: 'ppt-load-error',
                error: '缺少URL参数'
              }, '*');
            }
            break;
          
          default:
            console.warn('未知的PPTist命令:', action);
        }
      }
    }
  } catch (error) {
    console.error('处理消息时出错:', error);
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
        
        // 导入文件 - 根据文件类型调用不同的导入函数
        import('./hooks/useImport').then(module => {
          const useImport = module.default;
          const { importPPTXFile, importSpecificFile } = useImport();
          
          if (fileName.endsWith('.pptx')) {
            console.log('调用importPPTXFile导入PPTX文件');
            importPPTXFile(fileList, true);
          } else if (fileName.endsWith('.pptist')) {
            console.log('调用importSpecificFile导入PPTIST文件');
            importSpecificFile(fileList, true);
          } else {
            console.error('不支持的文件类型:', fileName);
          }
          
          console.log('文件导入处理完成');
        }).catch(err => {
          console.error('导入模块加载失败:', err);
        });
        
      } catch (error) {
        console.error('处理IMPORT_FILE消息时出错:', error);
      }
    }
  });
}
