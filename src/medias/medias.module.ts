import { Module, forwardRef } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from 'src/publications/publications.repository';
import { PublicationsModule } from 'src/publications/publications.module';

@Module({
  imports: [forwardRef(() => PublicationsModule)],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository, PublicationsRepository]
})
export class MediasModule {}
