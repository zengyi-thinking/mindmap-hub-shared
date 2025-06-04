import { HfInference } from '@huggingface/inference';
import { MindMapNode } from '@/types/mindmap';

/**
 * NLP思维导图生成服务
 * 使用Hugging Face API将用户输入转换成结构化思维导图数据
 */
class NLPMindMapService {
  private inferenceClient: HfInference;
  private useMockData: boolean;
  
  constructor() {
    console.log("初始化NLPMindMapService");
    
    try {
      // 获取Hugging Face API令牌，可以从环境变量中获取
      const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN || '';
      console.log("HF Token存在:", !!hfToken);
      
      // 初始化Hugging Face推理客户端
      if (hfToken) {
        this.inferenceClient = new HfInference(hfToken);
      } else {
        console.warn("未找到Hugging Face API令牌，将使用模拟数据");
      }
      
      // 开发环境默认使用模拟数据
      this.useMockData = process.env.NODE_ENV !== 'production' || !hfToken;
      console.log("使用模拟数据:", this.useMockData);
    } catch (error) {
      console.error("初始化NLPMindMapService失败:", error);
      this.useMockData = true;
    }
  }
  
  /**
   * 从文本生成思维导图
   * @param text 用户输入的文本内容
   * @param depth 思维导图深度，默认为3层
   * @param maxNodesPerLevel 每层最大节点数，默认为5
   * @returns 思维导图数据
   */
  async generateMindMapFromText(
    text: string, 
    depth: number = 3, 
    maxNodesPerLevel: number = 5
  ): Promise<MindMapNode> {
    try {
      // 如果没有API令牌或在开发环境下使用模拟数据
      if (this.useMockData) {
        console.log('使用模拟数据生成思维导图，实际文本内容：', text);
        
        // 延迟模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return this.generateMockMindMapData(text, depth, maxNodesPerLevel);
      }
      
      // 构建提示词以生成JSON格式的思维导图
      const prompt = this.buildMindMapPrompt(text, depth, maxNodesPerLevel);
      
      // 调用大模型API
      const response = await this.inferenceClient.textGeneration({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          return_full_text: false
        }
      });
      
      // 解析响应文本中的JSON数据
      const jsonMatch = response.generated_text.match(/```json\n([\s\S]*?)\n```/) || 
                        response.generated_text.match(/{[\s\S]*?}/);
                        
      if (!jsonMatch) {
        throw new Error('无法从模型响应中提取有效的JSON数据');
      }
      
      // 提取JSON字符串并解析
      const jsonString = jsonMatch[1] || jsonMatch[0];
      const mindMapData = JSON.parse(jsonString);
      
      // 验证数据格式
      if (!mindMapData.name || !Array.isArray(mindMapData.children)) {
        throw new Error('模型生成的数据格式不正确');
      }
      
      // 添加唯一ID
      this.addUniqueIds(mindMapData);
      
      return mindMapData;
    } catch (error) {
      console.error('生成思维导图失败:', error);
      
      // 出错时回退到模拟数据
      return this.generateMockMindMapData(text, depth, maxNodesPerLevel);
    }
  }
  
  /**
   * 构建用于思维导图生成的提示词
   */
  private buildMindMapPrompt(text: string, depth: number, maxNodesPerLevel: number): string {
    return `你是一个专业的思维导图生成助手。请根据以下文本内容，生成一个结构清晰的思维导图，并以JSON格式输出。
思维导图应该有一个中心主题，然后是主要分支，然后是子分支。
请确保思维导图层级不超过${depth}层，每层节点数不超过${maxNodesPerLevel}个。

思维导图的JSON格式要求如下:
{
  "name": "中心主题",
  "children": [
    {
      "name": "主要分支1",
      "children": [
        {
          "name": "子分支1-1",
          "children": []
        },
        {
          "name": "子分支1-2",
          "children": []
        }
      ]
    },
    {
      "name": "主要分支2",
      "children": []
    }
  ]
}

请分析以下文本内容并创建思维导图：

${text}

只需要返回JSON格式的思维导图数据，不要有其他解释或前导文字。使用\`\`\`json\`\`\`格式包裹JSON数据。`;
  }
  
  /**
   * 为思维导图节点递归添加唯一ID
   */
  private addUniqueIds(node: MindMapNode, prefix: string = 'node'): void {
    // 为当前节点添加ID
    node.id = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, index) => {
        this.addUniqueIds(child, `${prefix}-${index}`);
      });
    }
  }
  
  /**
   * 生成模拟思维导图数据（用于开发测试）
   */
  private generateMockMindMapData(
    keyword: string, 
    depth: number = 3, 
    maxNodesPerLevel: number = 5
  ): MindMapNode {
    // 预定义的主题颜色
    const colors = [
      "#4299e1", "#3182ce", "#2b6cb0",  // 蓝色系
      "#48bb78", "#38a169", "#2f855a",  // 绿色系
      "#ed8936", "#dd6b20", "#c05621",  // 橙色系
      "#9f7aea", "#805ad5", "#6b46c1",  // 紫色系
      "#f56565", "#e53e3e", "#c53030",  // 红色系
    ];
    
    // 随机获取一个颜色
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
    
    // 生成中心节点
    const rootNode: MindMapNode = {
      id: `node-${Date.now()}`,
      name: keyword,
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`,
      children: []
    };
    
    // 主要分类
    let mainCategories: string[] = [];
    
    // 根据关键词选择不同的主题结构
    if (keyword.includes('人工智能') || keyword.includes('AI')) {
      mainCategories = ["概念定义", "核心技术", "应用领域", "伦理问题", "未来发展"];
    } else if (keyword.includes('编程') || keyword.includes('开发') || keyword.includes('编码')) {
      mainCategories = ["前端开发", "后端开发", "开发工具", "网站架构", "性能优化"];
    } else if (keyword.includes('数据') || keyword.includes('分析')) {
      mainCategories = ["基础概念", "数据处理", "机器学习", "数据可视化", "应用场景"];
    } else {
      // 通用结构
      mainCategories = [
        `${keyword}的基本概念`, 
        `${keyword}的应用`, 
        `${keyword}的发展`, 
        "相关技术", 
        "学习资源"
      ];
    }
    
    // 限制第一级节点数量
    const selectedMainCategories = mainCategories.slice(0, maxNodesPerLevel);
    
    // 创建一级节点
    selectedMainCategories.forEach(category => {
      const level1Node: MindMapNode = {
        id: `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: category,
        color: randomColor(),
        children: []
      };
      
      // 如果深度 > 1，添加二级节点
      if (depth > 1) {
        // 生成2-5个子节点
        const childCount = Math.floor(Math.random() * (maxNodesPerLevel - 1)) + 2;
        
        for (let i = 0; i < childCount; i++) {
          const level2Node: MindMapNode = {
            id: `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            name: `${category}分支${i+1}`,
            children: []
          };
          
          // 如果深度 > 2，添加三级节点
          if (depth > 2) {
            // 随机决定三级节点数量
            const level3Count = Math.floor(Math.random() * (maxNodesPerLevel - 1)) + 1;
            
            for (let j = 0; j < level3Count; j++) {
              level2Node.children?.push({
                id: `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: `详细内容${j+1}`,
                url: Math.random() > 0.7 ? `https://zh.wikipedia.org/wiki/${encodeURIComponent(category)}` : undefined,
                children: []
              });
            }
          }
          
          level1Node.children?.push(level2Node);
        }
      }
      
      rootNode.children?.push(level1Node);
    });
    
    return rootNode;
  }
}

