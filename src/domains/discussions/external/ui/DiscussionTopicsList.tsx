import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Discussion } from '../../entities/Discussion';
import { DiscussionTopicCard } from './DiscussionTopicCard';

interface DiscussionTopicsListProps {
  discussions: Discussion[];
  onViewTopic: (discussion: Discussion) => void;
  getUserName: (userId: string) => string;
  getUserAvatar?: (userId: string) => string | undefined;
}

/**
 * 讨论话题列表组件
 * 展示多个讨论话题卡片，当没有话题时显示提示信息
 */
export const DiscussionTopicsList: React.FC<DiscussionTopicsListProps> = ({ 
  discussions, 
  onViewTopic,
  getUserName,
  getUserAvatar 
}) => {
  if (discussions.length === 0) {
    return (
      <div className="text-center p-8">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">暂无讨论话题</h3>
        <p className="text-gray-500 mb-4">成为第一个发起讨论的用户</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion, index) => (
        <DiscussionTopicCard
          key={discussion.id}
          discussion={discussion}
          authorName={getUserName(discussion.authorId)}
          authorAvatar={getUserAvatar ? getUserAvatar(discussion.authorId) : undefined}
          onViewTopic={() => onViewTopic(discussion)}
        />
      ))}
    </div>
  );
}; 