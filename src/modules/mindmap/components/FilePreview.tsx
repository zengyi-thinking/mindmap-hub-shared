import React from 'react';
import { Modal, Typography, Spin, Empty } from 'antd';
import { FileTextOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';
import { UploadedFile } from '../../services/file-upload';

const { Text, Title } = Typography;

interface FilePreviewProps {
  file: UploadedFile | null;
  visible: boolean;
  onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, visible, onClose }) => {
  if (!file) {
    return null;
  }

  const renderPreview = () => {
    if (!file) {
      return <Empty description="暂无预览" />;
    }

    if (file.type.startsWith('image/')) {
      return (
        <div style={{ textAlign: 'center' }}>
          <img
            src={file.url}
            alt={file.name}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
            }}
          />
        </div>
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={file.url}
          title={file.name}
          width="100%"
          height="calc(100vh - 200px)"
          style={{ border: 'none' }}
        />
      );
    }

    // 对于文本文件，可以尝试读取内容
    if (file.type.startsWith('text/')) {
      return (
        <div
          style={{
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {file.content || '文件内容加载中...'}
          </pre>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type="secondary">该文件类型暂不支持预览，请下载后查看</Text>
      </div>
    );
  };

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <FileImageOutlined />;
    }
    if (file.type === 'application/pdf') {
      return <FilePdfOutlined />;
    }
    return <FileTextOutlined />;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getFileIcon()}
          <span>{file.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width="80%"
      footer={null}
      style={{ top: 20 }}
      bodyStyle={{ padding: '24px', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
    >
      {renderPreview()}
    </Modal>
  );
}; 