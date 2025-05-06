import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, Prisma } from '~/database/database.service';

@Injectable()
export class MediaService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Prisma.MediaCreateInput) {
    return this.db.media.create({ data });
  }

  async findOneById(id: string) {
    const media = await this.db.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async update(id: string, data: Prisma.MediaUpdateInput) {
    return this.db.media.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.db.media.delete({ where: { id } });
  }
}
