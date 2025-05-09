import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Mindmap } from './entities/mindmap.entity';
import { MindmapNode } from './entities/mindmap-node.entity';
import { KnowledgePoint } from './entities/knowledge-point.entity';
import { MindmapKnowledgeRelation } from './entities/mindmap-knowledge-relation.entity';
import { CreateMindmapDto } from './dto/create-mindmap.dto';
import { AiService } from '../ai/ai.service';
import { AiChatMessage } from '../ai/interfaces/ai.interfaces';

@Injectable()
export class MindmapService {
  constructor(
    @InjectRepository(Mindmap)
    private readonly mindmapRepository: Repository<Mindmap>,
    @InjectRepository(MindmapNode)
    private readonly mindmapNodeRepository: Repository<MindmapNode>,
    @InjectRepository(KnowledgePoint)
    private readonly knowledgePointRepository: Repository<KnowledgePoint>,
    @InjectRepository(MindmapKnowledgeRelation)
    private readonly relationRepository: Repository<MindmapKnowledgeRelation>,
    private readonly aiService: AiService,
  ) {}

  async create(createMindmapDto: CreateMindmapDto) {
    const { 
      title, 
      central_topic, 
      selectedKnowledgePoints, 
      max_levels, 
      style, 
      keywords,
      user_id 
    } = createMindmapDto;
    
    // 查询选中的知识点是否存在
    const knowledgePoints = await this.knowledgePointRepository.findBy({
      id: In(selectedKnowledgePoints),
      is_deleted: 0
    });
    
    if (knowledgePoints.length !== selectedKnowledgePoints.length) {
      throw new BadRequestException('部分知识点不存在');
    }
    
    // 创建思维导图主记录
    const mindmap = this.mindmapRepository.create({
      title,
      central_topic,
      user_id,
      max_levels,
      style
    });
    
    // 保存思维导图
    const savedMindmap = await this.mindmapRepository.save(mindmap);
    
    // 创建中心节点
    const rootNode = this.mindmapNodeRepository.create({
      mindmap_id: savedMindmap.id,
      name: central_topic,
      value: central_topic,
      level: 0,
      position: 0
    });
    
    await this.mindmapNodeRepository.save(rootNode);
    
    // 生成思维导图结构
    const keywordsList = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [];
    
    // 创建知识点关联
    const relations = selectedKnowledgePoints.map(kpId => {
      return this.relationRepository.create({
        mindmap_id: savedMindmap.id,
        knowledge_id: kpId
      });
    });
    
    await this.relationRepository.save(relations);
    
    // 根据知识点生成树结构
    for (const kp of knowledgePoints) {
      // 创建一级节点 - 知识点标题
      const level1Node = this.mindmapNodeRepository.create({
        mindmap_id: savedMindmap.id,
        name: kp.title,
        value: kp.title,
        parent_id: rootNode.id,
        level: 1,
        position: knowledgePoints.indexOf(kp)
      });
      
      const savedLevel1Node = await this.mindmapNodeRepository.save(level1Node);
      
      // 创建二级节点 - 从知识点关键词创建
      const kpKeywords = kp.keywords ? kp.keywords.split(',').map(k => k.trim()) : [];
      
      for (let i = 0; i < Math.min(5, kpKeywords.length); i++) {
        const keyword = kpKeywords[i];
        const level2Node = this.mindmapNodeRepository.create({
          mindmap_id: savedMindmap.id,
          name: keyword,
          value: keyword,
          parent_id: savedLevel1Node.id,
          level: 2,
          position: i
        });
        
        await this.mindmapNodeRepository.save(level2Node);
        
        // 只为部分节点创建更深层次的结构
        if (i < 3 && level2Node.level < max_levels) {
          await this.generateChildNodes(
            savedMindmap.id, 
            level2Node.id, 
            level2Node.level + 1, 
            keywordsList, 
            keyword,
            max_levels
          );
        }
      }
    }
    
    return {
      id: savedMindmap.id,
      title: savedMindmap.title,
      central_topic: savedMindmap.central_topic,
      message: '思维导图创建成功'
    };
  }
  
