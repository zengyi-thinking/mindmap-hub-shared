import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode | ((props: { error: string }) => React.ReactNode);
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean, errorMessage: string }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || '未知错误' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("错误边界捕获到错误:", error);
    console.error("错误堆栈信息:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 检查fallback是否是函数，如果是，传递错误信息
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({ error: this.state.errorMessage });
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 