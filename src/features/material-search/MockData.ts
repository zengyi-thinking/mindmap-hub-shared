import { Material, TagCategory } from '@/modules/materials/types/materials';

/**
 * 示例的标签分类数据
 */
export const mockCategories: TagCategory[] = [
  {
    id: 'programming',
    name: '编程',
    children: [
      {
        id: 'web',
        name: 'Web开发',
        children: [
          { id: 'javascript', name: 'JavaScript' },
          { id: 'css', name: 'CSS' },
          { id: 'html', name: 'HTML' }
        ]
      },
      {
        id: 'backend',
        name: '后端开发',
        children: [
          { id: 'java', name: 'Java' },
          { id: 'python', name: 'Python' },
          { id: 'nodejs', name: 'Node.js' }
        ]
      }
    ]
  },
  {
    id: 'design',
    name: '设计',
    children: [
      { id: 'ui', name: 'UI设计' },
      { id: 'ux', name: 'UX设计' }
    ]
  },
  {
    id: 'math',
    name: '数学',
    children: [
      { id: 'calculus', name: '微积分' },
      { id: 'algebra', name: '代数' },
      { id: 'statistics', name: '统计学' }
    ]
  }
];

/**
 * 示例的材料数据
 */
export const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'JavaScript高级教程',
    description: 'JavaScript语言的高级特性和用法',
    uploadTime: '2023-01-15T08:30:00.000Z',
    uploader: '张三',
    tags: ['编程', 'Web开发', 'JavaScript'],
    downloads: 156,
    likes: 89,
    favorites: 45,
    fileType: 'pdf',
    fileSize: 2500000,
    fileName: 'javascript_advanced.pdf',
    viewCount: 320
  },
  {
    id: '2',
    title: 'React框架入门',
    description: 'React框架基础知识与实践',
    uploadTime: '2023-02-23T14:45:00.000Z',
    uploader: '李四',
    tags: ['编程', 'Web开发', 'JavaScript', 'React'],
    downloads: 230,
    likes: 120,
    favorites: 67,
    fileType: 'pdf',
    fileSize: 3200000,
    fileName: 'react_basics.pdf',
    viewCount: 456
  },
  {
    id: '3',
    title: 'Python数据分析',
    description: '使用Python进行数据分析的基础知识',
    uploadTime: '2023-03-10T09:15:00.000Z',
    uploader: '王五',
    tags: ['编程', '后端开发', 'Python', '数据分析'],
    downloads: 310,
    likes: 178,
    favorites: 92,
    fileType: 'pdf',
    fileSize: 4100000,
    fileName: 'python_data_analysis.pdf',
    viewCount: 521
  },
  {
    id: '4',
    title: 'UI设计原则',
    description: '现代UI设计的核心原则与实践指南',
    uploadTime: '2023-04-05T16:20:00.000Z',
    uploader: '赵六',
    tags: ['设计', 'UI设计'],
    downloads: 189,
    likes: 96,
    favorites: 43,
    fileType: 'pptx',
    fileSize: 5600000,
    fileName: 'ui_design_principles.pptx',
    viewCount: 267
  },
  {
    id: '5',
    title: '微积分基础',
    description: '大学微积分基础教程',
    uploadTime: '2023-05-12T11:40:00.000Z',
    uploader: '钱七',
    tags: ['数学', '微积分'],
    downloads: 420,
    likes: 145,
    favorites: 76,
    fileType: 'pdf',
    fileSize: 3800000,
    fileName: 'calculus_basics.pdf',
    viewCount: 612
  },
  {
    id: '6',
    title: 'Java编程实践',
    description: 'Java语言的实践案例与项目',
    uploadTime: '2023-06-20T13:25:00.000Z',
    uploader: '孙八',
    tags: ['编程', '后端开发', 'Java'],
    downloads: 267,
    likes: 134,
    favorites: 58,
    fileType: 'zip',
    fileSize: 8200000,
    fileName: 'java_projects.zip',
    viewCount: 389
  },
  {
    id: '7',
    title: 'CSS动画技巧',
    description: '使用CSS创建精美动画效果的技巧',
    uploadTime: '2023-07-08T10:50:00.000Z',
    uploader: '周九',
    tags: ['编程', 'Web开发', 'CSS', '动画'],
    downloads: 198,
    likes: 87,
    favorites: 39,
    fileType: 'html',
    fileSize: 1500000,
    fileName: 'css_animations.html',
    viewCount: 276
  },
  {
    id: '8',
    title: 'Node.js后端开发',
    description: '使用Node.js构建高性能后端服务',
    uploadTime: '2023-08-15T15:35:00.000Z',
    uploader: '吴十',
    tags: ['编程', '后端开发', 'Node.js', 'JavaScript'],
    downloads: 234,
    likes: 112,
    favorites: 51,
    fileType: 'pdf',
    fileSize: 4300000,
    fileName: 'nodejs_backend.pdf',
    viewCount: 345
  }
]; 