  // 递归生成子节点
  private async generateChildNodes(
    mindmapId: number, 
    parentId: number, 
    level: number, 
    keywords: string[],
    contextTopic: string,
    maxLevels: number
  ) {
    if (level > maxLevels) return;
    
    // 根据层级确定子节点数量
    const childCount = Math.max(1, Math.min(4, 6 - level));
    
    for (let i = 0; i < childCount; i++) {
      let nodeName;
      
      // 使用不同策略生成节点名称
      if (keywords.length > 0 && Math.random() > 0.5) {
        // 使用用户提供的关键词
        const randomKeywordIndex = Math.floor(Math.random() * keywords.length);
        nodeName = keywords[randomKeywordIndex];
      } else {
        // 生成与父节点相关的名称
        nodeName = this.generateRelatedContent(contextTopic, level);
      }
      
      // 创建节点
      const childNode = this.mindmapNodeRepository.create({
        mindmap_id: mindmapId,
        name: nodeName,
        value: nodeName,
        parent_id: parentId,
        level: level,
        position: i
      });
      
      const savedNode = await this.mindmapNodeRepository.save(childNode);
      
      // 递归生成下一级节点
      if (level < maxLevels && Math.random() > 0.3) {
        await this.generateChildNodes(
          mindmapId, 
          savedNode.id, 
          level + 1, 
          keywords, 
          nodeName,
          maxLevels
        );
      }
    }
  }
  
  // 生成相关内容
  private generateRelatedContent(parentName: string, level: number): string {
    // 构建通用内容库
    const contentLibrary = {
      // 层级3的内容模板
      3: [
        `${parentName}的特点`,
        `${parentName}的分类`,
        `${parentName}的历史`,
        `${parentName}的应用`,
        `${parentName}的影响`,
        `${parentName}的表现`,
        `${parentName}的技法`,
        `${parentName}的元素`,
        `${parentName}的作用`
      ],
      // 层级4的内容模板
      4: [
        `${parentName}案例`,
        `${parentName}方法`,
        `${parentName}实践`,
        `代表作品`,
        `发展趋势`,
        `关键因素`,
        `设计原则`,
        `理论基础`,
        `典型特征`
      ],
      // 层级5的内容模板
      5: [
        `创新点`,
        `局限性`,
        `未来展望`,
        `评价标准`,
        `实施要点`,
        `注意事项`,
        `相关资源`,
        `研究方向`,
        `经典案例`
      ]
    };

    // 根据当前层级选择内容模板
    const templates = contentLibrary[level] || contentLibrary[3];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  async findAll(userId?: number) {
    const query = this.mindmapRepository.createQueryBuilder('mindmap')
      .where('mindmap.is_deleted = :isDeleted', { isDeleted: 0 });
    
    if (userId) {
      query.andWhere('mindmap.user_id = :userId', { userId });
    }
    
    return query
      .orderBy('mindmap.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    const mindmap = await this.mindmapRepository.findOne({ 
      where: { id, is_deleted: 0 }
    });
    
    if (!mindmap) {
      throw new NotFoundException(`思维导图 #${id} 不存在`);
    }
    
    // 获取所有节点
    const nodes = await this.mindmapNodeRepository.find({
      where: { mindmap_id: id, is_deleted: 0 },
      order: { level: 'ASC', position: 'ASC' }
    });
    
    // 构建树结构
    const rootNode = nodes.find(node => node.level === 0);
    if (!rootNode) {
      throw new NotFoundException(`思维导图 #${id} 根节点丢失`);
    }
    
    // 递归构建树
    const tree = this.buildTree(rootNode, nodes);
    
    // 获取关联的知识点
    const knowledgeRelations = await this.relationRepository.find({
      where: { mindmap_id: id },
      relations: ['knowledge']
    });
    
    const knowledgePoints = knowledgeRelations.map(relation => relation.knowledge);
    
    return {
      id: mindmap.id,
      title: mindmap.title,
      central_topic: mindmap.central_topic,
      style: mindmap.style,
      max_levels: mindmap.max_levels,
      created_at: mindmap.created_at,
      updated_at: mindmap.updated_at,
      tree,
      knowledgePoints
    };
  }
  
