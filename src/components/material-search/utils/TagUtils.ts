
import { TagCategory } from '@/types/materials';

export const flattenTags = (categories: TagCategory[]): string[] => {
  let tags: string[] = [];
  
  categories.forEach(category => {
    tags.push(category.name);
    
    if (category.children) {
      const level2Tags = category.children.map(child => child.name);
      tags = [...tags, ...level2Tags];
      
      category.children.forEach(child => {
        if (child.children) {
          const level3Tags = child.children.map(grandchild => grandchild.name);
          tags = [...tags, ...level3Tags];
        }
      });
    }
  });
  
  return [...new Set(tags)];
};

export const findTagPath = (tagHierarchy: TagCategory[], tagName: string): string[] => {
  for (const level1 of tagHierarchy) {
    if (level1.name === tagName) {
      return [level1.name];
    }
    
    if (level1.children) {
      for (const level2 of level1.children) {
        if (level2.name === tagName) {
          return [level1.name, level2.name];
        }
        
        if (level2.children) {
          for (const level3 of level2.children) {
            if (level3.name === tagName) {
              return [level1.name, level2.name, level3.name];
            }
          }
        }
      }
    }
  }
  
  return [];
};
