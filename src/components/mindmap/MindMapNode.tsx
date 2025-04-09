import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Typography, Badge, Tooltip, Upload, message } from 'antd';
import {
  FileImageOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  StarOutlined,
  EyeOutlined,
  PlusOutlined,
  MinusOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { getThemeStyles } from '../../styles/mindmap-themes';
import { UploadedFile, uploadFile } from '../../services/file-upload';
import { FilePreview } from './FilePreview';

const { Text } = Typography;

export interface MindMapNodeData {
  label: string;
  level: number;
  status?: 'new' | 'read' | 'important';
  hasChildren?: boolean;
  isExpanded?: boolean;
  file?: UploadedFile;
  onFileUpload?: (nodeId: string, file: UploadedFile) => void;
}

const MindMapNode: React.FC<NodeProps<MindMapNodeData>> = ({
  id,
  data,
  isConnectable,
  selected
}) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const theme = getThemeStyles(themes.professional);
  const nodeStyle = theme.node[`level${data.level}` as keyof typeof theme.node];

  const handleFileUpload = async (file: File) => {
    try {
      const uploadedFile = await uploadFile(file);
      data.onFileUpload?.(id, uploadedFile);
      return false; // 阻止默认上传行为
    } catch (error) {
      message.error('文件上传失败');
      return false;
    }
  };

  const handleClick = () => {
    if (data.file) {
      setIsPreviewVisible(true);
    }
  };

  const getStatusBadge = () => {
    if (!data.status) return null;

    const statusConfig = {
      new: { color: '#52c41a', icon: <PlusOutlined /> },
      read: { color: '#1890ff', icon: <EyeOutlined /> },
      important: { color: '#f5222d', icon: <StarOutlined /> },
    };

    return (
      <Badge
        status="processing"
        color={statusConfig[data.status].color}
        text={statusConfig[data.status].icon}
      />
    );
  };

  const getFileIcon = () => {
    if (!data.file) return null;

    const iconConfig = {
      'image/': <FileImageOutlined />,
      'text/': <FileTextOutlined />,
      'application/pdf': <FilePdfOutlined />,
    };

    const icon = Object.entries(iconConfig).find(([type]) =>
      data.file?.type.startsWith(type)
    )?.[1] || <FileTextOutlined />;

    return (
      <Tooltip title={data.file.name}>
        {icon}
      </Tooltip>
    );
  };

  const getExpandIcon = () => {
    if (!data.hasChildren) return null;

    return (
      <Tooltip title={data.isExpanded ? "折叠" : "展开"}>
        {data.isExpanded ? <MinusOutlined /> : <PlusOutlined />}
      </Tooltip>
    );
  };

  return (
    <>
      <div
        style={{
          padding: '10px',
          borderRadius: nodeStyle.borderRadius,
          boxShadow: nodeStyle.boxShadow,
          backgroundColor: nodeStyle.backgroundColor,
          border: selected ? '2px solid #1890ff' : 'none',
          cursor: data.file ? 'pointer' : 'default',
        }}
        onClick={handleClick}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: nodeStyle.backgroundColor,
            border: '2px solid #fff',
            width: '8px',
            height: '8px',
          }}
          isConnectable={isConnectable}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: nodeStyle.color,
                fontSize: nodeStyle.fontSize,
                fontWeight: data.level === 0 ? 'bold' : 'normal',
                margin: 0,
              }}
            >
              {data.label}
            </Text>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {getStatusBadge()}
              {getFileIcon()}
              {getExpandIcon()}
              <Upload
                showUploadList={false}
                beforeUpload={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              >
                <Tooltip title="上传文件">
                  <UploadOutlined style={{ color: nodeStyle.color }} />
                </Tooltip>
              </Upload>
            </div>
          </div>

          {data.file?.type.startsWith('image/') && (
            <img
              src={data.file.url}
              alt={data.file.name}
              style={{
                width: '100%',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: nodeStyle.backgroundColor,
            border: '2px solid #fff',
            width: '8px',
            height: '8px',
          }}
          isConnectable={isConnectable}
        />
      </div>

      <FilePreview
        file={data.file || null}
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
      />
    </>
  );
};

export default memo(MindMapNode); 