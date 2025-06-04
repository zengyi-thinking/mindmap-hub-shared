import { 
  MindMapNode, 
  GenerateMindMapRequest, 
  GenerateMindMapResponse 
} from '@/types/mindmap';
import { useToast } from '@/components/ui/use-toast';

/**
 * AI思维导图生成服务
 * 提供与后端API交互的方法
 */
class MindMapService {
  private apiUrl: string;
  private useMockData: boolean;
  
  constructor() {
    // 默认使用本地开发服务器
    // 实际项目中可以从环境变量获取
    this.apiUrl = 'http://localhost:8000';
    
    // 开发环境默认使用模拟数据
    this.useMockData = process.env.NODE_ENV !== 'production';
  }
  
  /**
   * 生成思维导图
   * @param request 请求参数
   * @returns 生成的思维导图数据
   */
  async generateMindMap(request: GenerateMindMapRequest): Promise<GenerateMindMapResponse> {
    // 如果设置为使用模拟数据，则跳过API调用
    if (this.useMockData) {
      console.log('使用模拟数据生成思维导图');
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = this.generateMockData(request.keyword, request.depth || 2, request.maxNodesPerLevel || 5);
      
      return {
        data: mockData,
        keyword: request.keyword,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      console.log('调用后端API生成思维导图');
      
      const response = await fetch(`${this.apiUrl}/generate_mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `请求失败: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: result.data,
        keyword: request.keyword,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('生成思维导图失败，使用模拟数据:', error);
      
      // 如果API调用失败，使用模拟数据
      const mockData = this.generateMockData(request.keyword, request.depth || 2, request.maxNodesPerLevel || 5);
      
      return {
        data: mockData,
        keyword: request.keyword,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * 生成模拟数据（用于开发测试）
   * @param keyword 关键词
   * @returns 模拟的思维导图数据
   */
  generateMockData(keyword: string, depth: number = 2, maxNodesPerLevel: number = 5): MindMapNode {
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
    
    // 随机生成一个ID
    const randomId = () => `node-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // 生成中心节点
    const rootNode: MindMapNode = {
      id: randomId(),
      name: keyword,
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`,
      children: []
    };
    
    // 主要分类
    let mainCategories: string[];
    
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
        id: randomId(),
        name: category,
        color: randomColor(),
        children: []
      };
      
      // 如果深度 > 1，添加二级节点
      if (depth > 1) {
        // 根据一级节点类型创建不同的二级节点
        let subCategories: string[];
        
        switch (category) {
          case "概念定义":
            subCategories = ["什么是" + keyword, keyword + "的历史", "强" + keyword + "与弱" + keyword, keyword + "的定理"];
            break;
          case "核心技术":
            subCategories = ["机器学习", "深度学习", "神经网络", "自然语言处理", "计算机视觉"];
            break;
          case "应用领域":
            subCategories = ["医疗诊断", "自动驾驶", "智能客服", "推荐系统", "智能家居"];
            break;
          case "伦理问题":
            subCategories = ["隐私保护", "就业影响", "算法偏见", "安全风险"];
            break;
          case "未来发展":
            subCategories = ["人机共生", "通用人工智能", "意识问题研究"];
            break;
          default:
            // 通用子类别
            subCategories = [`${category}分类1`, `${category}分类2`, `${category}分类3`, `${category}分类4`];
        }
        
        // 限制二级节点数量
        const selectedSubCategories = subCategories.slice(0, maxNodesPerLevel);
        
        // 创建二级节点
        selectedSubCategories.forEach(subCategory => {
          const level2Node: MindMapNode = {
            id: randomId(),
            name: subCategory,
            url: Math.random() > 0.5 ? `https://www.google.com/search?q=${encodeURIComponent(subCategory)}` : undefined,
            children: []
          };
          
          // 如果深度 > 2，添加三级节点
          if (depth > 2) {
            // 随机决定三级节点数量
            const level3Count = Math.floor(Math.random() * (maxNodesPerLevel - 1)) + 1;
            
            for (let i = 0; i < level3Count; i++) {
              const level3Node: MindMapNode = {
                id: randomId(),
                name: `${subCategory}的方面${i+1}`,
                children: []
              };
              
              // 如果深度 > 3，添加四级节点
              if (depth > 3) {
                // 随机决定四级节点数量
                const level4Count = Math.floor(Math.random() * 3) + 1;
                
                for (let j = 0; j < level4Count; j++) {
                  level3Node.children?.push({
                    id: randomId(),
                    name: `详细内容${j+1}`,
                    url: Math.random() > 0.7 ? `https://zh.wikipedia.org/wiki/${encodeURIComponent(subCategory)}` : undefined
                  });
                }
              }
              
              level2Node.children?.push(level3Node);
            }
          }
          
          level1Node.children?.push(level2Node);
        });
      }
      
      rootNode.children?.push(level1Node);
    });
    
    return rootNode;
  }
}

// 导出单例实例
export const mindMapService = new MindMapService();

/**
 * 使用思维导图服务的React Hook
 */
export const useMindMapService = () => {
  const { toast } = useToast();
  
  /**
   * 生成思维导图
   */
  const generateMindMap = async (request: GenerateMindMapRequest): Promise<MindMapNode | null> => {
    try {
      const response = await mindMapService.generateMindMap(request);
      return response.data;
    } catch (error) {
      console.error('生成思维导图失败:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "无法生成思维导图，请稍后再试",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  return {
    generateMindMap
  };
}; 