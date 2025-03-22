import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

// 动态导入AI助手组件，避免服务端渲染问题
const AiAssistant = dynamic(
  () => import('@/components/ai/AiAssistant'), 
  { ssr: false }
);

export const metadata: Metadata = {
  title: '思维导图中心',
  description: '创建和管理你的思维导图, 将你的思想可视化',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <AiAssistant />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
} 