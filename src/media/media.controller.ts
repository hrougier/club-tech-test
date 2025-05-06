import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '~/auth/auth.guard';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media-dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req: any, @Body() media: CreateMediaDto) {
    return this.mediaService.create({
      ...media,
      createdBy: { connect: { id: req.user.sub } },
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const media = await this.mediaService.findOneById(id);

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMediaDto,
  ) {
    const media = await this.findOne(id);

    if (req.user?.sub !== media.createdById) {
      throw new ForbiddenException('Not allowed');
    }

    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const media = await this.findOne(id);

    if (req.user?.sub !== media.createdById) {
      throw new ForbiddenException('Not allowed');
    }

    return this.mediaService.remove(id);
  }
}
