import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/pages/MaterialSearch.module.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Brain, Tag, History, Command } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SearchFormProps {
  onSearch: () => void;
  onFilterToggle: () => void;
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterVisible: boolean;
  selectedTags: string[];
  popularTags: string[];
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  onFilterToggle,
  onTagToggle,
  onClearTags,
  searchQuery,
  setSearchQuery,
  filterVisible,
  selectedTags,
  popularTags
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 从本地存储加载最近搜索
  useEffect(() => {
    const saved = localStorage.getItem('recentMaterialSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('无法解析最近搜索', e);
      }
    }
  }, []);

  // 保存搜索查询到最近搜索
  const saveSearchQuery = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentMaterialSearches', JSON.stringify(updatedSearches));
  };

  // 处理搜索提交
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery.trim());
    }
    setShowSearchHistory(false);
    onSearch();
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K或Command+K聚焦搜索框
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 提示用户快捷键
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "搜索提示",
        description: "按下 Ctrl+K 或 Command+K 快速聚焦搜索框",
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`${styles.glassCard} ${styles.cardShadow} border-primary/20`}>
      <CardHeader className={`pb-2 ${styles.navGradient} rounded-t-lg border-b border-primary/10`}>
        <CardTitle className={`flex items-center gap-2 text-primary ${styles.mainTitle}`}>
          <Brain className="h-5 w-5" />
          资料搜索
          <div className="ml-auto flex items-center text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border border-border">
            <Command className="h-3 w-3 mr-1" />
            <span>+</span>
            <span className="mx-1">K</span>
          </div>
        </CardTitle>
        <CardDescription className={styles.hintText}>
          输入关键词并选择标签，系统将生成相关资料的思维导图
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className={`relative flex-1 ${styles.smartSearch}`}>
              <Search className={`absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground ${styles.dynamicIcon}`} />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="尝试「人工智能」或「项目管理」..."
                className={`pl-9 border-primary/20 focus-visible:ring-primary ${styles.enhancedRadius} ${styles.searchContainer}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (recentSearches.length > 0) {
                    setShowSearchHistory(true);
                  }
                }}
                onBlur={() => {
                  // 延迟隐藏，以便点击历史记录项
                  setTimeout(() => setShowSearchHistory(false), 200);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {showSearchHistory && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border rounded-md shadow-lg z-10">
                  <div className="py-1 px-2 flex items-center text-xs text-muted-foreground border-b">
                    <History className="h-3.5 w-3.5 mr-1.5" />
                    最近搜索
                  </div>
                  {recentSearches.map((query, index) => (
                    <div 
                      key={index}
                      className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                      onClick={() => {
                        setSearchQuery(query);
                        handleSearch();
                      }}
                    >
                      <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {query}
                    </div>
                  ))}
                </div>
              )}
              {!showSearchHistory && !filterVisible && searchQuery.length === 0 && (
                <div className={styles.searchHints}>
                  <span className="text-xs text-muted-foreground"># 热门标签</span>
                  {popularTags.slice(0, 5).map(tag => (
                    <div 
                      key={tag} 
                      className={`${styles.tagBubble} ${styles.bounceIn}`}
                      onClick={() => onTagToggle(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              className={`sm:w-auto bg-primary hover:bg-primary/90 ${styles.searchButton}`}
              onClick={handleSearch}
            >
              <Search className={`h-4 w-4 mr-1 ${styles.dynamicIcon}`} />
              <span className={styles.buttonText}>搜索</span>
            </Button>
            <Button 
              variant="outline" 
              className="sm:w-auto flex items-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary"
              onClick={onFilterToggle}
            >
              <Filter className="h-4 w-4" />
              筛选
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </div>
          
          <AnimatePresence>
            {filterVisible && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900/60 border-primary/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-primary/70" />
                    按标签筛选
                  </h3>
                  {selectedTags.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs hover:text-primary hover:bg-primary/10" 
                      onClick={onClearTags}
                    >
                      清除全部
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag) 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-primary/10 border-primary/20"
                      }`}
                      onClick={() => onTagToggle(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
