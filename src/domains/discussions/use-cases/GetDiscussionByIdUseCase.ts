import { Discussion } from "../entities/Discussion";
import { DiscussionRepository } from "../adapters/gateways/DiscussionRepository";

/**
 * 获取讨论用例接口
 */
export interface GetDiscussionByIdUseCase {
  execute(id: string): Promise<Discussion | null>;
}

/**
 * 获取讨论用例实现
 */
export class GetDiscussionById implements GetDiscussionByIdUseCase {
  constructor(private readonly discussionRepository: DiscussionRepository) {}

  /**
   * 执行获取讨论用例
   * @param id 讨论ID
   * @returns 讨论实体或null(如果不存在)
   */
  async execute(id: string): Promise<Discussion | null> {
    return this.discussionRepository.findDiscussionById(id);
  }
} 