import { v4 as uuidv4 } from 'uuid';
import { 
  getAiConfig, 
  getApiKey, 
  ApiProvider, 
  apiProviders 
} from './aiConfig';
import { Material, Comment } from '@/modules/materials/types/materials';

// 消息类型定义
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

// API请求接口
interface ApiRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

// 简单AI回复生成器（当未设置API密钥时使用）
const simpleResponses = [
  '思维导图是一种可视化思考工具，帮助你组织和理解信息。',
  '你可以使用思维导图来进行头脑风暴、做笔记、项目规划等。',
  '思维导图的中心节点代表主题，分支节点代表相关概念。',
  '创建思维导图时，可以使用不同的颜色和图标来增强视觉效果。',
  '思维导图的结构可以帮助你更好地记住和理解复杂的信息。',
  '在学习新概念时，思维导图可以帮助你将新知识与已有知识联系起来。',
  '思维导图可以帮助你识别不同概念之间的联系和模式。',
  '你可以在我们的应用中创建各种风格的思维导图，包括辐射型、树状和有机型。',
];

// 初始化历史会话消息
let conversationHistory: { role: string; content: string }[] = [];

// AI服务实现
class AIService {
  constructor() {
    this.resetConversation(); // 初始化对话历史
  }
  
  // 获取当前配置
  private getConfig() {
    return getAiConfig();
  }
  
  // 获取当前API提供商信息
  private getCurrentProviderInfo() {
    const config = this.getConfig();
    return apiProviders[config.apiProvider];
  }
  
  // 重置对话历史
  public resetConversation(): void {
    const config = this.getConfig();
    conversationHistory = [
      {
        role: 'system',
        content: config.systemPrompt
      }
    ];
  }
  
  // 获取初始问候消息
  public getInitialGreeting(): Message {
    const config = this.getConfig();
    return {
      id: '1',
      content: config.defaultGreeting,
      role: 'assistant',
      timestamp: new Date()
    };
  }
  
  // 生成简单回复（用于本地模式或API调用失败时）
  private generateSimpleResponse(prompt: string): Message {
    // 根据问题生成简单回复
    let response: string;
    
    if (prompt.includes('怎么') || prompt.includes('如何') || prompt.includes('创建')) {
      response = '创建思维导图时，先确定中心主题，然后添加相关的主要分支，再逐步扩展次级分支。你可以在我们的应用中通过点击"+"按钮来添加新节点，拖拽节点来调整位置。';
    } else if (prompt.includes('优点') || prompt.includes('好处')) {
      response = '思维导图的主要优点包括：可视化信息、促进创造性思考、帮助记忆、增强理解力、简化复杂概念，以及提高学习和工作效率。';
    } else if (prompt.includes('导出') || prompt.includes('分享')) {
      response = '你可以通过点击应用右上角的"导出"按钮，将思维导图导出为PNG、PDF或SVG格式，或者点击"分享"按钮生成可分享的链接。';
    } else {
      // 随机选择一个通用回复
      const randomIndex = Math.floor(Math.random() * simpleResponses.length);
      response = simpleResponses[randomIndex];
    }
    
    return {
      id: uuidv4(),
      content: response,
      role: 'assistant',
      timestamp: new Date()
    };
  }
  
