import React from 'react';
import { Card, Select, Space, Slider, ColorPicker, Typography } from 'antd';
import { themes } from '../../styles/mindmap-themes';
import { LayoutType } from '../../utils/mindmap-layout';

const { Text } = Typography;

interface MindMapControlsProps {
  theme: string;
  layout: LayoutType;
  spacing: {
    x: number;
    y: number;
  };
  onThemeChange: (theme: string) => void;
  onLayoutChange: (layout: LayoutType) => void;
  onSpacingChange: (spacing: { x: number; y: number }) => void;
}

export const MindMapControls: React.FC<MindMapControlsProps> = ({
  theme,
  layout,
  spacing,
  onThemeChange,
  onLayoutChange,
  onSpacingChange,
}) => {
  return (
    <Card
      title="思维导图设置"
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 300,
        zIndex: 10,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>主题</Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            value={theme}
            onChange={onThemeChange}
            options={Object.entries(themes).map(([key, value]) => ({
              label: value.name,
              value: key,
              description: value.description,
            }))}
          />
        </div>

        <div>
          <Text strong>布局</Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            value={layout}
            onChange={onLayoutChange}
            options={[
              { label: '辐射状', value: 'radial' },
              { label: '树状', value: 'tree' },
              { label: '鱼骨图', value: 'fishbone' },
            ]}
          />
        </div>

        <div>
          <Text strong>水平间距</Text>
          <Slider
            min={50}
            max={500}
            step={10}
            value={spacing.x}
            onChange={(value) => onSpacingChange({ ...spacing, x: value })}
          />
        </div>

        <div>
          <Text strong>垂直间距</Text>
          <Slider
            min={50}
            max={500}
            step={10}
            value={spacing.y}
            onChange={(value) => onSpacingChange({ ...spacing, y: value })}
          />
        </div>

        <div>
          <Text strong>节点样式</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Text>一级节点</Text>
              <ColorPicker
                value={themes[theme].colors.node.level0}
                onChange={(color) => {
                  // 更新主题颜色
                  const newTheme = { ...themes[theme] };
                  newTheme.colors.node.level0 = color.toHexString();
                  onThemeChange(theme);
                }}
              />
            </div>
            <div>
              <Text>二级节点</Text>
              <ColorPicker
                value={themes[theme].colors.node.level1}
                onChange={(color) => {
                  const newTheme = { ...themes[theme] };
                  newTheme.colors.node.level1 = color.toHexString();
                  onThemeChange(theme);
                }}
              />
            </div>
            <div>
              <Text>三级节点</Text>
              <ColorPicker
                value={themes[theme].colors.node.level2}
                onChange={(color) => {
                  const newTheme = { ...themes[theme] };
                  newTheme.colors.node.level2 = color.toHexString();
                  onThemeChange(theme);
                }}
              />
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );
}; 