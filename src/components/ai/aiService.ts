import { v4 as uuidv4 } from 'uuid';
import { 
  getAiConfig, 
  getApiKey, 
  ApiProvider, 
  apiProviders 
} from './aiConfig';

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
}

export const aiService = new AIService();
export default aiService; 