  // 构建树结构
  private buildTree(node: MindmapNode, allNodes: MindmapNode[]) {
    const children = allNodes.filter(n => n.parent_id === node.id);
    
    // 转换为树形结构
    const result = {
      name: node.name,
      value: node.value,
      children: children.length > 0 ? children.map(child => this.buildTree(child, allNodes)) : undefined
    };
    
    return result;
  }

  async getKnowledgePoints(category?: string) {
    const query = this.knowledgePointRepository.createQueryBuilder('kp')
      .where('kp.is_deleted = :isDeleted', { isDeleted: 0 });
    
    if (category) {
      query.andWhere('kp.category = :category', { category });
    }
    
    return query.getMany();
  }

  async getKnowledgePointById(id: number) {
    const knowledgePoint = await this.knowledgePointRepository.findOne({
      where: { id, is_deleted: 0 }
    });
    
    if (!knowledgePoint) {
      throw new NotFoundException(`知识点 #${id} 不存在`);
    }
    
    return knowledgePoint;
  }

  async remove(id: number) {
    const mindmap = await this.mindmapRepository.findOne({
      where: { id, is_deleted: 0 }
    });
    
    if (!mindmap) {
      throw new NotFoundException(`思维导图 #${id} 不存在`);
    }
    
    // 软删除
    mindmap.is_deleted = 1;
    await this.mindmapRepository.save(mindmap);
    
    return { message: '思维导图删除成功' };
  }

  /**
   * 使用AI生成思维导图节点
   * @param {string} centralTopic 中心主题
   * @param {level} level 层级
   * @param {number} maxNodes 最大节点数
   * @returns {Promise<string[]>} 生成的节点数组
   */
  async generateNodesWithAI(centralTopic: string, level: number, maxNodes: number = 5): Promise<string[]> {
    // 根据层级构建不同的提示词
    let prompt = '';
    
    if (level === 1) {
      // 第一层级 - 创建主要分类
      prompt = `
请基于"${centralTopic}"这个中心主题，创造性地生成${maxNodes}个思维导图第一层级的主要分类或方向。
这些分类应该从不同角度全面地拓展这个主题，体现知识的广度和系统性。
分类之间应相互独立，共同构成对"${centralTopic}"的完整认识体系。
直接返回JSON格式的节点名称数组，不要有任何额外解释，格式如下：
["主要分类1", "主要分类2", "主要分类3", ...]
`;
    } else if (level === 2) {
      // 第二层级 - 深入探讨每个分类
      prompt = `
请基于"${centralTopic}"这个主题，深入挖掘并生成${maxNodes}个相关的子主题或要点。
这些子主题应该具体、精确、有见解，能够深入阐述父主题的内涵，表现知识的深度。
可以包括：定义解释、特点要素、分类类型、发展脉络、应用案例等多个维度。
直接返回JSON格式的节点名称数组，不要有任何额外解释，格式如下：
["子主题1", "子主题2", "子主题3", ...]
`;
    } else {
      // 更深层级 - 提供细节和具体案例
      prompt = `
请基于"${centralTopic}"这个具体主题，生成${maxNodes}个更深层次的详细内容点。
这些内容应该非常具体，可以是案例、数据、观点、方法、实践等，能够丰富父主题的理解。
内容应该简洁精炼，每个点不超过8个字，但要信息量充足、有启发性。
直接返回JSON格式的节点名称数组，不要有任何额外解释，格式如下：
["详细点1", "详细点2", "详细点3", ...]
`;
    }

    const messages: AiChatMessage[] = [
      { 
        role: 'system', 
        content: '你是一个专业的知识拓展与思维导图生成专家，擅长将知识点系统化、结构化，并创造性地拓展知识边界。你理解中国文化、教育理论和知识构建的原则，能够生成有深度、有广度、有创新性的知识结构。请只返回要求的JSON格式数据。' 
      },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.aiService.generateChatResponse(messages);
      // 解析返回的JSON字符串为数组
      let nodeNames: string[] = [];
      try {
        const content = response.content.trim();
        // 提取JSON字符串（移除可能存在的代码块标记）
        const jsonStr = content.replace(/```json\s*|\s*```/g, '');
        nodeNames = JSON.parse(jsonStr);
        
        // 确保节点名称不为空且长度适中
        nodeNames = nodeNames
          .filter(name => name && name.trim().length > 0)
          .map(name => name.trim().length > 15 ? name.trim().substring(0, 15) : name.trim());
          
        // 确保有足够的节点（如果AI返回的少于请求的）
        if (nodeNames.length < maxNodes) {
          const defaultNodes = this.generateDefaultNodes(centralTopic, level, maxNodes - nodeNames.length);
          nodeNames = [...nodeNames, ...defaultNodes];
        }
        
        // 限制最大数量
        nodeNames = nodeNames.slice(0, maxNodes);
      } catch (error) {
        console.error('解析AI生成的节点失败:', error);
        // 回退到默认节点
        nodeNames = this.generateDefaultNodes(centralTopic, level, maxNodes);
      }
      
      return nodeNames;
    } catch (error) {
      console.error('AI服务生成节点失败:', error);
      // 回退到默认节点
      return this.generateDefaultNodes(centralTopic, level, maxNodes);
    }
  }
  
