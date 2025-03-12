import { Material } from '../types/materials';
import { DiscussionTopic, DiscussionComment } from '../types/discussion';
import { sampleMaterials } from '../data/sampleMaterials';

// 本地存储键名
const STORAGE_KEYS = {
  MATERIALS: 'mindmap_materials',
  TOPICS: 'mindmap_topics',
  COMMENTS: 'mindmap_comments',
  USER_FILES: 'mindmap_user_files',
  USER_COMMENTS: 'mindmap_user_comments'
};

// 模拟数据库存储和服务
interface StorageItem {
  id: number;
  [key: string]: any;
}

// 基础存储服务
class StorageService<T extends StorageItem> {
  private storageKey: string;
  private items: T[] = [];
  private lastId: number = 0;
  private initialized: boolean = false;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // 延迟初始化，避免SSR问题
  private initialize() {
    if (this.initialized) return;
    
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        this.items = JSON.parse(storedData);
        // 找出最大ID
        this.lastId = this.items.reduce((max, item) => Math.max(max, item.id || 0), 0);
      }
      this.initialized = true;
    } catch (error) {
      console.error(`Error initializing storage for ${this.storageKey}:`, error);
      this.items = [];
      this.initialized = true;
    }
  }

  // 保存到localStorage
  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error(`Error saving to ${this.storageKey}:`, error);
    }
  }

  // 获取所有记录
  getAll(): T[] {
    this.initialize();
    return [...this.items];
  }

  // 通过ID获取单条记录
  getById(id: number): T | undefined {
    this.initialize();
    return this.items.find(item => item.id === id);
  }

  // 通过字段获取记录
  getByField(fieldName: keyof T, value: any): T[] {
    this.initialize();
    return this.items.filter(item => item[fieldName] === value);
  }

  // 添加记录
  add(item: Omit<T, 'id'>): T {
    this.initialize();
    const newItem = {
      ...item as any,
      id: ++this.lastId
    } as T;
    
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  // 更新记录
  update(id: number, updates: Partial<T>): T | undefined {
    this.initialize();
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    const updatedItem = {
      ...this.items[index],
      ...updates,
      id  // 确保ID不被覆盖
    };

    this.items[index] = updatedItem;
    this.save();
    return updatedItem;
  }

  // 删除记录
  delete(id: number): boolean {
    this.initialize();
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    
    if (this.items.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // 批量添加记录
  bulkAdd(items: Omit<T, 'id'>[]): T[] {
    this.initialize();
    const newItems = items.map(item => ({
      ...item as any,
      id: ++this.lastId
    } as T));
    
    this.items.push(...newItems);
    this.save();
    return newItems;
  }

  // 清空所有记录
  clear(): void {
    this.initialize();
    this.items = [];
    this.lastId = 0;
    this.save();
  }

  // 根据条件过滤记录
  filter(predicate: (item: T) => boolean): T[] {
    this.initialize();
    return this.items.filter(predicate);
  }

  // 排序记录
  sort(compareFn: (a: T, b: T) => number): T[] {
    this.initialize();
    const sortedItems = [...this.items].sort(compareFn);
    return sortedItems;
  }
}

// 用户文件存储服务
export interface UserFile extends StorageItem {
  id: number;
  file: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    dataUrl: string;
  };
  title: string;
  description: string;
  tags: string[];
  uploadTime: string;
  userId: number;
  username: string;
  approved: boolean;
  likes?: number;
  views?: number;
  downloads?: number;
}

class UserFilesService extends StorageService<UserFile> {
  constructor() {
    super('user_files');
  }

  // 获取某个用户的所有文件
  getUserFiles(userId: number): UserFile[] {
    return this.getByField('userId', userId);
  }

  // 获取已批准的文件
  getApprovedFiles(): UserFile[] {
    return this.filter(file => file.approved);
  }

  // 获取待审批的文件
  getPendingFiles(): UserFile[] {
    return this.filter(file => !file.approved);
  }

  // 通过标签搜索文件
  searchByTags(tags: string[]): UserFile[] {
    if (!tags.length) return this.getApprovedFiles();
    
    return this.filter(file => {
      if (!file.approved) return false;
      return tags.every(tag => file.tags.includes(tag));
    });
  }

  // 通过关键词搜索文件
  searchByKeyword(keyword: string): UserFile[] {
    if (!keyword.trim()) return this.getApprovedFiles();
    
    const lowercaseKeyword = keyword.toLowerCase();
    
    return this.filter(file => {
      if (!file.approved) return false;
      
      return (
        file.title.toLowerCase().includes(lowercaseKeyword) ||
        file.description.toLowerCase().includes(lowercaseKeyword) ||
        file.tags.some(tag => tag.toLowerCase().includes(lowercaseKeyword))
      );
    });
  }

  // 添加文件，如果文件内容相同则不会重复添加
  addIfNotExists(file: Omit<UserFile, 'id'>): UserFile {
    const existingFile = this.filter(f => 
      f.file.name === file.file.name && 
      f.file.size === file.file.size && 
      f.userId === file.userId
    );
    
    if (existingFile.length > 0) {
      return existingFile[0];
    }
    
    return this.add({
      ...file,
      likes: 0,
      views: 0,
      downloads: 0
    });
  }

  // 批准文件
  approveFile(id: number): UserFile | undefined {
    return this.update(id, { approved: true });
  }

  // 增加浏览量
  incrementViews(id: number): UserFile | undefined {
    const file = this.getById(id);
    if (!file) return undefined;
    
    return this.update(id, { views: (file.views || 0) + 1 });
  }

  // 增加下载量
  incrementDownloads(id: number): UserFile | undefined {
    const file = this.getById(id);
    if (!file) return undefined;
    
    return this.update(id, { downloads: (file.downloads || 0) + 1 });
  }

  // 通过标签获取最热门文件（下载量最高）
  getPopularFilesByTags(tags: string[], limit: number = 10): UserFile[] {
    const files = tags.length > 0 
      ? this.searchByTags(tags) 
      : this.getApprovedFiles();
    
    return [...files]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, limit);
  }

  // 获取最新上传的文件
  getRecentFiles(limit: number = 10): UserFile[] {
    return [...this.getApprovedFiles()]
      .sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
      .slice(0, limit);
  }
}

