import { useEffect, useState } from 'react';

/**
 * 全局活动追踪器组件
 * 用于记录用户在系统中的活动时间
 */
const ActivityTracker: React.FC = () => {
  const [lastActive, setLastActive] = useState<Date>(new Date());
  
  // 计算和记录活动时间
  const recordActivity = () => {
    try {
      const usageData = localStorage.getItem('usage_time_data');
      let timeData = usageData
        ? JSON.parse(usageData)
        : {
            todayTime: 0,
            weekTime: 0,
            lastUpdate: new Date().toISOString(),
            dailyRecords: {},
          };
      
      // 计算活动时间（最多记录5分钟的空闲时间）
      const now = new Date();
      const diffMinutes = Math.min(
        Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60)),
        5
      );
      
      if (diffMinutes > 0) {
        // 更新今日和本周时间
        timeData.todayTime += diffMinutes;
        timeData.weekTime += diffMinutes;
        
        // 更新每日记录
        const dateKey = now.toISOString().split('T')[0];
        timeData.dailyRecords[dateKey] = (timeData.dailyRecords[dateKey] || 0) + diffMinutes;
        
        // 更新最后活动时间
        timeData.lastUpdate = now.toISOString();
        
        // 保存更新后的数据
        localStorage.setItem('usage_time_data', JSON.stringify(timeData));
        console.log(`活动时间已记录: +${diffMinutes}分钟, 今日总计: ${timeData.todayTime}分钟`);
      }
      
      // 更新最后活动时间
      setLastActive(now);
    } catch (error) {
      console.error('记录活动时间失败:', error);
    }
  };
  
  // 定期记录活动（每分钟）
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        recordActivity();
      }
    }, 60000); // 每分钟检查一次
    
    return () => clearInterval(intervalId);
  }, [lastActive]);
  
  // 监听用户交互
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      setLastActive(new Date());
    };
    
    // 注册事件监听器
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // 页面可见性变化监听
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setLastActive(new Date());
      } else {
        // 页面不可见时记录活动
        recordActivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 初始化
    setLastActive(new Date());
    
    // 清理函数
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // 组件卸载时记录最后活动
      recordActivity();
    };
  }, []);
  
  // 组件不会渲染任何内容
  return null;
};

export default ActivityTracker; 