  /**
   * 生成默认节点（当AI生成失败时使用）
   * @param centralTopic 中心主题
   * @param level 层级
   * @param count 节点数量
   * @returns 默认节点数组
   */
  private generateDefaultNodes(centralTopic: string, level: number, count: number): string[] {
    // 根据不同层级提供默认节点模板
    const templates = {
      1: [
        `${centralTopic}的定义`,
        `${centralTopic}的历史`,
        `${centralTopic}的特点`,
        `${centralTopic}的分类`,
        `${centralTopic}的应用`,
        `${centralTopic}的影响`,
        `${centralTopic}的发展趋势`,
        `${centralTopic}的研究现状`
      ],
      2: [
        `主要概念`,
        `理论基础`,
        `发展阶段`,
        `代表人物`,
        `典型案例`,
        `关键技术`,
        `实践应用`,
        `研究方法`
      ],
      3: [
        `重要意义`,
        `核心要素`,
        `评价标准`,
        `创新点`,
        `局限性`,
        `改进方向`,
        `相关资源`,
        `经典案例`
      ]
    };
    
    // 获取对应层级的模板，默认使用第一层级模板
    const levelTemplates = templates[level] || templates[1];
    
    // 返回指定数量的默认节点
    return levelTemplates.slice(0, count);
  }

