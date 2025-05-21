import { TagCategory } from "@/modules/materials/types/materials";

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
      },
      {
        id: "academic",
        name: "学术竞赛",
        children: [
          { id: "papers", name: "论文" },
          { id: "presentations", name: "演讲" },
          { id: "posters", name: "海报" }
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
      },
      {
        id: "software-engineering",
        name: "软件工程",
        children: [
          { id: "design-patterns", name: "设计模式" },
          { id: "testing", name: "测试方法" },
          { id: "devops", name: "DevOps" }
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
  },
  {
    id: "engineering",
    name: "工程学科",
    children: [
      {
        id: "mechanical",
        name: "机械工程",
        children: [
          { id: "dynamics", name: "动力学" },
          { id: "mechanics", name: "力学" },
          { id: "thermodynamics", name: "热力学" }
        ]
      },
      {
        id: "electrical",
        name: "电气工程",
        children: [
          { id: "circuits", name: "电路" },
          { id: "power-systems", name: "电力系统" },
          { id: "control", name: "控制系统" }
        ]
      },
      {
        id: "civil",
        name: "土木工程",
        children: [
          { id: "structures", name: "结构" },
          { id: "materials", name: "材料" },
          { id: "construction", name: "施工技术" }
        ]
      }
    ]
  },
  {
    id: "science",
    name: "自然科学",
    children: [
      {
        id: "physics",
        name: "物理",
        children: [
          { id: "mechanics", name: "力学" },
          { id: "electromagnetism", name: "电磁学" },
          { id: "quantum", name: "量子物理" }
        ]
      },
      {
        id: "chemistry",
        name: "化学",
        children: [
          { id: "organic", name: "有机化学" },
          { id: "inorganic", name: "无机化学" },
          { id: "analytical", name: "分析化学" }
        ]
      },
      {
        id: "biology",
        name: "生物学",
        children: [
          { id: "molecular", name: "分子生物学" },
          { id: "genetics", name: "遗传学" },
          { id: "ecology", name: "生态学" }
        ]
      }
    ]
  },
  {
    id: "business",
    name: "商业管理",
    children: [
      {
        id: "management",
        name: "管理学",
        children: [
          { id: "leadership", name: "领导力" },
          { id: "strategy", name: "战略管理" },
          { id: "operations", name: "运营管理" }
        ]
      },
      {
        id: "finance",
        name: "金融学",
        children: [
          { id: "investments", name: "投资" },
          { id: "banking", name: "银行" },
          { id: "corporate-finance", name: "公司金融" }
        ]
      },
      {
        id: "marketing",
        name: "市场营销",
        children: [
          { id: "digital", name: "数字营销" },
          { id: "branding", name: "品牌管理" },
          { id: "market-research", name: "市场研究" }
        ]
      }
    ]
  }
];
