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
  Request,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '~/auth/auth.guard';
import { UserService } from './user.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateProfileDto) {
    // @todo handle error like duplicated unique index
    return this.userService.create(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateProfileDto,
  ) {
    // @todo allow admins to remove users
    if (req.user?.sub !== id) {
      throw new ForbiddenException('Not allowed');
    }

    return this.userService.update(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    // @todo allow admins to remove users
    if (req.user?.sub !== id) {
      throw new ForbiddenException('Not allowed');
    }

    return this.userService.remove(id);
  }

  @Post(':followedId/follow')
  @UseGuards(AuthGuard)
  follow(
    @Request() req: any,
    @Param('followedId', ParseUUIDPipe) followedId: string,
  ) {
    return this.userService.followUser(req.user.sub as string, followedId);
  }

  @Delete(':followedId/unfollow')
  @UseGuards(AuthGuard)
  unfollow(
    @Request() req: any,
    @Param('followedId', ParseUUIDPipe) followedId: string,
  ) {
    return this.userService.unfollowUser(req.user.sub as string, followedId);
  }
}