  // 调用API
  private async callApi(messages: { role: string; content: string }[]): Promise<string> {
    const config = this.getConfig();
    const provider = config.apiProvider;
    
    // 如果是本地模式，直接返回简单回复
    if (provider === 'local') {
      // 使用兼容性更好的方式查找最后一条用户消息
      const userMessages = messages.filter(m => m.role === 'user');
      const lastUserMessage = userMessages.length > 0 
        ? userMessages[userMessages.length - 1].content 
        : '';
      return this.generateSimpleResponse(lastUserMessage).content;
    }
    
    const apiKey = getApiKey(provider);
    if (!apiKey) {
      throw new Error(`未设置${apiProviders[provider].name}的API密钥`);
    }
    
    const providerInfo = this.getCurrentProviderInfo();
    const apiUrl = providerInfo.apiUrl;
    
    const requestBody: ApiRequest = {
      model: config.modelId,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    };
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${providerInfo.name} API错误: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // 不同API可能有不同的响应格式，需要适配
      let content = '';
      if (provider === 'openai') {
        content = data.choices[0].message.content;
      } else if (provider === 'deepseek') {
        content = data.choices[0].message.content;
      } else if (provider === 'doubao') {
        content = data.data.choices[0].message.content;
      } else {
        content = data.choices?.[0]?.message?.content || '获取回复失败';
      }
      
      return content;
    } catch (error) {
      console.error(`${providerInfo.name} API调用失败:`, error);
      throw error;
    }
  }
  
  // 获取AI响应
  public async getResponse(userPrompt: string): Promise<Message> {
    try {
      // 添加用户消息到历史
      conversationHistory.push({
        role: 'user',
        content: userPrompt
      });
      
      let responseContent: string;
      const config = this.getConfig();
      
      try {
        // 调用选定的API获取响应
        responseContent = await this.callApi(conversationHistory);
      } catch (error) {
        console.error('API调用失败，使用本地回复:', error);
        // 如果API调用失败，回退到简单回复
        if (config.apiProvider !== 'local') {
          const simpleResponse = this.generateSimpleResponse(userPrompt);
          responseContent = simpleResponse.content;
        } else {
          throw error; // 如果是本地模式出错，继续抛出异常
        }
      }
      
      // 添加到历史对话中
      conversationHistory.push({
        role: 'assistant',
        content: responseContent
      });
      
      return {
        id: uuidv4(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('获取AI响应失败:', error);
      throw error;
    }
  }
  
  // 获取所有支持的API提供商
  public getProviders() {
    return apiProviders;
  }
  
  // 获取当前API提供商
  public getCurrentProvider(): ApiProvider {
    return this.getConfig().apiProvider;
  }
  
  // 获取当前选择的模型ID
  public getCurrentModelId(): string {
    return this.getConfig().modelId;
  }

  // ==================== AITools功能 ====================

  /**
   * 根据资料内容自动生成思维导图初始结构
   * @param material 上传的资料内容
   * @returns 生成的思维导图节点和边
   */
  public async generateMindMapFromMaterial(material: Material): Promise<{nodes: any[], edges: any[]}> {
    try {
      // 准备提示词
      const prompt = `请根据以下资料内容生成一个思维导图的结构，包括中心主题和主要分支。
资料标题: ${material.title}
资料描述: ${material.description}
资料标签: ${material.tags?.join(', ')}
      
请以JSON格式返回思维导图的节点和连接，格式如下:
{
  "centralTopic": "中心主题名称",
  "mainBranches": [
    {"id": "1", "topic": "主要分支1", "children": [{"id": "1-1", "topic": "子主题1"}]},
    {"id": "2", "topic": "主要分支2", "children": []}
  ]
}
只返回JSON，不要有任何其他文字。`;

      // 使用现有的API调用方法，但包装在一个特殊的消息中
      const specialConversation = [
        {
          role: 'system',
          content: '你是思维导图生成专家，请根据资料内容分析主题和逻辑结构，生成合适的思维导图大纲。'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const jsonResponse = await this.callApi(specialConversation);
      
      // 解析JSON响应
      let mindmapStructure;
      try {
        // 尝试提取JSON部分（防止AI返回了额外文本）
        const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mindmapStructure = JSON.parse(jsonMatch[0]);
        } else {
          mindmapStructure = JSON.parse(jsonResponse);
        }
      } catch (error) {
        console.error("解析AI生成的思维导图结构失败:", error);
        throw new Error("解析AI生成的思维导图结构失败，请重试");
      }
      
      // 将AI返回的结构转换为应用需要的节点和边格式
      const nodes = [];
      const edges = [];
      
      // 添加中心节点
      const centralNode = {
        id: 'root',
        type: 'materialNode',
        data: { 
          label: mindmapStructure.centralTopic,
          icon: 'Brain',
          materials: [material.id] // 将资料关联到根节点
        },
        position: { x: 400, y: 300 },
        style: {
          background: '#f0f4ff',
          border: '2px solid hsl(var(--primary))',
          color: 'hsl(var(--primary))',
          width: 180,
          height: 80,
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold',
        }
      };
      nodes.push(centralNode);
      
      // 添加主要分支和子节点
      const addNodeAndEdges = (parentId, branches, startX, startY, level = 1) => {
        const nodeWidth = 150;
        const nodeHeight = 60;
        const horizontalSpacing = 250;
        const verticalSpacing = 100;
        
        branches.forEach((branch, index) => {
          const branchX = startX + horizontalSpacing;
          const branchY = startY - (branches.length - 1) * verticalSpacing / 2 + index * verticalSpacing;
          
          // 添加分支节点
          const branchNode = {
            id: branch.id,
            type: 'materialNode',
            data: { 
              label: branch.topic,
              icon: level === 1 ? 'FileText' : 'Circle',
              materials: []
            },
            position: { x: branchX, y: branchY },
            style: {
              background: level === 1 ? '#f0f9ff' : '#f9f9f9',
              border: `1px solid ${level === 1 ? 'hsl(var(--primary))' : '#ddd'}`,
              color: 'hsl(var(--foreground))',
              width: nodeWidth,
              height: nodeHeight,
              padding: '10px',
              borderRadius: '8px',
            }
          };
          nodes.push(branchNode);
          
          // 添加连接边
          edges.push({
            id: `e-${parentId}-${branch.id}`,
            source: parentId,
            target: branch.id,
            type: 'smoothstep',
            animated: false,
            style: { stroke: 'hsl(var(--primary))' }
          });
          
          // 递归处理子节点
          if (branch.children && branch.children.length > 0) {
            addNodeAndEdges(branch.id, branch.children, branchX, branchY, level + 1);
          }
        });
      };
      
      // 处理所有主分支
      if (mindmapStructure.mainBranches && mindmapStructure.mainBranches.length > 0) {
        addNodeAndEdges('root', mindmapStructure.mainBranches, centralNode.position.x, centralNode.position.y);
      }
      
      return { nodes, edges };
    } catch (error) {
      console.error("生成思维导图失败:", error);
      throw error;
    }
  }

  /**
   * 整理讨论区的信息为结构化笔记
   * @param comments 讨论区评论
   * @returns 结构化笔记内容
   */
  public async organizeDiscussionNotes(comments: Comment[]): Promise<string> {
    try {
      // 整理评论内容
      const commentsText = comments.map(comment => {
        return `用户 ${comment.userName} 在 ${new Date(comment.timestamp).toLocaleString()} 评论：${comment.content}`;
      }).join('\n\n');
      
      // 准备提示词
      const prompt = `请将以下讨论区的评论整理为结构化的学习笔记，重点提取有价值的信息，按主题分类：
      
${commentsText}

请以Markdown格式整理笔记，包括：
1. 主要讨论主题概述
2. 按主题分类的重点内容
3. 重要观点总结
4. 有价值的资源链接（如果有的话）`;

      // 使用现有的API调用方法，封装特殊会话
      const specialConversation = [
        {
          role: 'system',
          content: '你是一名专业的信息整理专家，擅长从讨论中提取有价值的信息并整理成结构化的笔记。'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await this.callApi(specialConversation);
      return response;
    } catch (error) {
      console.error("整理讨论笔记失败:", error);
      throw error;
    }
  }

  /**
   * 根据用户历史生成个性化学习路径推荐
   * @param userViewHistory 用户浏览历史
   * @param availableMindMaps 可用的思维导图列表
   * @param availableMaterials 可用的学习资料列表
   * @returns 推荐的学习路径和资料
   */
  public async generateLearningPathRecommendations(
    userViewHistory: any[],
    availableMindMaps: any[],
    availableMaterials: Material[]
  ): Promise<{recommendedMindMaps: any[], recommendedMaterials: Material[], learningPath: string}> {
    try {
      // 提取用户历史中的关键信息
      const historyTopics = userViewHistory.map(item => {
        return item.title || item.topic || '';
      }).filter(Boolean);
      
      const historyTags = userViewHistory.flatMap(item => item.tags || []);
      
      // 准备提示词
      const mindmapInfo = availableMindMaps.map(map => `思维导图: ${map.title}, 标签: ${map.tags?.join(', ') || '无'}`).join('\n');
      const materialsInfo = availableMaterials.map(mat => `资料: ${mat.title}, 标签: ${mat.tags?.join(', ') || '无'}`).join('\n');
      
      const prompt = `根据用户的浏览历史，推荐个性化的学习路径和相关资料。
      
用户浏览过的主题: ${historyTopics.join(', ')}
用户感兴趣的标签: ${[...new Set(historyTags)].join(', ')}

可用的思维导图和资料:
${mindmapInfo}
${materialsInfo}

请以JSON格式返回推荐结果:
{
  "recommendedMindMapIds": [思维导图ID数组],
  "recommendedMaterialIds": [资料ID数组],
  "learningPathSuggestion": "推荐的学习路径描述"
}
只返回JSON，不要有任何其他文字。`;

      // 使用现有的API调用，特殊会话
      const specialConversation = [
        {
          role: 'system',
          content: '你是一名个性化学习路径规划专家，擅长根据用户的学习历史和兴趣推荐适合的学习内容和路径。'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const jsonResponse = await this.callApi(specialConversation);
      
      // 解析JSON响应
      let recommendation;
      try {
        // 尝试提取JSON部分
        const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendation = JSON.parse(jsonMatch[0]);
        } else {
          recommendation = JSON.parse(jsonResponse);
        }
      } catch (error) {
        console.error("解析AI生成的推荐失败:", error);
        throw new Error("解析AI生成的推荐失败，请重试");
      }
      
      // 查找推荐的思维导图和资料
      const recommendedMindMaps = availableMindMaps.filter(map => 
        recommendation.recommendedMindMapIds.includes(map.id)
      );
      
      const recommendedMaterials = availableMaterials.filter(mat => 
        recommendation.recommendedMaterialIds.includes(mat.id)
      );
      
      return {
        recommendedMindMaps,
        recommendedMaterials,
        learningPath: recommendation.learningPathSuggestion
      };
    } catch (error) {
      console.error("生成学习路径推荐失败:", error);
      throw error;
    }
  }
}

export const aiService = new AIService();
export default aiService; 
