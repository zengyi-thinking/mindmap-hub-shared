/**
 * 思维导图节点类型
 */
export interface MindMapNode {
  id?: string;                   // 节点唯一ID
  name: string;                  // 节点名称/标题
  children?: MindMapNode[];      // 子节点
  color?: string;                // 节点颜色（可选）
  url?: string;                  // 关联URL（可选）
  data?: Record<string, any>;    // 附加数据（可选）
}

/**
 * 生成思维导图请求参数
 */
export interface GenerateMindMapRequest {
  keyword: string;
  depth?: number;
  maxNodesPerLevel?: number;
  includeLinks?: boolean;
}

/**
 * 生成思维导图响应数据
 */
export interface GenerateMindMapResponse {
  data: MindMapNode;
  keyword: string;
  timestamp: string;
}

/**
 * D3思维导图层级节点
 * D3.js内部使用的类型
 */
export interface D3MindMapNode {
  x: number;
  y: number;
  data: MindMapNode;
  parent?: D3MindMapNode;
  children?: D3MindMapNode[];
  depth: number;
  height: number;
}

/**
 * 思维导图布局类型
 */
export type MindMapLayout = 
  | 'tree'     // 树状布局（自上而下或自左向右）
  | 'radial'   // 放射状布局（从中心向外扩散）
  | 'force'    // 力导向布局
  | 'mindmap'; // 思维导图布局（水平展开）

/**
 * 思维导图主题
 */
export interface MindMapTheme {
  background: string;
  centralNode: {
    fill: string;
    stroke: string;
    text: string;
  };
  node: {
    fill: string;
    stroke: string;
    text: string;
  };
  link: {
    stroke: string;
    width: number;
  };
}

/**
 * 思维导图渲染选项
 */
export interface MindMapRenderOptions {
  layout: MindMapLayout;
  theme: MindMapTheme;
  animationDuration?: number;
  allowZoom?: boolean;
  allowPan?: boolean;
  allowNodeClick?: boolean;
  allowNodeHover?: boolean;
}

/**
 * 思维导图查看器选项
 */
export interface MindMapViewerOptions {
  allowZoom?: boolean;           // 是否允许缩放
  allowPan?: boolean;            // 是否允许平移
  allowNodeClick?: boolean;      // 是否允许节点点击
  allowNodeHover?: boolean;      // 是否允许节点悬停
  nodeSpacing?: number;          // 节点间距
  levelSpacing?: number;         // 层级间距
  animationDuration?: number;    // 动画持续时间(ms)
  autoFit?: boolean;             // 是否自动适应视图
  centerRootNode?: boolean;      // 是否居中根节点
}

/**
 * 思维导图事件处理器
 */
export interface MindMapEventHandlers {
  onNodeClick?: (node: MindMapNode) => void;     // 节点点击事件
  onNodeHover?: (node: MindMapNode | null) => void; // 节点悬停事件
  onViewChange?: (transform: { x: number, y: number, zoom: number }) => void; // 视图变化事件
}

/**
 * 思维导图数据源类型
 */
export interface MindMapData {
  rootNode: MindMapNode;         // 根节点
  layout?: MindMapLayout;        // 布局类型
  theme?: 'light' | 'dark';      // 主题
  meta?: {                       // 元数据
    title?: string;              // 标题
    description?: string;        // 描述
    author?: string;             // 作者
    createdAt?: string;          // 创建时间
    tags?: string[];             // 标签
  };
} 