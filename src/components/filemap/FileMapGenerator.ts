
import { Node, Edge, MarkerType } from '@xyflow/react';
import { Material } from '@/types/materials';

interface FileMapGeneratorOptions {
  materials: Material[];
  selectedTags: string[];
  searchQuery: string;
}

// Generate a mind map for files based on tags
export const generateFileMap = (options: FileMapGeneratorOptions): { nodes: Node[], edges: Edge[] } => {
  const { materials, selectedTags, searchQuery } = options;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create central node
  const centralNode: Node = {
    id: 'central',
    type: 'fileNode',
    data: { 
      label: searchQuery || '资料搜索',
      type: 'central'
    },
    position: { x: 0, y: 0 }
  };
  
  nodes.push(centralNode);
  
  // Determine which tags to display
  const tagsToDisplay = selectedTags.length > 0 
    ? selectedTags 
    : [...new Set(materials.flatMap(m => m.tags || []))].slice(0, 5);
  
  // Calculate positions for tag nodes in a radial layout
  tagsToDisplay.forEach((tag, index) => {
    const angle = (index / tagsToDisplay.length) * 2 * Math.PI;
    const radius = 250;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Find files with this tag
    const filesWithTag = materials.filter(m => m.tags && m.tags.includes(tag));
    
    // Create tag node
    const tagNodeId = `tag-${index}`;
    const tagNode: Node = {
      id: tagNodeId,
      type: 'fileNode',
      data: { 
        label: tag,
        type: 'tag',
        fileCount: filesWithTag.length
      },
      position: { x, y }
    };
    
    nodes.push(tagNode);
    
    // Create edge from central to tag
    edges.push({
      id: `e-central-${tagNodeId}`,
      source: 'central',
      target: tagNodeId,
      animated: true,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    });
    
    // Position files for this tag in a radial layout
    filesWithTag.slice(0, 5).forEach((file, fileIndex) => {
      const fileAngle = (fileIndex / Math.min(filesWithTag.length, 5)) * Math.PI + angle - Math.PI/2;
      const fileRadius = 150;
      const fileX = x + Math.cos(fileAngle) * fileRadius;
      const fileY = y + Math.sin(fileAngle) * fileRadius;
      
      const fileNodeId = `file-${tag}-${fileIndex}`;
      const fileNode: Node = {
        id: fileNodeId,
        type: 'fileNode',
        data: { 
          label: file.title,
          type: 'file',
          tags: file.tags?.slice(0, 3)
        },
        position: { x: fileX, y: fileY }
      };
      
      nodes.push(fileNode);
      
      // Create edge from tag to file
      edges.push({
        id: `e-${tagNodeId}-${fileNodeId}`,
        source: tagNodeId,
        target: fileNodeId,
        type: 'smoothstep'
      });
    });
  });
  
  // Apply auto-layout to prevent overlapping
  const nodesWithLayout = applyRadialLayout(nodes);
  
  return { nodes: nodesWithLayout, edges };
};

// Simple radial layout algorithm
const applyRadialLayout = (nodes: Node[]): Node[] => {
  // Find central node
  const centralNodeIndex = nodes.findIndex(node => node.data.type === 'central');
  if (centralNodeIndex === -1) return nodes;
  
  const centralNode = nodes[centralNodeIndex];
  const centerX = 0;
  const centerY = 0;
  
  // Get tag nodes
  const tagNodes = nodes.filter(node => node.data.type === 'tag');
  
  // Calculate positions for tag nodes
  tagNodes.forEach((tagNode, index) => {
    const angle = (index / tagNodes.length) * 2 * Math.PI;
    const radius = 250;
    tagNode.position = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
    
    // Get file nodes for this tag
    const fileNodes = nodes.filter(node => 
      node.data.type === 'file' && 
      node.id.startsWith(`file-${tagNode.data.label.replace(/\s+/g, '-')}`)
    );
    
    // Calculate positions for file nodes
    fileNodes.forEach((fileNode, fileIndex) => {
      const fileAngle = (fileIndex / fileNodes.length) * Math.PI + angle - Math.PI/2;
      const fileRadius = 150;
      fileNode.position = {
        x: tagNode.position.x + Math.cos(fileAngle) * fileRadius,
        y: tagNode.position.y + Math.sin(fileAngle) * fileRadius
      };
    });
  });
  
  return nodes;
};
