
import { Material } from "../types/materials";

export const sampleMaterials: Material[] = [
  { 
    id: 1, 
    title: '数据结构与算法分析 - C语言描述', 
    description: '详细介绍了常见数据结构与算法，包含代码示例与分析。',
    uploadTime: '2023-06-15',
    uploader: '张三',
    tags: ['计算机科学', '基础理论', '数据结构', 'C语言'],
    downloads: 128,
    likes: 45,
    favorites: 23
  },
  { 
    id: 2, 
    title: '操作系统概念（第9版）课件', 
    description: '操作系统概念课程的全套课件，包含详细解说与练习题。',
    uploadTime: '2023-06-10',
    uploader: '李四',
    tags: ['计算机科学', '基础理论', '操作系统'],
    downloads: 96,
    likes: 32,
    favorites: 18
  },
  { 
    id: 3, 
    title: '机器学习实战 - Python实现', 
    description: '通过Python实现常见的机器学习算法，并附有实际应用案例。',
    uploadTime: '2023-06-05',
    uploader: '王五',
    tags: ['计算机科学', '高级主题', '机器学习', 'Python'],
    downloads: 156,
    likes: 67,
    favorites: 41
  },
  { 
    id: 4, 
    title: '现代前端开发指南', 
    description: '全面介绍现代前端开发技术栈、工具链与最佳实践。',
    uploadTime: '2023-06-01',
    uploader: '赵六',
    tags: ['计算机科学', '开发技术', '前端开发', 'JavaScript'],
    downloads: 87,
    likes: 29,
    favorites: 15
  },
  { 
    id: 5, 
    title: '数学建模竞赛指南', 
    description: '详细介绍数学建模竞赛的基本流程、常用方法和技巧。',
    uploadTime: '2023-07-01',
    uploader: '数模爱好者',
    tags: ['比赛', '数学建模', '比赛规则'],
    downloads: 112,
    likes: 42,
    favorites: 28
  },
  { 
    id: 6, 
    title: '全国大学生数学建模竞赛历年真题', 
    description: '收集了近十年全国大学生数学建模竞赛的真题和优秀解答。',
    uploadTime: '2023-07-05',
    uploader: '数模专家',
    tags: ['比赛', '数学建模', '历年真题'],
    downloads: 156,
    likes: 58,
    favorites: 39
  }
];
