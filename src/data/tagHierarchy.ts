
import { TagCategory } from "../types/materials";

export const tagHierarchy: TagCategory[] = [
  {
    id: "contests",
    name: "比赛",
    children: [
      {
        id: "math-modeling",
        name: "数学建模",
        children: [
          { id: "rules", name: "比赛规则" },
          { id: "previous-problems", name: "历年真题" },
          { id: "winning-works", name: "获奖作品" },
          { id: "notices", name: "比赛注意事项" }
        ]
      },
      {
        id: "programming",
        name: "程序设计",
        children: [
          { id: "algorithms", name: "算法" },
          { id: "languages", name: "编程语言" },
          { id: "frameworks", name: "开发框架" }
        ]
      },
      {
        id: "innovation",
        name: "创新创业",
        children: [
          { id: "business-plans", name: "商业计划书" },
          { id: "case-studies", name: "案例分析" },
          { id: "pitches", name: "路演材料" }
        ]
      }
    ]
  },
  {
    id: "cs",
    name: "计算机科学",
    children: [
      {
        id: "basics",
        name: "基础理论",
        children: [
          { id: "data-structures", name: "数据结构" },
          { id: "algorithms", name: "算法" },
          { id: "operating-systems", name: "操作系统" },
          { id: "computer-networks", name: "计算机网络" }
        ]
      },
      {
        id: "development",
        name: "开发技术",
        children: [
          { id: "frontend", name: "前端开发" },
          { id: "backend", name: "后端开发" },
          { id: "mobile", name: "移动开发" },
          { id: "database", name: "数据库" }
        ]
      },
      {
        id: "advanced",
        name: "高级主题",
        children: [
          { id: "ai", name: "人工智能" },
          { id: "ml", name: "机器学习" },
          { id: "cloud", name: "云计算" },
          { id: "security", name: "网络安全" }
        ]
      }
    ]
  },
  {
    id: "education",
    name: "教育资源",
    children: [
      {
        id: "textbooks",
        name: "教材",
        children: [
          { id: "undergraduate", name: "本科教材" },
          { id: "graduate", name: "研究生教材" },
          { id: "mooc", name: "在线课程" }
        ]
      },
      {
        id: "notes",
        name: "笔记",
        children: [
          { id: "lecture-notes", name: "课堂笔记" },
          { id: "summary", name: "总结归纳" }
        ]
      },
      {
        id: "exercises",
        name: "习题",
        children: [
          { id: "practice", name: "练习题" },
          { id: "exams", name: "考试题" },
          { id: "solutions", name: "解答" }
        ]
      }
    ]
  }
];