// 导出单例实例
export const nlpMindMapService = new NLPMindMapService();

/**
 * 使用NLP思维导图服务的React Hook
 */
export const useNLPMindMapService = () => {
  /**
   * 生成思维导图
   */
  const generateMindMapFromText = async (
    text: string,
    depth: number = 3,
    maxNodesPerLevel: number = 5
  ): Promise<MindMapNode | null> => {
    console.log("useNLPMindMapService.generateMindMapFromText 被调用", { text, depth, maxNodesPerLevel });
    
    try {
      if (!nlpMindMapService) {
        console.error("nlpMindMapService实例不存在");
        return getMockMindMapData(text);
      }
      
      const result = await nlpMindMapService.generateMindMapFromText(text, depth, maxNodesPerLevel);
      console.log("生成思维导图结果:", result);
      return result;
    } catch (error) {
      console.error('生成思维导图失败:', error);
      // 出错时返回模拟数据
      return getMockMindMapData(text);
    }
  };
  
  // 生成模拟数据的辅助函数
  const getMockMindMapData = (text: string): MindMapNode => {
    console.log("生成模拟思维导图数据");
    
    // 简单的根节点
    const rootNode: MindMapNode = {
      id: `node-${Date.now()}`,
      name: text.split(' ')[0] || "思维导图",
      children: [
        {
          id: `node-${Date.now()}-1`,
          name: "主要概念",
          children: [
            { id: `node-${Date.now()}-1-1`, name: "定义", children: [] },
            { id: `node-${Date.now()}-1-2`, name: "分类", children: [] }
          ]
        },
        {
          id: `node-${Date.now()}-2`,
          name: "应用领域",
          children: [
            { id: `node-${Date.now()}-2-1`, name: "场景一", children: [] },
            { id: `node-${Date.now()}-2-2`, name: "场景二", children: [] }
          ]
        }
      ]
    };
    
    return rootNode;
  };
  
  return {
    generateMindMapFromText
  };
}; 