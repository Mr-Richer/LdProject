/**
 * 创建并初始化思政案例列表HTML结构
 */
function initIdeologyCasesListHTML() {
    // 查找思政案例内容区域
    const ideologyContent = document.getElementById('ideology-content');
    if (!ideologyContent) {
        console.error('找不到思政内容区域');
        return;
    }
    
    // 检查是否已存在案例列表
    let casesList = ideologyContent.querySelector('.ideology-cases-list');
    if (casesList) {
        console.log('案例列表已存在，跳过创建');
        return;
    }
    
    // 创建案例列表容器
    casesList = document.createElement('div');
    casesList.className = 'ideology-cases-list';
    casesList.style.marginTop = '30px';
    casesList.style.padding = '25px';
    casesList.style.backgroundColor = '#ffffff';
    casesList.style.borderRadius = '12px';
    casesList.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    casesList.style.transition = 'all 0.3s ease';
    casesList.style.border = '1px solid #e0e0e0';
    
    // 创建列表头部
    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';
    listHeader.style.display = 'flex';
    listHeader.style.justifyContent = 'space-between';
    listHeader.style.alignItems = 'center';
    listHeader.style.marginBottom = '20px';
    listHeader.style.paddingBottom = '15px';
    listHeader.style.borderBottom = '1px solid #eaeaea';
    
    const headerTitleZh = document.createElement('h4');
    headerTitleZh.className = 'zh';
    headerTitleZh.textContent = '思政案例列表';
    headerTitleZh.style.fontSize = '18px';
    headerTitleZh.style.fontWeight = '600';
    headerTitleZh.style.color = '#333';
    headerTitleZh.style.margin = '0';
    
    const headerTitleEn = document.createElement('h4');
    headerTitleEn.className = 'en';
    headerTitleEn.textContent = 'Ideology Cases List';
    headerTitleEn.style.display = 'none';
    headerTitleEn.style.fontSize = '18px';
    headerTitleEn.style.fontWeight = '600';
    headerTitleEn.style.color = '#333';
    headerTitleEn.style.margin = '0';
    
    const createCaseBtn = document.createElement('button');
    createCaseBtn.id = 'createCaseBtn';
    createCaseBtn.className = 'red-btn';
    createCaseBtn.innerHTML = '<i class="fas fa-save"></i> <span class="zh">保存案例</span> <span class="en">Save Case</span>';
    
    listHeader.appendChild(headerTitleZh);
    listHeader.appendChild(headerTitleEn);
    listHeader.appendChild(createCaseBtn);
    
    // 创建表格
    const casesTable = document.createElement('table');
    casesTable.className = 'cases-table';
    casesTable.style.width = '100%';
    casesTable.style.borderCollapse = 'collapse';
    casesTable.style.borderSpacing = '0';
    
    // 创建表头
    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headerNum = document.createElement('th');
    headerNum.textContent = '序号';
    headerNum.style.width = '60px';
    headerNum.style.padding = '12px 15px';
    headerNum.style.textAlign = 'left';
    headerNum.style.fontWeight = '600';
    headerNum.style.fontSize = '14px';
    headerNum.style.color = '#555';
    headerNum.style.backgroundColor = '#f5f7fa';
    headerNum.style.borderBottom = '1px solid #e0e0e0';
    
    const headerTitle = document.createElement('th');
    headerTitle.textContent = '案例标题';
    headerTitle.style.padding = '12px 15px';
    headerTitle.style.textAlign = 'left';
    headerTitle.style.fontWeight = '600';
    headerTitle.style.fontSize = '14px';
    headerTitle.style.color = '#555';
    headerTitle.style.backgroundColor = '#f5f7fa';
    headerTitle.style.borderBottom = '1px solid #e0e0e0';
    
    const headerResource = document.createElement('th');
    headerResource.textContent = '关联资源';
    headerResource.style.width = '100px';
    headerResource.style.padding = '12px 15px';
    headerResource.style.textAlign = 'left';
    headerResource.style.fontWeight = '600';
    headerResource.style.fontSize = '14px';
    headerResource.style.color = '#555';
    headerResource.style.backgroundColor = '#f5f7fa';
    headerResource.style.borderBottom = '1px solid #e0e0e0';
    
    const headerAction = document.createElement('th');
    headerAction.textContent = '操作';
    headerAction.style.width = '120px';
    headerAction.style.padding = '12px 15px';
    headerAction.style.textAlign = 'left';
    headerAction.style.fontWeight = '600';
    headerAction.style.fontSize = '14px';
    headerAction.style.color = '#555';
    headerAction.style.backgroundColor = '#f5f7fa';
    headerAction.style.borderBottom = '1px solid #e0e0e0';
    
    headerRow.appendChild(headerNum);
    headerRow.appendChild(headerTitle);
    headerRow.appendChild(headerResource);
    headerRow.appendChild(headerAction);
    tableHead.appendChild(headerRow);
    
    // 创建表格主体
    const tableBody = document.createElement('tbody');
    
    // 添加示例行
    const exampleRow = document.createElement('tr');
    exampleRow.dataset.caseId = 'example1';
    
    const numCell = document.createElement('td');
    numCell.textContent = '1';
    numCell.style.padding = '12px 15px';
    numCell.style.borderBottom = '1px solid #eaeaea';
    
    const titleCell = document.createElement('td');
    titleCell.style.padding = '12px 15px';
    titleCell.style.borderBottom = '1px solid #eaeaea';
    
    const titleZh = document.createElement('p');
    titleZh.className = 'zh';
    titleZh.textContent = '老茶馆的新生机';
    titleZh.style.margin = '0';
    titleZh.style.fontWeight = '500';
    
    const titleEn = document.createElement('p');
    titleEn.className = 'en';
    titleEn.textContent = 'New Vitality of Old Teahouse';
    titleEn.style.display = 'none';
    titleEn.style.margin = '0';
    titleEn.style.fontWeight = '500';
    
    titleCell.appendChild(titleZh);
    titleCell.appendChild(titleEn);
    
    const resourceCell = document.createElement('td');
    resourceCell.style.padding = '12px 15px';
    resourceCell.style.borderBottom = '1px solid #eaeaea';
    
    const resourceTags = document.createElement('div');
    resourceTags.className = 'resource-tags';
    
    const imageTag = document.createElement('span');
    imageTag.className = 'resource-tag image';
    imageTag.innerHTML = '<i class="fas fa-image"></i>';
    imageTag.style.display = 'inline-block';
    imageTag.style.margin = '0 4px 4px 0';
    imageTag.style.padding = '4px 8px';
    imageTag.style.borderRadius = '4px';
    imageTag.style.fontSize = '12px';
    imageTag.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
    imageTag.style.color = '#1976d2';
    imageTag.style.cursor = 'pointer';
    
    const videoTag = document.createElement('span');
    videoTag.className = 'resource-tag video';
    videoTag.innerHTML = '<i class="fas fa-video"></i>';
    videoTag.style.display = 'inline-block';
    videoTag.style.margin = '0 4px 4px 0';
    videoTag.style.padding = '4px 8px';
    videoTag.style.borderRadius = '4px';
    videoTag.style.fontSize = '12px';
    videoTag.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    videoTag.style.color = '#4caf50';
    videoTag.style.cursor = 'pointer';
    
    resourceTags.appendChild(imageTag);
    resourceTags.appendChild(videoTag);
    resourceCell.appendChild(resourceTags);
    
    const actionCell = document.createElement('td');
    actionCell.style.padding = '12px 15px';
    actionCell.style.borderBottom = '1px solid #eaeaea';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'case-action-btn view';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.style.width = '32px';
    viewBtn.style.height = '32px';
    viewBtn.style.padding = '0';
    viewBtn.style.margin = '0 4px';
    viewBtn.style.border = 'none';
    viewBtn.style.borderRadius = '4px';
    viewBtn.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
    viewBtn.style.color = '#1976d2';
    viewBtn.style.cursor = 'pointer';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'case-action-btn edit';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.style.width = '32px';
    editBtn.style.height = '32px';
    editBtn.style.padding = '0';
    editBtn.style.margin = '0 4px';
    editBtn.style.border = 'none';
    editBtn.style.borderRadius = '4px';
    editBtn.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
    editBtn.style.color = '#ff9800';
    editBtn.style.cursor = 'pointer';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'case-action-btn delete';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.style.width = '32px';
    deleteBtn.style.height = '32px';
    deleteBtn.style.padding = '0';
    deleteBtn.style.margin = '0 4px';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
    deleteBtn.style.color = '#f44336';
    deleteBtn.style.cursor = 'pointer';
    
    actionCell.appendChild(viewBtn);
    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);
    
    exampleRow.appendChild(numCell);
    exampleRow.appendChild(titleCell);
    exampleRow.appendChild(resourceCell);
    exampleRow.appendChild(actionCell);
    
    tableBody.appendChild(exampleRow);
    
    casesTable.appendChild(tableHead);
    casesTable.appendChild(tableBody);
    
    casesList.appendChild(listHeader);
    casesList.appendChild(casesTable);
    
    // 添加到页面
    ideologyContent.appendChild(casesList);
    
    console.log('思政案例列表HTML结构初始化完成');
}

// 导出到全局
window.initIdeologyCasesListHTML = initIdeologyCasesListHTML; 