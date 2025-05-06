import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '~/auth/auth.guard';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserFeed(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.feedService.getFeed(req.user.sub as string, +page, +limit);
  }
}
