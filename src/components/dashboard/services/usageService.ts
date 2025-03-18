import { 
  FileUsageItem, 
  FileUsageDetail, 
  UsageTimeData, 
  ReflectionData,
  ActivityRecord
} from '../types/usage';
import { 
  getTodayStartTime, 
  getWeekStartTime, 
  shouldResetTime,
  calculateMinutes,
  getWeekDays,
  formatWeekday
} from '../utils/timeUtils';

// 存储键名
const STORAGE_KEYS = {
  TIME_DATA: 'usage_time_data',
  FILE_USAGE: 'file_usage_data',
  FILE_DETAILS: 'file_usage_details',
  REFLECTION: 'user_reflection',
  ACTIVITY_LOG: 'activity_log',
  LAST_ACTIVE: 'last_active_timestamp',
};

// 默认颜色
const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

/**
 * 使用时间服务
 */
export const usageTimeService = {
  /**
   * 获取使用时间数据
   */
  getTimeData(): UsageTimeData {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.TIME_DATA);
      let timeData: UsageTimeData = storedData 
        ? JSON.parse(storedData) 
        : {
            todayTime: 0,
            weekTime: 0,
            lastUpdate: new Date().toISOString(),
            dailyRecords: {},
          };
      
      // 检查是否需要重置今日时间
      const todayStart = getTodayStartTime();
      if (shouldResetTime(timeData.lastUpdate, todayStart)) {
        // 保存昨天的记录到dailyRecords
        if (timeData.todayTime > 0) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const dateKey = yesterday.toISOString().split('T')[0];
          timeData.dailyRecords[dateKey] = timeData.todayTime;
        }
        
        // 重置今日时间
        timeData.todayTime = 0;
      }
      
      // 检查是否需要重置本周时间
      const weekStart = getWeekStartTime();
      if (shouldResetTime(timeData.lastUpdate, weekStart)) {
        timeData.weekTime = 0;
      }
      
      // 更新最后更新时间
      timeData.lastUpdate = new Date().toISOString();
      
      this.saveTimeData(timeData);
      return timeData;
    } catch (error) {
      console.error('获取使用时间数据失败:', error);
      return {
        todayTime: 0,
        weekTime: 0,
        lastUpdate: new Date().toISOString(),
        dailyRecords: {},
      };
    }
  },
  
  /**
   * 更新使用时间
   */
  updateUsageTime(additionalMinutes: number): void {
    try {
      if (additionalMinutes <= 0) {
        console.warn('忽略无效的时间增量:', additionalMinutes);
        return;
      }
      
      if (additionalMinutes > 60) {
        console.warn('时间增量过大，已限制为60分钟');
        additionalMinutes = 60; // 限制单次增加的时间
      }
      
      const timeData = this.getTimeData();
      
      // 更新时间
      timeData.todayTime += additionalMinutes;
      timeData.weekTime += additionalMinutes;
      timeData.lastUpdate = new Date().toISOString();
      
      // 更新今日记录
      const dateKey = new Date().toISOString().split('T')[0];
      timeData.dailyRecords[dateKey] = (timeData.dailyRecords[dateKey] || 0) + additionalMinutes;
      
      // 输出调试信息
      console.log(`时间已更新: +${additionalMinutes}分钟, 今日总计: ${timeData.todayTime}分钟`);
      
      this.saveTimeData(timeData);
      
      // 主动触发存储事件，以便其他标签页也能更新
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('更新使用时间失败:', error);
    }
  },
  
  /**
   * 保存使用时间数据
   */
  saveTimeData(timeData: UsageTimeData): void {
    localStorage.setItem(STORAGE_KEYS.TIME_DATA, JSON.stringify(timeData));
  },
  
  /**
   * 获取每周使用数据
   */
  getWeeklyData() {
    const timeData = this.getTimeData();
    const weekDays = getWeekDays();
    
    return weekDays.map(day => {
      const dateKey = day.toISOString().split('T')[0];
      const isToday = dateKey === new Date().toISOString().split('T')[0];
      
      return {
        day: formatWeekday(day),
        minutes: isToday 
          ? timeData.todayTime 
          : (timeData.dailyRecords[dateKey] || 0)
      };
    });
  },
  
  /**
   * 记录活动
   */
  recordActivity(type: ActivityRecord['type']): void {
    try {
      const now = new Date();
      const activity: ActivityRecord = {
        timestamp: now.toISOString(),
        type,
      };
      
      // 如果是非活动状态，计算持续时间
      if (type === 'inactive') {
        const lastActiveStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
        if (lastActiveStr) {
          const lastActive = new Date(lastActiveStr);
          const durationMinutes = calculateMinutes(lastActive, now);
          
          // 只有合理的持续时间才记录（超过0分钟且不超过60分钟）
          if (durationMinutes > 0 && durationMinutes <= 60) {
            console.log(`记录使用时间: ${durationMinutes}分钟`);
            activity.duration = durationMinutes;
            this.updateUsageTime(durationMinutes);
          }
        }
      } else if (type === 'active') {
        // 检查最后活动时间，如果超过30分钟，视为新会话
        const lastActiveStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
        if (lastActiveStr) {
          const lastActive = new Date(lastActiveStr);
          const idleMinutes = calculateMinutes(lastActive, now);
          
          // 如果空闲超过30分钟，先处理为inactive，然后再开始新会话
          if (idleMinutes > 30) {
            this.recordActivity('inactive');
          }
        }
        
        // 记录最后活动时间
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, now.toISOString());
        
        // 主动记录1分钟初始时间，确保即使短暂访问也有记录
        if (!lastActiveStr) {
          this.updateUsageTime(1);
        }
      }
      
      // 存储活动记录
      const activityLogStr = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
      const activityLog: ActivityRecord[] = activityLogStr ? JSON.parse(activityLogStr) : [];
      activityLog.push(activity);
      
      // 只保留最新的100条记录
      if (activityLog.length > 100) {
        activityLog.shift();
      }
      
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(activityLog));
    } catch (error) {
      console.error('记录活动失败:', error);
    }
  },
};

