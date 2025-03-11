
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, ThumbsUp, Heart, Star, Clock, Tag, ChevronRight } from 'lucide-react';
import { Material } from '@/types/materials';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from 'framer-motion';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card subtle-hover h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{material.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {material.uploadTime} · 上传者: {material.uploader}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm mb-3">{material.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {material.tags.map((tag, index) => (
              <Badge 
                key={`${tag}-${index}`} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" /> {material.downloads}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" /> {material.likes}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {material.favorites}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex gap-2 ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <Tag className="h-4 w-4 mr-1" />
                  查看标签
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium">标签路径</h4>
                  <div className="text-sm">
                    {material.tags.map((tag, i, arr) => (
                      <span key={i}>
                        {tag}
                        {i < arr.length - 1 && <ChevronRight className="inline h-3 w-3 mx-1" />}
                      </span>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" variant="ghost">
              <Heart className="h-4 w-4 mr-1" />
              收藏
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              下载
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;