  /**
   * AI辅助生成思维导图
   * @param {CreateMindmapDto} createMindmapDto 创建思维导图DTO
   * @returns 创建结果
   */
  async createWithAI(createMindmapDto: CreateMindmapDto) {
    const { 
      title, 
      central_topic, 
      selectedKnowledgePoints, 
      max_levels, 
      style, 
      keywords,
      user_id 
    } = createMindmapDto;
    
    // 查询选中的知识点以获取背景知识
    const knowledgePoints = await this.knowledgePointRepository.findBy({
      id: In(selectedKnowledgePoints || []),
      is_deleted: 0
    });
    
    // 创建思维导图主记录
    const mindmap = this.mindmapRepository.create({
      title,
      central_topic,
      user_id,
      max_levels: max_levels || 4,
      style: style || 'standard'
    });
    
    // 保存思维导图
    const savedMindmap = await this.mindmapRepository.save(mindmap);
    
    // 创建中心节点
    const rootNode = this.mindmapNodeRepository.create({
      mindmap_id: savedMindmap.id,
      name: central_topic,
      value: central_topic,
      level: 0,
      position: 0
    });
    
    await this.mindmapNodeRepository.save(rootNode);
    
    // 处理关键词
    const keywordsList = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : [];
    
    // 创建知识点关联
    if (selectedKnowledgePoints && selectedKnowledgePoints.length > 0) {
    const relations = selectedKnowledgePoints.map(kpId => {
      return this.relationRepository.create({
        mindmap_id: savedMindmap.id,
        knowledge_id: kpId
      });
    });
    
    await this.relationRepository.save(relations);
    }
    
    // 使用AI生成一级节点 - 基于中心主题
    const nodeCount = Math.min(6, Math.max(4, knowledgePoints.length || 5));
    const level1NodeNames = await this.generateNodesWithAI(central_topic, 1, nodeCount);
    
    // 创建一级节点
    for (let i = 0; i < level1NodeNames.length; i++) {
      const level1Node = this.mindmapNodeRepository.create({
        mindmap_id: savedMindmap.id,
        name: level1NodeNames[i],
        value: level1NodeNames[i],
        parent_id: rootNode.id,
        level: 1,
        position: i
      });
      
      const savedLevel1Node = await this.mindmapNodeRepository.save(level1Node);
      
      // 使用AI生成二级节点 - 基于一级节点主题
      const level2Count = Math.min(5, Math.max(3, 6 - i)); // 重要的分支生成更多节点
      const level2NodeNames = await this.generateNodesWithAI(level1NodeNames[i], 2, level2Count);
      
      // 创建二级节点
      for (let j = 0; j < level2NodeNames.length; j++) {
        const level2Node = this.mindmapNodeRepository.create({
          mindmap_id: savedMindmap.id,
          name: level2NodeNames[j],
          value: level2NodeNames[j],
          parent_id: savedLevel1Node.id,
          level: 2,
          position: j
        });
        
        const savedLevel2Node = await this.mindmapNodeRepository.save(level2Node);
        
        // 只为前两个二级节点创建三级节点且仅当最大层级>=3时
        const maxLevels = max_levels || 4;
        if (j < 2 && maxLevels >= 3) {
          // 使用AI生成三级节点
          const level3Count = Math.min(3, Math.max(2, 4 - j));
          const level3NodeNames = await this.generateNodesWithAI(level2NodeNames[j], 3, level3Count);
          
          // 创建三级节点
          for (let k = 0; k < level3NodeNames.length; k++) {
            const level3Node = this.mindmapNodeRepository.create({
              mindmap_id: savedMindmap.id,
              name: level3NodeNames[k],
              value: level3NodeNames[k],
              parent_id: savedLevel2Node.id,
              level: 3,
              position: k
            });
            
            await this.mindmapNodeRepository.save(level3Node);
          }
        }
      }
    }
    
    return {
      id: savedMindmap.id,
      title: savedMindmap.title,
      central_topic: savedMindmap.central_topic,
      message: '思维导图创建成功'
    };
  }

  /**
   * 保存思维导图并关联章节
   * @param {any} mindmapData 思维导图数据
   * @param {number} chapterId 章节ID
   * @param {string} title 标题
   * @param {string} centralTopic 中心主题
   * @returns 保存结果
   */
  async saveMindmapWithChapter(
    mindmapData: any, 
    chapterId: number, 
    title: string, 
    centralTopic: string
  ) {
    try {
      // 创建思维导图主记录
      const mindmap = this.mindmapRepository.create({
        title,
        central_topic: centralTopic,
        user_id: null, // 可以根据需要添加用户ID
        max_levels: 4,
        style: 'standard',
        chapter_id: chapterId // 添加章节ID关联
      });
      
      // 保存思维导图
      const savedMindmap = await this.mindmapRepository.save(mindmap);
      
      // 创建根节点
      const rootNode = this.mindmapNodeRepository.create({
        mindmap_id: savedMindmap.id,
        name: mindmapData.name || centralTopic,
        value: mindmapData.value || centralTopic,
        level: 0,
        position: 0
      });
      
      const savedRootNode = await this.mindmapNodeRepository.save(rootNode);
      
      // 递归保存所有子节点
      if (mindmapData.children && Array.isArray(mindmapData.children) && mindmapData.children.length > 0) {
        await this.saveChildNodes(savedMindmap.id, savedRootNode.id, mindmapData.children, 1);
      }
      
      return {
        id: savedMindmap.id,
        title: savedMindmap.title,
        central_topic: savedMindmap.central_topic,
        chapter_id: chapterId,
        message: '思维导图保存成功并关联到章节'
      };
    } catch (error) {
      console.error('保存思维导图失败:', error);
      throw new Error(`保存思维导图失败: ${error.message}`);
    }
  }
  