/**
 * 文件使用服务
 */
export const fileUsageService = {
  /**
   * 获取文件使用统计数据
   */
  getFileUsageStats(): FileUsageItem[] {
    try {
      const storedStats = localStorage.getItem(STORAGE_KEYS.FILE_USAGE);
      if (storedStats) {
        return JSON.parse(storedStats);
      }
      
      // 默认数据
      return [
        { name: '使用1次', value: 30, color: DEFAULT_COLORS[0] },
        { name: '使用2-5次', value: 45, color: DEFAULT_COLORS[1] },
        { name: '使用超过5次', value: 25, color: DEFAULT_COLORS[2] },
      ];
    } catch (error) {
      console.error('获取文件使用统计数据失败:', error);
      return [
        { name: '使用1次', value: 0, color: DEFAULT_COLORS[0] },
        { name: '使用2-5次', value: 0, color: DEFAULT_COLORS[1] },
        { name: '使用超过5次', value: 0, color: DEFAULT_COLORS[2] },
      ];
    }
  },
  
  /**
   * 记录文件点击
   */
  recordFileClick(fileId: string, fileName: string): void {
    try {
      // 获取文件详情
      const detailsStr = localStorage.getItem(STORAGE_KEYS.FILE_DETAILS);
      const details: Record<string, FileUsageDetail> = detailsStr ? JSON.parse(detailsStr) : {};
      
      // 更新点击数据
      if (details[fileId]) {
        details[fileId].clicks += 1;
        details[fileId].lastAccessed = new Date().toISOString();
      } else {
        details[fileId] = {
          fileId,
          fileName,
          clicks: 1,
          lastAccessed: new Date().toISOString(),
        };
      }
      
      // 保存文件详情
      localStorage.setItem(STORAGE_KEYS.FILE_DETAILS, JSON.stringify(details));
      
      // 更新使用统计
      this.updateUsageStats();
    } catch (error) {
      console.error('记录文件点击失败:', error);
    }
  },
  
  /**
   * 更新使用统计
   */
  updateUsageStats(): void {
    try {
      const detailsStr = localStorage.getItem(STORAGE_KEYS.FILE_DETAILS);
      if (!detailsStr) return;
      
      const details: Record<string, FileUsageDetail> = JSON.parse(detailsStr);
      const usageStats: FileUsageItem[] = [
        { name: '使用1次', value: 0, color: DEFAULT_COLORS[0] },
        { name: '使用2-5次', value: 0, color: DEFAULT_COLORS[1] },
        { name: '使用超过5次', value: 0, color: DEFAULT_COLORS[2] },
      ];
      
      // 计算各类别的文件数量
      Object.values(details).forEach(detail => {
        if (detail.clicks === 1) {
          usageStats[0].value += 1;
        } else if (detail.clicks >= 2 && detail.clicks <= 5) {
          usageStats[1].value += 1;
        } else if (detail.clicks > 5) {
          usageStats[2].value += 1;
        }
      });
      
      // 保存统计数据
      localStorage.setItem(STORAGE_KEYS.FILE_USAGE, JSON.stringify(usageStats));
    } catch (error) {
      console.error('更新使用统计失败:', error);
    }
  },
  
  /**
   * 获取文件使用详情
   */
  getFileUsageDetails(): FileUsageDetail[] {
    try {
      const detailsStr = localStorage.getItem(STORAGE_KEYS.FILE_DETAILS);
      if (!detailsStr) return [];
      
      const details: Record<string, FileUsageDetail> = JSON.parse(detailsStr);
      return Object.values(details).sort((a, b) => b.clicks - a.clicks);
    } catch (error) {
      console.error('获取文件使用详情失败:', error);
      return [];
    }
  },
};

/**
 * 反思服务
 */
export const reflectionService = {
  /**
   * 获取反思数据
   */
  getReflection(): ReflectionData {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.REFLECTION);
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      return {
        content: '',
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取反思数据失败:', error);
      return {
        content: '',
        lastUpdated: new Date().toISOString(),
      };
    }
  },
  
  /**
   * 保存反思
   */
  saveReflection(content: string): void {
    try {
      const reflection: ReflectionData = {
        content,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEYS.REFLECTION, JSON.stringify(reflection));
    } catch (error) {
      console.error('保存反思失败:', error);
    }
  },
}; 