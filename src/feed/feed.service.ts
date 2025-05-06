import { Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';

@Injectable()
export class FeedService {
  constructor(private readonly db: DatabaseService) {}

  async getFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // find followed user ids
    const followedUsers = await this.db.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true },
    });

    const followedIds = followedUsers.map((f) => f.followedId);
    if (followedIds.length === 0) return [];

    // find already viwed media
    const viewed = await this.db.viewedMedia.findMany({
      where: { userId },
      select: { mediaId: true },
    });

    const viewedMediaIds = viewed.map((v) => v.mediaId);

    // find unviewed medias
    return this.db.media.findMany({
      where: {
        createdById: { in: followedIds },
        id: { notIn: viewedMediaIds },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }
}
