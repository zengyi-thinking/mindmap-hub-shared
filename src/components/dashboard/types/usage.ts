/**
 * 文件使用频率统计项
 */
export interface FileUsageItem {
  name: string;      // 分类名称
  value: number;     // 文件数量
  color: string;     // 图表颜色
}

/**
 * 文件使用详情
 */
export interface FileUsageDetail {
  fileId: string;   // 文件ID
  fileName: string; // 文件名
  clicks: number;   // 点击次数
  lastAccessed: string; // 最后访问时间
}

/**
 * 使用时长数据
 */
export interface UsageTimeData {
  todayTime: number;    // 今日使用分钟数
  weekTime: number;     // 本周使用分钟数
  lastUpdate: string;   // 最后更新时间
  dailyRecords: {       // 每日记录
    [date: string]: number;
  };
}

/**
 * 反思记录
 */
export interface ReflectionData {
  content: string;     // 反思内容
  lastUpdated: string; // 最后更新时间
}

/**
 * 周使用数据
 */
export interface WeeklyUsageData {
  day: string;        // 星期几
  minutes: number;    // 使用分钟数
}

/**
 * 系统活动记录
 */
export interface ActivityRecord {
  timestamp: string;  // 时间戳
  type: 'login' | 'logout' | 'active' | 'inactive';  // 活动类型
  duration?: number;  // 持续时间（分钟）
} 