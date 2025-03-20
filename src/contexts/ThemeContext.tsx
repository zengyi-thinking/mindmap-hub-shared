import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义主题类型和颜色类型
type ThemeColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange';

// 主题颜色预设值
export const themeColors = {
  blue: {
    primary: '#3b82f6',
    primaryDark: '#1d4ed8',
    primaryLight: '#60a5fa',
    primaryBg: 'rgba(59, 130, 246, 0.1)',
  },
  purple: {
    primary: '#8b5cf6',
    primaryDark: '#6d28d9',
    primaryLight: '#a78bfa',
    primaryBg: 'rgba(139, 92, 246, 0.1)',
  },
  green: {
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#34d399',
    primaryBg: 'rgba(16, 185, 129, 0.1)',
  },
  pink: {
    primary: '#ec4899',
    primaryDark: '#db2777',
    primaryLight: '#f472b6',
    primaryBg: 'rgba(236, 72, 153, 0.1)',
  },
  orange: {
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fb923c',
    primaryBg: 'rgba(249, 115, 22, 0.1)',
  },
};

// 主题上下文类型
interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  colors: typeof themeColors.blue;
  getThemeClasses: () => string;
  focusMode: boolean;
  toggleFocusMode?: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者属性
interface ThemeProviderProps {
  children: ReactNode;
}

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储中获取暗色模式设置
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      const initialValue = saved ? JSON.parse(saved) : false;
      return initialValue || window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
      return false;
    }
  });

  // 从本地存储中获取主题颜色设置
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    try {
      const savedColor = localStorage.getItem('themeColor');
      return (savedColor as ThemeColor) || 'blue';
    } catch (error) {
      console.error('Error reading themeColor from localStorage:', error);
      return 'blue';
    }
  });
  
  // 从本地存储中获取专注模式设置
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('focusMode');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error reading focusMode from localStorage:', error);
      return false;
    }
  });

  // 获取当前主题颜色的值
  const colors = themeColors[themeColor];

  // 切换暗色模式
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  
  // 切换专注模式
  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  // 获取主题类名
  const getThemeClasses = () => {
    const classes = [];
    if (darkMode) {
      classes.push('dark');
    }
    classes.push(`theme-${themeColor}`);
    if (focusMode) {
      classes.push('focus-mode');
    }
    return classes.join(' ');
  };

  // 应用主题颜色到CSS变量
  const applyThemeColors = () => {
    try {
      if (!colors) return;
      
      // 设置我们自定义的CSS变量
      document.documentElement.style.setProperty('--color-primary', colors.primary);
      document.documentElement.style.setProperty('--color-primary-dark', colors.primaryDark);
      document.documentElement.style.setProperty('--color-primary-light', colors.primaryLight);
      document.documentElement.style.setProperty('--color-primary-bg', colors.primaryBg);
      
      // 同时更新Tailwind HSL变量，确保按钮等元素也使用主题色
      // 转换十六进制到HSL的简单方法
      document.documentElement.style.setProperty('--primary', toHsl(colors.primary));
      document.documentElement.style.setProperty('--ring', toHsl(colors.primary));
    } catch (error) {
      console.error('Error applying theme colors:', error);
    }
  };
  
  // 简单的十六进制转HSL函数
  const toHsl = (hex: string): string => {
    // 移除#前缀如果存在
    hex = hex.replace('#', '');
    
    // 转换十六进制到RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // 找出最大和最小RGB值
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // 计算亮度
    let l = (max + min) / 2;
    
    let h = 0, s = 0;
    
    if (max !== min) {
      // 计算饱和度
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
      
      // 计算色相
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / (max - min) + 2;
      } else {
        h = (r - g) / (max - min) + 4;
      }
      h *= 60;
    }
    
    // 转换为百分比值
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    h = Math.round(h);
    
    return `${h} ${s}% ${l}%`;
  };

  // 当暗色模式或主题颜色改变时更新本地存储和应用主题
  useEffect(() => {
    try {
      // 防止路由问题：使用requestAnimationFrame确保DOM更新不会干扰路由
      requestAnimationFrame(() => {
        // 设置深色模式类
        document.documentElement.classList.toggle('dark', darkMode);
        
        // 设置专注模式类
        document.documentElement.classList.toggle('focus-mode', focusMode);
        
        // 移除所有主题类
        document.documentElement.className.split(' ')
          .filter(cls => cls.startsWith('theme-'))
          .forEach(cls => document.documentElement.classList.remove(cls));
        
        // 添加当前主题类
        document.documentElement.classList.add(`theme-${themeColor}`);
        
        // 应用主题颜色
        applyThemeColors();
        
        // 保存设置到本地存储
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        localStorage.setItem('themeColor', themeColor);
        localStorage.setItem('focusMode', JSON.stringify(focusMode));
      });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [darkMode, themeColor, focusMode, colors]);

  // 设置主题颜色
  const handleSetThemeColor = (color: ThemeColor) => {
    try {
      setThemeColor(color);
    } catch (error) {
      console.error('Error setting theme color:', error);
    }
  };

  // 提供上下文值
  const value = {
    darkMode,
    toggleDarkMode,
    themeColor, 
    setThemeColor: handleSetThemeColor,
    colors,
    getThemeClasses,
    focusMode,
    toggleFocusMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题的自定义钩子
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 