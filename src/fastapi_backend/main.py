from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import random
import time

# 定义请求模型
class MindMapRequest(BaseModel):
    keyword: str
    depth: Optional[int] = 2
    maxNodesPerLevel: Optional[int] = 5
    includeLinks: Optional[bool] = True

# 定义节点模型
class MindMapNode(BaseModel):
    id: Optional[str] = None
    name: str
    url: Optional[str] = None
    children: Optional[List['MindMapNode']] = None
    depth: Optional[int] = None
    color: Optional[str] = None

# 允许自引用
MindMapNode.update_forward_refs()

# 定义响应模型
class MindMapResponse(BaseModel):
    data: MindMapNode
    keyword: str
    timestamp: str

# 创建FastAPI应用
app = FastAPI(title="AI思维导图生成服务")

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有头
)

# 示例关键词和相关内容映射
keyword_content_map = {
    "人工智能": {
        "概念定义": ["什么是人工智能", "AI的历史", "强AI与弱AI", "图灵测试"],
        "核心技术": ["机器学习", "深度学习", "神经网络", "自然语言处理", "计算机视觉"],
        "应用领域": ["医疗诊断", "自动驾驶", "智能客服", "推荐系统", "智能家居"],
        "伦理问题": ["隐私保护", "就业影响", "算法偏见", "安全风险"],
        "未来发展": ["人机共生", "通用人工智能", "意识问题研究"],
    },
    "Web开发": {
        "前端开发": ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular"],
        "后端开发": ["Node.js", "Python", "Java", "PHP", "Go", "数据库"],
        "开发工具": ["VS Code", "Git", "Docker", "CI/CD", "测试工具"],
        "网站架构": ["前后端分离", "微服务", "Serverless", "CDN", "负载均衡"],
        "性能优化": ["代码分割", "懒加载", "缓存策略", "网络优化", "SEO"],
    },
    "数据科学": {
        "基础概念": ["统计学基础", "概率论", "线性代数", "微积分"],
        "数据处理": ["数据清洗", "特征工程", "数据转换", "降维"],
        "机器学习": ["监督学习", "无监督学习", "强化学习", "模型评估"],
        "数据可视化": ["图表类型", "可视化工具", "交互式可视化", "数据叙事"],
        "应用领域": ["商业智能", "预测分析", "推荐系统", "风险评估"],
    }
}

# 示例URL映射
url_patterns = {
    "人工智能": "https://zh.wikipedia.org/wiki/人工智能",
    "机器学习": "https://zh.wikipedia.org/wiki/机器学习",
    "深度学习": "https://zh.wikipedia.org/wiki/深度学习",
    "神经网络": "https://zh.wikipedia.org/wiki/人工神经网络",
    "自然语言处理": "https://zh.wikipedia.org/wiki/自然语言处理",
    "计算机视觉": "https://zh.wikipedia.org/wiki/计算机视觉",
    "Web开发": "https://developer.mozilla.org/zh-CN/docs/Learn",
    "HTML": "https://developer.mozilla.org/zh-CN/docs/Web/HTML",
    "CSS": "https://developer.mozilla.org/zh-CN/docs/Web/CSS",
    "JavaScript": "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",
    "React": "https://reactjs.org/",
    "Vue": "https://vuejs.org/",
    "Node.js": "https://nodejs.org/",
    "数据科学": "https://zh.wikipedia.org/wiki/数据科学",
    "统计学": "https://zh.wikipedia.org/wiki/统计学",
    "概率论": "https://zh.wikipedia.org/wiki/概率论",
    "数据可视化": "https://zh.wikipedia.org/wiki/数据可视化",
}

# 生成随机颜色
def generate_random_color():
    colors = [
        "#4299e1", "#3182ce", "#2b6cb0",  # 蓝色系
        "#48bb78", "#38a169", "#2f855a",  # 绿色系
        "#ed8936", "#dd6b20", "#c05621",  # 橙色系
        "#9f7aea", "#805ad5", "#6b46c1",  # 紫色系
        "#f56565", "#e53e3e", "#c53030",  # 红色系
    ]
    return random.choice(colors)

