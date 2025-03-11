
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    }
  };

  const float = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">思维导图中心</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link to="/dashboard">
            <Button>开始使用 <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={item} className="inline-block mb-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
            智能思维导图工具
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            创建、分享和探索<br />思维导图的全新方式
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            一个集思维导图创建、资料分享、知识探索于一体的综合平台，
            帮助您更高效地组织思想、探索知识和分享见解。
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-8 rounded-full">
                开始使用
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full">
                查看演示
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          animate={float}
          className="relative w-full max-w-4xl mx-auto glass-card rounded-2xl shadow-xl overflow-hidden"
        >
          <img 
            src="https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80&w=2000" 
            alt="思维导图平台预览" 
            className="w-full h-auto object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </motion.div>
      </main>
      
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} 思维导图中心. 保留所有权利.</p>
      </footer>
    </div>
  );
};

export default Index;
