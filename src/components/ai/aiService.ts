import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

class AiService {
  private readonly defaultResponses = [
    '思维导图可以帮助你组织思路，尝试在核心节点周围添加相关子主题。',
    '你可以使用不同颜色对不同类别的节点进行分类，这样可以提高可读性。',
    '对于复杂的主题，建议采用层次结构，从大的概念向下分解为更小的子概念。',
    '如果节点太多，可以考虑使用折叠功能来隐藏一些细节，保持画面整洁。',
    '记得定期保存你的思维导图，以免丢失重要内容。',
    '你可以使用关键词而不是长句子来表示节点，这样思维导图会更简洁。',
    '在创建思维导图时，从中心主题开始，然后向外扩展相关的子主题和概念。',
    '完成思维导图后，可以尝试分享给他人，获取反馈来完善你的想法。',
    '思维导图不仅适用于学习，也适用于项目规划、会议记录等多种场景。',
    '定期回顾和修改你的思维导图，随着知识的增长不断完善它。'
  ];
  
  private readonly specificResponses: Record<string, string[]> = {
    '如何': [
      '要开始使用思维导图，首先点击创建按钮，然后输入中心主题，再通过添加按钮创建分支节点。',
      '要改变节点颜色，选中节点后点击颜色选择器，然后选择你喜欢的颜色即可。',
      '要导出思维导图，点击右上角菜单中的导出选项，然后选择你需要的格式。'
    ],
    '有什么': [
      '思维导图的优点包括可视化信息结构、提高记忆效率、促进创意思考等。',
      '本平台提供的功能包括节点自定义、自动布局、多人协作、导入导出等。',
      '我们支持多种思维导图模板，包括头脑风暴、项目规划、学习笔记等。'
    ],
    '为什么': [
      '使用思维导图可以帮助大脑更自然地工作，因为它模拟了人类的放射性思维方式。',
      '思维导图比线性笔记更有效，因为它可以同时展示整体结构和细节内容。',
      '定期创建思维导图可以锻炼你的创造力和分析能力，提高思维效率。'
    ]
  };
  
  private readonly keywords = [
    '思维导图', '节点', '分支', '中心主题', '颜色', '布局', '导出',
    '模板', '保存', '分享', '协作', '编辑', '删除', '创建', '修改'
  ];

  /**
   * 获取AI响应
   * @param message 用户输入的消息
   * @returns AI助手的响应
   */
  async getResponse(message: string): Promise<Message> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return {
      id: uuidv4(),
      content: this.generateResponse(message),
      role: 'assistant',
      timestamp: new Date()
    };
  }
  
  /**
   * 根据用户输入生成响应
   * 这里实现了一个简单的响应逻辑，可以替换为实际API调用
   */
  private generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // 尝试匹配特定问题类型
    for (const [prefix, responses] of Object.entries(this.specificResponses)) {
      if (lowerMessage.includes(prefix)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // 检查是否包含关键词
    const foundKeywords = this.keywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    if (foundKeywords.length > 0) {
      const keyword = foundKeywords[Math.floor(Math.random() * foundKeywords.length)];
      return `关于"${keyword}"，${this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)]}`;
    }
    
    // 默认响应
    return this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
  }
}

export const aiService = new AiService();
export default aiService; 