# 生成随机ID
def generate_id():
    return f"node-{int(time.time() * 1000)}-{random.randint(1000, 9999)}"

# 生成思维导图数据
def generate_mindmap(keyword: str, depth: int, max_nodes_per_level: int, include_links: bool) -> MindMapNode:
    # 尝试匹配关键词
    content_map = None
    for key in keyword_content_map:
        if keyword.lower() in key.lower() or key.lower() in keyword.lower():
            content_map = keyword_content_map[key]
            keyword = key  # 使用完整的关键词
            break
    
    # 如果没有匹配到，使用通用结构
    if not content_map:
        content_map = {
            f"{keyword}的基本概念": [f"{keyword}的定义", f"{keyword}的历史", f"{keyword}的特点"],
            f"{keyword}的应用": [f"{keyword}在行业中的应用", f"{keyword}的实际案例", f"{keyword}的前景"],
            f"{keyword}的发展": [f"{keyword}的现状", f"{keyword}的趋势", f"{keyword}的挑战"],
            f"相关技术": ["相关领域1", "相关领域2", "相关领域3"],
            f"学习资源": ["书籍推荐", "在线课程", "实践项目"]
        }
    
    # 创建根节点
    root = MindMapNode(
        id=generate_id(),
        name=keyword,
        url=url_patterns.get(keyword) if include_links else None,
        children=[]
    )
    
    # 添加主要分支（一级节点）
    categories = list(content_map.keys())
    random.shuffle(categories)
    selected_categories = categories[:min(len(categories), max_nodes_per_level)]
    
    for category in selected_categories:
        category_node = MindMapNode(
            id=generate_id(),
            name=category,
            color=generate_random_color(),
            children=[]
        )
        root.children.append(category_node)
        
        # 如果深度大于1，添加二级节点
        if depth > 1:
            subcategories = content_map[category]
            random.shuffle(subcategories)
            selected_subcategories = subcategories[:min(len(subcategories), max_nodes_per_level)]
            
            for subcategory in selected_subcategories:
                subcat_node = MindMapNode(
                    id=generate_id(),
                    name=subcategory,
                    url=url_patterns.get(subcategory) if include_links and subcategory in url_patterns else None,
                    children=[]
                )
                category_node.children.append(subcat_node)
                
                # 如果深度大于2，添加三级节点
                if depth > 2:
                    # 生成一些模拟的第三级节点
                    num_third_level = random.randint(2, max_nodes_per_level)
                    for i in range(num_third_level):
                        third_node = MindMapNode(
                            id=generate_id(),
                            name=f"{subcategory}的方面{i+1}",
                            children=[]
                        )
                        subcat_node.children.append(third_node)
                        
                        # 如果深度大于3，添加四级节点
                        if depth > 3:
                            # 生成一些模拟的第四级节点
                            num_fourth_level = random.randint(1, 3)
                            for j in range(num_fourth_level):
                                fourth_node = MindMapNode(
                                    id=generate_id(),
                                    name=f"详细内容{j+1}",
                                    children=[]
                                )
                                third_node.children.append(fourth_node)
    
    return root

# 思维导图生成端点
@app.post("/generate_mindmap", response_model=MindMapResponse)
async def create_mindmap(request: MindMapRequest):
    if not request.keyword or len(request.keyword.strip()) == 0:
        raise HTTPException(status_code=400, detail="关键词不能为空")
    
    # 限制深度在1-4之间
    depth = max(1, min(request.depth, 4)) if request.depth else 2
    
    # 限制每层节点数在3-8之间
    max_nodes = max(3, min(request.maxNodesPerLevel, 8)) if request.maxNodesPerLevel else 5
    
    # 模拟处理延迟
    time.sleep(1)
    
    # 生成思维导图
    mind_map_data = generate_mindmap(
        keyword=request.keyword,
        depth=depth,
        max_nodes_per_level=max_nodes,
        include_links=request.includeLinks
    )
    
    # 返回响应
    return MindMapResponse(
        data=mind_map_data,
        keyword=request.keyword,
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S")
    )

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

# 如果直接运行此文件
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 