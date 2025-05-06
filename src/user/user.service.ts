import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService, Prisma } from '~/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  create(data: Prisma.UserCreateInput) {
    return this.db.user.create({ data, omit: { password: true } });
  }

  findOneById(id: string) {
    return this.db.user.findUnique({ where: { id }, omit: { password: true } });
  }

  findOneByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.db.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  remove(id: string) {
    return this.db.user.delete({ where: { id } });
  }

  async followUser(followerId: string, followedId: string) {
    if (followerId === followedId) {
      throw new ConflictException("You can't follow yourself.");
    }

    // check user exist
    const followed = await this.findOneById(followedId);

    if (!followed) {
      throw new NotFoundException('User not found');
    }

    // check user is not already following
    const existingFollow = await this.db.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    });

    if (existingFollow) {
      throw new ConflictException('Already following');
    }

    return await this.db.follow.create({
      data: { followerId, followedId },
    });
  }

  async unfollowUser(followerId: string, followedId: string) {
    const followed = await this.db.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    });

    if (!followed) {
      throw new NotFoundException('Not found');
    }

    return await this.db.follow.delete({
      where: {
        followerId_followedId: { followerId, followedId },
      },
    });
  }
}
