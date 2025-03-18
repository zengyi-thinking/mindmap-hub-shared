import React, { createContext, useContext, useState, useEffect } from 'react';

// 定义主题色彩选项
export type ThemeColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange';

// 定义字体选项
export type FontStyle = 'default' | 'rounded' | 'serif' | 'mono';

// 主题上下文类型
interface ThemeContextType {
  // 暗色/亮色模式
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // 专注模式
  focusMode: boolean;
  toggleFocusMode: () => void;
  
  // 主题色
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  
  // 字体
  fontStyle: FontStyle;
  setFontStyle: (font: FontStyle) => void;
  
  // 获取当前主题CSS类
  getThemeClasses: () => string;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题色彩映射
const themeColorClasses: Record<ThemeColor, { light: string, dark: string }> = {
  blue: {
    light: 'theme-blue-light',
    dark: 'theme-blue-dark'
  },
  purple: {
    light: 'theme-purple-light',
    dark: 'theme-purple-dark'
  },
  green: {
    light: 'theme-green-light', 
    dark: 'theme-green-dark'
  },
  pink: {
    light: 'theme-pink-light',
    dark: 'theme-pink-dark'
  },
  orange: {
    light: 'theme-orange-light',
    dark: 'theme-orange-dark'
  }
};

// 字体样式映射
const fontStyleClasses: Record<FontStyle, string> = {
  default: 'font-default',
  rounded: 'font-rounded',
  serif: 'font-serif',
  mono: 'font-mono'
};

// 本地存储键
const LOCAL_STORAGE_KEY = 'mindmap-hub-theme-settings';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储加载设置或使用默认值
  const loadSettingsFromStorage = (): {
    darkMode: boolean;
    focusMode: boolean;
    themeColor: ThemeColor;
    fontStyle: FontStyle;
  } => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse theme settings:', e);
      }
    }
    
    // 默认值
    return {
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      focusMode: false,
      themeColor: 'blue',
      fontStyle: 'default'
    };
  };
  
  // 初始化状态
  const [settings, setSettings] = useState(loadSettingsFromStorage);
  const { darkMode, focusMode, themeColor, fontStyle } = settings;
  
  // 当设置变化时保存到本地存储
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    
    // 设置文档根元素的类，适用于暗色模式
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 设置文档根元素的类，适用于专注模式
    if (focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // 应用主题色彩类
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(
      darkMode ? themeColorClasses[themeColor].dark : themeColorClasses[themeColor].light
    );
    
    // 应用字体样式类
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('font-') && cls !== 'font-sans') {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(fontStyleClasses[fontStyle]);
    
  }, [settings]);
  
  // 切换暗色模式
  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };
  
  // 切换专注模式
  const toggleFocusMode = () => {
    setSettings(prev => ({
      ...prev,
      focusMode: !prev.focusMode
    }));
  };
  
  // 设置主题色
  const setThemeColor = (color: ThemeColor) => {
    setSettings(prev => ({
      ...prev,
      themeColor: color
    }));
  };
  
  // 设置字体
  const setFontStyle = (font: FontStyle) => {
    setSettings(prev => ({
      ...prev,
      fontStyle: font
    }));
  };
  
  // 获取当前主题的CSS类
  const getThemeClasses = () => {
    const colorClass = darkMode 
      ? themeColorClasses[themeColor].dark 
      : themeColorClasses[themeColor].light;
    
    const fontClass = fontStyleClasses[fontStyle];
    const focusClass = focusMode ? 'focus-mode' : '';
    
    return [colorClass, fontClass, focusClass, darkMode ? 'dark' : ''].filter(Boolean).join(' ');
  };
  
  const value = {
    darkMode,
    toggleDarkMode,
    focusMode,
    toggleFocusMode,
    themeColor,
    setThemeColor,
    fontStyle,
    setFontStyle,
    getThemeClasses
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义hook，方便使用主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 