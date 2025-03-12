
import { Node, Edge, MarkerType } from '@xyflow/react';
import { findTagPath } from './utils/TagUtils';
import { TagCategory } from '@/types/materials';

interface MindMapGeneratorOptions {
  searchQuery: string;
  selectedTags: string[];
  materialsData: any[];
  tagHierarchy: TagCategory[];
}

export const generateMindMap = (options: MindMapGeneratorOptions): { nodes: Node[], edges: Edge[] } => {
  const { searchQuery, selectedTags, materialsData, tagHierarchy } = options;
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];
  
  const centralNode: Node = {
    id: 'central',
    type: 'input',
    data: { label: searchQuery || '资料搜索' },
    position: { x: 400, y: 300 },
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: 'none',
      borderRadius: '50%',
      width: 120,
      height: 120,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
    },
  };
  
  newNodes.push(centralNode);
  
  const tagsToProcess = selectedTags.length > 0 
    ? selectedTags 
    : materialsData.length > 0 && materialsData[0]?.tags 
      ? materialsData[0].tags.slice(0, 3) 
      : ['比赛', '数学建模', '比赛规则'];
  
  tagsToProcess.forEach((tag, tagIndex) => {
    const tagPath = findTagPath(tagHierarchy, tag);
    
    if (tagPath.length === 0) {
      const customTagNode: Node = {
        id: `custom-${tagIndex}`,
        data: { label: tag, tagName: tag, isLastLevel: true },
        position: { 
          x: 400 + 250 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)), 
          y: 300 + 250 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) 
        },
        style: {
          background: 'hsl(var(--accent))',
          border: '1px solid hsl(var(--accent-foreground) / 0.2)',
          borderRadius: '16px',
          padding: '8px 16px',
          fontSize: '13px',
          cursor: 'pointer',
        },
      };
      
      newNodes.push(customTagNode);
      
      newEdges.push({
        id: `edge-central-custom-${tagIndex}`,
        source: 'central',
        target: `custom-${tagIndex}`,
        animated: true,
        style: { stroke: 'hsl(var(--primary) / 0.5)' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: 'hsl(var(--primary))',
        },
      });
      
      const relatedMaterials = materialsData.filter(m => 
        m.tags && m.tags.includes(tag)
      );
      
      relatedMaterials.forEach((material, materialIndex) => {
        const materialNode: Node = {
          id: `material-custom-${tagIndex}-${materialIndex}`,
          data: { 
            label: material.title || material.file.name,
            materialId: material.id
          },
          position: { 
            x: 400 + 250 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2), 
            y: 300 + 250 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2) 
          },
          style: {
            background: 'white',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '12px',
            width: 120,
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            cursor: 'pointer',
          },
        };
        
        newNodes.push(materialNode);
        
        newEdges.push({
          id: `edge-custom-${tagIndex}-material-${materialIndex}`,
          source: `custom-${tagIndex}`,
          target: `material-custom-${tagIndex}-${materialIndex}`,
          style: { stroke: 'hsl(var(--border))' },
          type: 'smoothstep',
        });
      });
    } else {
      let lastLevelNodeIds: string[] = ['central'];
      
      tagPath.forEach((pathTag, pathIndex) => {
        const isLastLevel = pathIndex === tagPath.length - 1;
        const levelNodeId = `level-${tagIndex}-${pathIndex}`;
        
        const levelNode: Node = {
          id: levelNodeId,
          data: { 
            label: pathTag, 
            tagName: pathTag, 
            isLastLevel: isLastLevel,
            fullPath: tagPath.slice(0, pathIndex + 1),
          },
          position: { 
            x: 400 + (pathIndex + 1) * 180 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)), 
            y: 300 + (pathIndex + 1) * 180 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) 
          },
          style: {
            background: isLastLevel ? 'hsl(180, 70%, 85%)' : 'hsl(var(--accent))',
            border: '1px solid hsl(var(--accent-foreground) / 0.2)',
            borderRadius: '16px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: isLastLevel ? 'bold' : 'normal',
            cursor: 'pointer',
          },
        };
        
        newNodes.push(levelNode);
        
        lastLevelNodeIds.forEach(sourceId => {
          newEdges.push({
            id: `edge-${sourceId}-${levelNodeId}`,
            source: sourceId,
            target: levelNodeId,
            animated: pathIndex === 0,
            style: { stroke: 'hsl(var(--primary) / 0.5)' },
            markerEnd: pathIndex === 0 ? {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
              color: 'hsl(var(--primary))',
            } : undefined,
          });
        });
        
        if (isLastLevel) {
          const relatedMaterials = materialsData.filter(m => {
            if (!m.tags || m.tags.length === 0) return false;
            return m.tags.includes(pathTag);
          });
          
          relatedMaterials.forEach((material, materialIndex) => {
            const materialNode: Node = {
              id: `material-${tagIndex}-${pathIndex}-${materialIndex}`,
              data: { 
                label: material.title || material.file?.name,
                materialId: material.id
              },
              position: { 
                x: 400 + (pathIndex + 1) * 180 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2), 
                y: 300 + (pathIndex + 1) * 180 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2) 
              },
              style: {
                background: 'white',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                width: 120,
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                cursor: 'pointer',
              },
            };
            
            newNodes.push(materialNode);
            
            newEdges.push({
              id: `edge-${levelNodeId}-material-${materialIndex}`,
              source: levelNodeId,
              target: `material-${tagIndex}-${pathIndex}-${materialIndex}`,
              style: { stroke: 'hsl(var(--border))' },
              type: 'smoothstep',
            });
          });
        }
        
        lastLevelNodeIds = [levelNodeId];
      });
    }
  });
  
  return { nodes: newNodes, edges: newEdges };
};