  /**
   * 递归保存子节点
   * @param {number} mindmapId 思维导图ID
   * @param {number} parentId 父节点ID
   * @param {Array} children 子节点数组
   * @param {number} level 当前层级
   */
  private async saveChildNodes(mindmapId: number, parentId: number, children: any[], level: number) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      
      // 创建节点
      const node = this.mindmapNodeRepository.create({
        mindmap_id: mindmapId,
        name: child.name || `节点${i+1}`,
        value: child.value || child.name || `节点${i+1}`,
        parent_id: parentId,
        level,
        position: i
      });
      
      const savedNode = await this.mindmapNodeRepository.save(node);
      
      // 递归处理子节点
      if (child.children && Array.isArray(child.children) && child.children.length > 0) {
        await this.saveChildNodes(mindmapId, savedNode.id, child.children, level + 1);
      }
    }
  }

  /**
   * 根据章节ID查找思维导图
   * @param {number} chapterId 章节ID
   * @returns 思维导图列表
   */
  async findByChapter(chapterId: number) {
    // 查询与章节关联的所有思维导图
    const mindmaps = await this.mindmapRepository.find({
      where: { chapter_id: chapterId, is_deleted: 0 },
      order: { created_at: 'DESC' }
    });
    
    // 格式化响应数据
    return mindmaps.map(mindmap => ({
      id: mindmap.id,
      title: mindmap.title,
      central_topic: mindmap.central_topic,
      created_at: mindmap.created_at,
      updated_at: mindmap.updated_at,
      type: 'mindmap' // 添加类型字段，标识为思维导图类型的知识拓展
    }));
  }

  /**
   * 只生成思维导图树结构，不保存到数据库
   * @param topic 主题
   * @param maxLevels 最大层级
   * @returns 思维导图树结构
   */
  async generateMindmapTree(topic: string, maxLevels: number = 3): Promise<any> {
    try {
      console.log(`生成思维导图树结构: ${topic}, 最大层级: ${maxLevels}`);
      
      // 构建思维导图树结构
      let treeData = await this.buildMindmapTree(topic, maxLevels);
      
      if (!treeData) {
        // 如果生成失败，使用基本结构
        treeData = {
          name: topic,
          children: [
            { name: '主要概念', children: [{ name: '概念1' }, { name: '概念2' }] },
            { name: '历史背景', children: [{ name: '起源' }, { name: '发展' }] },
            { name: '应用领域', children: [{ name: '领域1' }, { name: '领域2' }] },
            { name: '相关知识', children: [{ name: '知识点1' }, { name: '知识点2' }] }
          ]
        };
      }
      
      return treeData;
    } catch (error) {
      console.error('生成思维导图树结构失败:', error);
      // 返回基本结构
      return {
        name: topic,
        children: [
          { name: '基本信息', children: [{ name: '定义' }, { name: '特点' }] },
          { name: '相关内容', children: [{ name: '内容1' }, { name: '内容2' }] }
        ]
      };
    }
  }
  
  /**
   * 构建思维导图树结构
   * @param topic 主题
   * @param maxLevels 最大层级
   * @returns 思维导图树结构
   */
  private async buildMindmapTree(topic: string, maxLevels: number): Promise<any> {
    try {
      // 调用AI服务生成思维导图内容
      const aiData = await this.generateMindmapTree(topic, maxLevels);
      return aiData;
    } catch (error) {
      console.error('构建思维导图树失败:', error);
      throw error;
    }
  }
} 