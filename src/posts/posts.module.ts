import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from 'src/publications/publications.repository';
import { PublicationsModule } from 'src/publications/publications.module';

@Module({
  imports: [forwardRef(() => PublicationsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PublicationsRepository]
})
export class PostsModule {}
