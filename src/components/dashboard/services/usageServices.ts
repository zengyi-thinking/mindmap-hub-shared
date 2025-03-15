
// Mock usage time data - in a real app this would come from a service
export const usageTimeService = {
  getTodayTime: () => {
    // Get stored time or default to 0
    const storedTime = localStorage.getItem('todayUsageTime');
    return storedTime ? parseInt(storedTime, 10) : 0;
  },
  getWeekTime: () => {
    // Get stored weekly time or default to 0
    const storedTime = localStorage.getItem('weekUsageTime');
    return storedTime ? parseInt(storedTime, 10) : 0;
  },
  saveTime: (today: number, week: number) => {
    localStorage.setItem('todayUsageTime', today.toString());
    localStorage.setItem('weekUsageTime', week.toString());
  }
};

// Mock file usage data - in a real app this would come from a service
export const fileUsageService = {
  getFileUsageStats: () => {
    // Get stored stats or return default
    const storedStats = localStorage.getItem('fileUsageStats');
    if (storedStats) {
      return JSON.parse(storedStats);
    }
    
    // Default mock data
    return [
      { name: '使用1次', value: 30, color: '#8884d8' },
      { name: '使用2-5次', value: 45, color: '#82ca9d' },
      { name: '使用超过5次', value: 25, color: '#ffc658' },
    ];
  }
};

// Mock reflection data service
export const reflectionService = {
  getReflection: () => {
    return localStorage.getItem('userReflection') || '';
  },
  saveReflection: (text: string) => {
    localStorage.setItem('userReflection', text);
  }
};
