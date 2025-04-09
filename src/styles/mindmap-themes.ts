import { Theme } from '@mui/material/styles';

export interface MindMapTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    node: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
    };
    edge: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
    };
  };
  spacing: {
    nodePadding: string;
    levelGap: string;
    branchGap: string;
  };
}

export const themes: Record<string, MindMapTheme> = {
  professional: {
    name: '专业',
    description: '适合商务和正式场合的简洁主题',
    colors: {
      primary: '#1890ff',
      secondary: '#52c41a',
      background: '#ffffff',
      text: '#262626',
      node: {
        level0: '#1890ff',
        level1: '#52c41a',
        level2: '#722ed1',
        level3: '#fa8c16',
      },
      edge: {
        level0: '#1890ff',
        level1: '#52c41a',
        level2: '#722ed1',
        level3: '#fa8c16',
      },
    },
    typography: {
      fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
      fontSize: {
        level0: '18px',
        level1: '16px',
        level2: '14px',
        level3: '12px',
      },
    },
    spacing: {
      nodePadding: '16px',
      levelGap: '80px',
      branchGap: '40px',
    },
  },
  creative: {
    name: '创意',
    description: '充满活力的创意主题',
    colors: {
      primary: '#ff4d4f',
      secondary: '#faad14',
      background: '#fafafa',
      text: '#1f1f1f',
      node: {
        level0: '#ff4d4f',
        level1: '#faad14',
        level2: '#13c2c2',
        level3: '#eb2f96',
      },
      edge: {
        level0: '#ff4d4f',
        level1: '#faad14',
        level2: '#13c2c2',
        level3: '#eb2f96',
      },
    },
    typography: {
      fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
      fontSize: {
        level0: '20px',
        level1: '16px',
        level2: '14px',
        level3: '12px',
      },
    },
    spacing: {
      nodePadding: '20px',
      levelGap: '100px',
      branchGap: '50px',
    },
  },
  education: {
    name: '教育',
    description: '适合教学和学习场景的主题',
    colors: {
      primary: '#13c2c2',
      secondary: '#722ed1',
      background: '#f0f2f5',
      text: '#1f1f1f',
      node: {
        level0: '#13c2c2',
        level1: '#722ed1',
        level2: '#fa8c16',
        level3: '#52c41a',
      },
      edge: {
        level0: '#13c2c2',
        level1: '#722ed1',
        level2: '#fa8c16',
        level3: '#52c41a',
      },
    },
    typography: {
      fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
      fontSize: {
        level0: '18px',
        level1: '16px',
        level2: '14px',
        level3: '12px',
      },
    },
    spacing: {
      nodePadding: '16px',
      levelGap: '90px',
      branchGap: '45px',
    },
  },
};

export const getThemeStyles = (theme: MindMapTheme) => ({
  node: {
    level0: {
      backgroundColor: theme.colors.node.level0,
      color: '#ffffff',
      fontSize: theme.typography.fontSize.level0,
      padding: theme.spacing.nodePadding,
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    level1: {
      backgroundColor: theme.colors.node.level1,
      color: '#ffffff',
      fontSize: theme.typography.fontSize.level1,
      padding: theme.spacing.nodePadding,
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    level2: {
      backgroundColor: theme.colors.node.level2,
      color: '#ffffff',
      fontSize: theme.typography.fontSize.level2,
      padding: theme.spacing.nodePadding,
      borderRadius: '4px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    level3: {
      backgroundColor: theme.colors.node.level3,
      color: '#ffffff',
      fontSize: theme.typography.fontSize.level3,
      padding: theme.spacing.nodePadding,
      borderRadius: '4px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
  },
  edge: {
    level0: {
      stroke: theme.colors.edge.level0,
      strokeWidth: 3,
    },
    level1: {
      stroke: theme.colors.edge.level1,
      strokeWidth: 2,
    },
    level2: {
      stroke: theme.colors.edge.level2,
      strokeWidth: 1.5,
    },
    level3: {
      stroke: theme.colors.edge.level3,
      strokeWidth: 1,
    },
  },
}); 