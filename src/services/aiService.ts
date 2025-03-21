import { mindmapService } from '@/lib/mindmapStorage';

// 模拟AI知识库
const knowledgeBase = {
  mindmap: [
    { 
      question: "什么是思维导图", 
      answer: "思维导图是一种图形化的思考工具，它通过节点和连线来组织信息，帮助用户可视化思考过程、关联知识点和整理复杂信息。在我们的应用中，您可以创建、编辑和分享思维导图，帮助您更好地组织学习内容。" 
    },
    { 
      question: "如何创建思维导图", 
      answer: "要创建思维导图，请点击导航栏中的"思维导图管理"，然后点击右上角的"+"按钮或"创建思维导图"按钮。您可以给思维导图起一个标题，添加描述，然后开始添加节点和连线。创建完成后，点击保存即可。" 
    },
    { 
      question: "如何编辑节点", 
      answer: "在思维导图编辑页面，您可以通过点击节点来选择它，然后可以拖动节点调整位置，或双击节点编辑其内容。右键点击节点会显示更多选项，如添加子节点、删除节点、改变节点颜色等。" 
    },
    { 
      question: "怎样共享思维导图", 
      answer: "创建思维导图后，您可以在思维导图详情页面点击"分享"按钮。您可以选择将思维导图设为公开，这样其他用户可以查看；也可以获取分享链接发送给特定用户。" 
    }
  ],
  search: [
    { 
      question: "如何搜索资料", 
      answer: "您可以通过点击导航栏中的"资料搜索"进入搜索页面。在搜索框中输入关键词，选择合适的标签或分类，然后点击搜索按钮。系统会根据您的搜索条件展示相关资料。" 
    },
    { 
      question: "什么是标签", 
      answer: "标签是用来分类和组织资料的关键词。在我们的系统中，每个资料可以有多个标签，帮助用户更容易地找到相关内容。您可以通过标签快速筛选和查找特定主题的资料。" 
    }
  ],
  general: [
    { 
      question: "如何重置密码", 
      answer: "要重置密码，请点击登录页面的"忘记密码"链接，然后按照提示输入您的注册邮箱。系统会发送一封重置密码的邮件到您的邮箱，点击邮件中的链接即可重置密码。" 
    },
    { 
      question: "如何联系客服", 
      answer: "如果您有任何问题或建议，可以通过页面底部的"联系我们"链接发送邮件，或者在个人中心页面找到"反馈与帮助"选项提交您的问题。我们的客服团队会尽快回复您。" 
    }
  ]
};

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * 处理用户查询并返回AI回复
 * @param query 用户问题
 * @returns AI回复内容
 */
export const processUserQuery = async (query: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  
  // 根据用户问题在知识库中查找匹配的回答
  for (const category of Object.keys(knowledgeBase)) {
    for (const item of knowledgeBase[category as keyof typeof knowledgeBase]) {
      if (lowerQuery.includes(item.question.toLowerCase())) {
        return item.answer;
      }
    }
  }
  
  // 关键词匹配
  if (lowerQuery.includes('思维导图') && lowerQuery.includes('如何') || lowerQuery.includes('怎么')) {
    if (lowerQuery.includes('创建') || lowerQuery.includes('新建') || lowerQuery.includes('制作')) {
      return knowledgeBase.mindmap[1].answer;
    } else if (lowerQuery.includes('编辑') || lowerQuery.includes('修改')) {
      return knowledgeBase.mindmap[2].answer;
    } else if (lowerQuery.includes('分享') || lowerQuery.includes('共享')) {
      return knowledgeBase.mindmap[3].answer;
    }
  }

  if (lowerQuery.includes('搜索') || lowerQuery.includes('查找')) {
    return knowledgeBase.search[0].answer;
  }

  if (lowerQuery.includes('标签') || lowerQuery.includes('分类')) {
    return knowledgeBase.search[1].answer;
  }

  if (lowerQuery.includes('密码') && (lowerQuery.includes('忘记') || lowerQuery.includes('重置'))) {
    return knowledgeBase.general[0].answer;
  }

  if (lowerQuery.includes('联系') || lowerQuery.includes('客服') || lowerQuery.includes('帮助')) {
    return knowledgeBase.general[1].answer;
  }
  
  // 如果没有找到匹配的回答，返回默认回复
  return "抱歉，我还不太理解这个问题。您可以尝试询问关于思维导图的创建、编辑、分享，或者资料搜索、标签使用等相关问题。";
};

/**
 * 获取用户的思维导图列表
 * @returns 思维导图列表摘要
 */
export const getUserMindmapSummary = (): string => {
  const mindmaps = mindmapService.getAll();
  
  if (mindmaps.length === 0) {
    return "您目前还没有创建任何思维导图。点击"思维导图管理"中的"+"按钮开始创建吧！";
  }
  
  const recentMindmaps = mindmaps.slice(0, 3).map(map => map.title).join('、');
  return `您已创建了${mindmaps.length}个思维导图，最近的有：${recentMindmaps}。您可以在"思维导图管理"中查看和编辑它们。`;
};

/**
 * 提供当前正在查看的内容的相关建议
 * @param context 当前上下文信息
 * @returns 针对当前上下文的建议
 */
export const getContextualHelp = (context: {page?: string; id?: number}): string => {
  if (!context.page) {
    return "您可以尝试浏览我们的思维导图工具或资料搜索功能，有任何问题随时询问。";
  }
  
  switch (context.page) {
    case 'mindmap-edit':
      return "在思维导图编辑页面，您可以：\n- 双击节点编辑内容\n- 拖动节点调整位置\n- 右键点击查看更多选项\n- 使用顶部工具栏添加新节点";
    case 'mindmap-view':
      return "您正在查看思维导图。可以点击节点查看详情，使用右上角的缩放控制调整视图，点击"编辑导图"按钮进行编辑。";
    case 'material-search':
      return "在资料搜索页面，您可以通过关键词和标签筛选查找资料。选择左侧的分类可以缩小搜索范围，点击资料卡片可以查看详情。";
    default:
      return "您正在浏览应用，有任何功能操作上的问题可以随时询问我。";
  }
};

export default {
  processUserQuery,
  getUserMindmapSummary,
  getContextualHelp
}; 