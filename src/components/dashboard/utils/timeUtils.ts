import { format, startOfWeek, startOfDay, differenceInMinutes, isAfter } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化分钟为小时和分钟显示
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}分钟`;
  }
  
  return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
};

/**
 * 获取当日开始时间
 */
export const getTodayStartTime = (): Date => {
  return startOfDay(new Date());
};

/**
 * 获取本周开始时间（周一）
 */
export const getWeekStartTime = (): Date => {
  return startOfWeek(new Date(), { weekStartsOn: 1 }); // 1 表示周一
};

/**
 * 检查存储的时间是否应该重置
 */
export const shouldResetTime = (
  lastUpdateTime: string | null, 
  resetPoint: Date
): boolean => {
  if (!lastUpdateTime) return true;
  
  const lastUpdate = new Date(lastUpdateTime);
  return isAfter(resetPoint, lastUpdate);
};

/**
 * 计算从开始到结束的分钟数
 */
export const calculateMinutes = (
  startTime: Date,
  endTime: Date = new Date()
): number => {
  return differenceInMinutes(endTime, startTime);
};

/**
 * 格式化日期为友好显示
 */
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
};

/**
 * 格式化星期为中文
 */
export const formatWeekday = (date: Date): string => {
  return format(date, 'EEEE', { locale: zhCN }); // 例如：星期一
};

/**
 * 获取过去7天的日期数组（从周一到周日）
 */
export const getWeekDays = (): Date[] => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  
  return days;
}; 