
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Brain, Tag } from 'lucide-react';

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
  return (
    <Card className="glass-card border-primary/20 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          资料搜索
        </CardTitle>
        <CardDescription>
          输入关键词并选择标签，系统将生成相关资料的思维导图
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="输入关键词搜索资料..."
                className="pl-9 border-primary/20 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
              />
            </div>
            <Button 
              className="sm:w-auto bg-primary hover:bg-primary/90"
              onClick={onSearch}
            >
              搜索
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
