// 导出讨论相关实体
export { Discussion, type DiscussionProps } from './entities/Discussion';
export { Comment, type CommentProps } from './entities/Comment';

// 仓库接口
export { type DiscussionRepository } from './adapters/gateways/DiscussionRepository';
export { LocalStorageDiscussionRepository } from './adapters/gateways/LocalStorageDiscussionRepository';

// 用例
export { 
  type GetDiscussionByIdUseCase,
  GetDiscussionById 
} from './use-cases/GetDiscussionByIdUseCase';

// 控制器
export { DiscussionController } from './adapters/controllers/DiscussionController';

// UI组件
export { DiscussionTopicCard } from './external/ui/DiscussionTopicCard';
export { DiscussionTopicsList } from './external/ui/DiscussionTopicsList';

// 未来会添加仓库、用例和控制器等导出 