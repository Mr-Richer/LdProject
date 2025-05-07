/**
 * 通知显示模块
 * 提供页面顶部通知功能
 */

// 显示通知的函数
function showNotification(message, type = 'info', duration = 5000) {
    console.log(`显示通知: ${message} (${type})`);
    
    // 如果已经存在通知容器，则使用它，否则创建一个
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // 图标选择
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
        default:
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    // 设置内容
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 添加样式，实现淡入效果
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 添加关闭按钮事件
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeNotification(notification);
        });
    }
    
    // 自动关闭
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
    
    // 返回通知元素，方便后续操作
    return notification;
}

// 关闭通知的函数
function closeNotification(notification) {
    // 移除显示类，触发淡出动画
    notification.classList.remove('show');
    
    // 等待动画完成后移除元素
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
            
            // 如果容器中没有通知了，也移除容器
            const container = document.querySelector('.notification-container');
            if (container && container.children.length === 0) {
                container.parentNode.removeChild(container);
            }
        }
    }, 300); // 与CSS过渡时间相匹配
}

// 添加必要的CSS样式
function addNotificationStyles() {
    // 检查是否已存在样式
    if (document.querySelector('#notification-styles')) {
        return;
    }
    
    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 80%;
            width: 350px;
        }
        
        .notification {
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            display: flex;
            padding: 15px;
            align-items: center;
            transform: translateX(110%);
            transition: transform 0.3s ease;
            opacity: 0.95;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-icon {
            margin-right: 15px;
            font-size: 20px;
        }
        
        .notification-success .notification-icon {
            color: #4CAF50;
        }
        
        .notification-error .notification-icon {
            color: #F44336;
        }
        
        .notification-warning .notification-icon {
            color: #FF9800;
        }
        
        .notification-info .notification-icon {
            color: #2196F3;
        }
        
        .notification-message {
            flex-grow: 1;
            font-size: 14px;
            color: #333;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            margin-left: 10px;
        }
        
        .notification-close:hover {
            color: #333;
        }
    `;
    
    // 添加到页面
    document.head.appendChild(style);
}

// 初始化
function initNotifications() {
    addNotificationStyles();
}

// 在页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}

// 导出函数
window.showNotification = showNotification;
window.closeNotification = closeNotification; 