// 讨论主题存储服务
export interface DiscussionTopic extends StorageItem {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  tags: string[];
  createdAt: string;
  likes: number;
  views?: number;
}

class TopicsService extends StorageService<DiscussionTopic> {
  constructor() {
    super('discussion_topics');
  }

  // 获取某个用户创建的话题
  getUserTopics(authorId: number): DiscussionTopic[] {
    return this.getByField('authorId', authorId);
  }

  // 通过标签获取话题
  getByTags(tags: string[]): DiscussionTopic[] {
    if (!tags.length) return this.getAll();
    
    return this.filter(topic => 
      tags.some(tag => topic.tags.includes(tag))
    );
  }

  // 获取最热门话题
  getPopularTopics(limit: number = 10): DiscussionTopic[] {
    return [...this.getAll()]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  // 获取最新话题
  getRecentTopics(limit: number = 10): DiscussionTopic[] {
    return [...this.getAll()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

// 评论存储服务
export interface DiscussionComment extends StorageItem {
  id: number;
  topicId: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  likes: number;
}

class CommentsService extends StorageService<DiscussionComment> {
  constructor() {
    super('discussion_comments');
  }

  // 获取某个话题的所有评论
  getByTopicId(topicId: number): DiscussionComment[] {
    return this.getByField('topicId', topicId);
  }

  // 获取用户的所有评论
  getUserComments(authorId: number): DiscussionComment[] {
    return this.getByField('authorId', authorId);
  }

  // 按时间排序获取评论
  getByTopicIdSorted(topicId: number): DiscussionComment[] {
    const comments = this.getByTopicId(topicId);
    return comments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
}

// 思维导图存储服务
export interface MindMap extends StorageItem {
  id: number;
  name: string;
  description?: string;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nodeData: any;
  isPublic: boolean;
  views?: number;
  likes?: number;
}

class MindMapsService extends StorageService<MindMap> {
  constructor() {
    super('mind_maps');
  }

  // 获取某个用户的所有思维导图
  getUserMindMaps(userId: number): MindMap[] {
    return this.getByField('userId', userId);
  }

  // 获取公开的思维导图
  getPublicMindMaps(): MindMap[] {
    return this.filter(mindMap => mindMap.isPublic);
  }

  // 通过标签搜索思维导图
  searchByTags(tags: string[]): MindMap[] {
    if (!tags.length) return this.getPublicMindMaps();
    
    return this.filter(mindMap => {
      if (!mindMap.isPublic) return false;
      return tags.some(tag => mindMap.tags.includes(tag));
    });
  }

  // 获取热门思维导图
  getPopularMindMaps(limit: number = 10): MindMap[] {
    return [...this.getPublicMindMaps()]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }
}

// 初始化服务实例
export const userFilesService = new UserFilesService();
export const topicsService = new TopicsService();
export const commentsService = new CommentsService();
export const mindMapsService = new MindMapsService();

// 如果localStorage为空，初始化一些示例数据
export const initializeStorageWithExamples = () => {
  // 添加示例文件数据
  if (userFilesService.getAll().length === 0) {
    const exampleFiles: Omit<UserFile, 'id'>[] = [
      {
        file: {
          name: '数据结构与算法.pdf',
          type: 'application/pdf',
          size: 1024 * 1024 * 2.5, // 2.5MB
          lastModified: Date.now(),
          dataUrl: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0...' // 示例数据
        },
        title: '数据结构与算法学习笔记',
        description: '包含常见数据结构和算法的详细解释和示例代码，适合计算机专业学生学习。',
        tags: ['计算机科学', '数据结构', '算法', '学习笔记'],
        uploadTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
        userId: 1,
        username: '系统管理员',
        approved: true,
        likes: 42,
        views: 128,
        downloads: 86
      },
      {
        file: {
          name: '机器学习入门.pdf',
          type: 'application/pdf',
          size: 1024 * 1024 * 3.8, // 3.8MB
          lastModified: Date.now(),
          dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zD...' // 示例数据
        },
        title: '机器学习入门指南',
        description: '从零开始学习机器学习的完整指南，包含理论基础和实践项目。',
        tags: ['计算机科学', '人工智能', '机器学习', '教程'],
        uploadTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14天前
        userId: 2,
        username: '人工智能爱好者',
        approved: true,
        likes: 76,
        views: 253,
        downloads: 142
      },
      {
        file: {
          name: '微积分复习笔记.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1024 * 1024 * 1.2, // 1.2MB
          lastModified: Date.now(),
          dataUrl: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,PK...' // 示例数据
        },
        title: '微积分期末复习笔记',
        description: '大一高等数学微积分部分的知识点总结，包含常见题型和解题技巧。',
        tags: ['数学', '微积分', '学习笔记', '期末复习'],
        uploadTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21天前
        userId: 3,
        username: '数学学霸',
        approved: true,
        likes: 35,
        views: 198,
        downloads: 67
      }
    ];

    userFilesService.bulkAdd(exampleFiles);
  }

  // 保证有足够的示例数据供应用展示
  if (topicsService.getAll().length < 3) {
    // 示例话题
    const exampleTopics: Omit<DiscussionTopic, 'id'>[] = [
      {
        title: '如何有效利用思维导图进行期末复习？',
        content: '最近期末考试临近，想听听大家使用思维导图复习的经验和方法，有什么好的工具或技巧推荐吗？',
        author: '学习达人',
        authorId: 1,
        tags: ['学习方法', '思维导图', '期末复习'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
        likes: 24,
        views: 89
      },
      {
        title: '数据结构学习资料分享',
        content: '想和大家分享一些我收集的数据结构学习资料，包括了常见数据结构的实现和应用案例，希望对大家有帮助。',
        author: '编程爱好者',
        authorId: 2,
        tags: ['数据结构', '编程', '学习资料'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
        likes: 36,
        views: 128
      },
      {
        title: '关于创建计算机网络知识体系的讨论',
        content: '我正在尝试建立一个完整的计算机网络知识体系，想听听大家的建议，如何组织这些知识点才能更加清晰？',
        author: '网络爱好者',
        authorId: 3,
        tags: ['计算机网络', '知识体系', '学习方法'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
        likes: 18,
        views: 76
      }
    ];

    const savedTopics = topicsService.bulkAdd(exampleTopics);

    // 为第一个话题添加一些评论
    if (savedTopics.length > 0 && commentsService.getAll().length === 0) {
      const exampleComments: Omit<DiscussionComment, 'id'>[] = [
        {
          topicId: savedTopics[0].id,
          content: '我推荐使用XMind进行复习，可以先梳理知识框架，然后逐步细化知识点，最后添加具体例题。',
          author: '思维导图专家',
          authorId: 4,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天前
          likes: 5
        },
        {
          topicId: savedTopics[0].id,
          content: '我发现将课程内容按照"概念-原理-应用-例题"的结构来组织思维导图特别有效。',
          author: '高分学霸',
          authorId: 5,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
          likes: 7
        }
      ];

      commentsService.bulkAdd(exampleComments);
    }
  }

  // 初始化示例思维导图数据
  if (mindMapsService.getAll().length === 0) {
    const exampleMindMaps: Omit<MindMap, 'id'>[] = [
      {
        name: '计算机网络知识体系',
        description: '完整的计算机网络知识结构，从物理层到应用层的详细分解',
        userId: 1,
        username: '系统管理员',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天前
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
        tags: ['计算机网络', '知识体系', '学习资料'],
        nodeData: {
          root: {
            text: '计算机网络',
            children: [
              { text: '物理层', children: [{ text: '传输介质' }, { text: '信号调制' }] },
              { text: '数据链路层', children: [{ text: 'MAC地址' }, { text: '帧结构' }] },
              { text: '网络层', children: [{ text: 'IP协议' }, { text: '路由算法' }] },
              { text: '传输层', children: [{ text: 'TCP' }, { text: 'UDP' }] },
              { text: '应用层', children: [{ text: 'HTTP' }, { text: 'FTP' }, { text: 'DNS' }] }
            ]
          }
        },
        isPublic: true,
        views: 257,
        likes: 89
      },
      {
        name: '数据结构与算法学习路线',
        description: '学习数据结构与算法的推荐路线图',
        userId: 2,
        username: '算法教练',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45天前
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
        tags: ['数据结构', '算法', '学习路线'],
        nodeData: {
          root: {
            text: '数据结构与算法',
            children: [
              { text: '基础数据结构', children: [{ text: '数组' }, { text: '链表' }, { text: '栈和队列' }] },
              { text: '高级数据结构', children: [{ text: '树' }, { text: '图' }, { text: '堆' }] },
              { text: '算法思想', children: [{ text: '贪心算法' }, { text: '动态规划' }, { text: '分治法' }] },
              { text: '排序算法', children: [{ text: '冒泡排序' }, { text: '快速排序' }, { text: '归并排序' }] }
            ]
          }
        },
        isPublic: true,
        views: 189,
        likes: 56
      }
    ];

    mindMapsService.bulkAdd(exampleMindMaps);
  }
};

// 尝试初始化示例数据
try {
  if (typeof window !== 'undefined') {
    // 检查是否已经有数据
    const hasUserFiles = localStorage.getItem('user_files') !== null;
    const hasTopics = localStorage.getItem('discussion_topics') !== null;
    const hasMindMaps = localStorage.getItem('mind_maps') !== null;
    
    // 只有在没有任何数据的情况下才初始化示例数据
    if (!hasUserFiles && !hasTopics && !hasMindMaps) {
      initializeStorageWithExamples();
    }
  }
} catch (error) {
  console.error('Error initializing example data:', error);
}

// 初始化本地存储数据
export const initializeStorage = () => {
  // 如果本地存储中没有材料数据，则使用示例数据初始化
  if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(sampleMaterials));
  }
  
  // 添加事件监听器，在页面离开或刷新前保存数据
  window.addEventListener('beforeunload', saveAllData);
};

// 在页面卸载前保存所有数据
const saveAllData = () => {
  // 这里可以添加额外的数据同步操作
  console.log('Saving all data before page unload');
};

// 材料相关操作
export const materialsService = {
  // 获取所有材料
  getAll: (): Material[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return data ? JSON.parse(data) : [];
  },
  
  // 通过ID获取单个材料
  getById: (id: number): Material | undefined => {
    const materials = materialsService.getAll();
    return materials.find(material => material.id === id);
  },
  
  // 添加新材料
  add: (material: Omit<Material, 'id'>): Material => {
    const materials = materialsService.getAll();
    const newId = materials.length > 0 
      ? Math.max(...materials.map(m => m.id)) + 1 
      : 1;
    
    const newMaterial = {
      ...material,
      id: newId,
      downloads: 0,
      likes: 0,
      favorites: 0
    };
    
    materials.push(newMaterial);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    
    return newMaterial;
  },
  
  // 更新材料
  update: (id: number, updates: Partial<Material>): Material | null => {
    const materials = materialsService.getAll();
    const index = materials.findIndex(material => material.id === id);
    
    if (index === -1) return null;
    
    const updatedMaterial = { ...materials[index], ...updates };
    materials[index] = updatedMaterial;
    
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    return updatedMaterial;
  },
  
  // 删除材料
  delete: (id: number): boolean => {
    const materials = materialsService.getAll();
    const filteredMaterials = materials.filter(material => material.id !== id);
    
    if (filteredMaterials.length === materials.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(filteredMaterials));
    return true;
  },
  
  // 按标签筛选材料
  filterByTags: (tags: string[]): Material[] => {
    if (!tags.length) return materialsService.getAll();
    
    const materials = materialsService.getAll();
    return materials.filter(material => 
      tags.some(tag => material.tags.includes(tag))
    );
  },
  
  // 搜索材料
  search: (query: string): Material[] => {
    if (!query.trim()) return materialsService.getAll();
    
    const materials = materialsService.getAll();
    const lowerQuery = query.toLowerCase();
    
    return materials.filter(material =>
      material.title.toLowerCase().includes(lowerQuery) ||
      material.description.toLowerCase().includes(lowerQuery) ||
      material.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
};

// 原重复定义的topicsService和commentsService已移除
// 使用上面已定义的类实例（行417-420）:
// export const userFilesService = new UserFilesService();
// export const topicsService = new TopicsService();
// export const commentsService = new CommentsService();
// export const mindMapsService = new MindMapsService();
// ... existing code ... 