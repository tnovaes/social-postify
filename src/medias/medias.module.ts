import { Module, forwardRef } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from '../publications/publications.module';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  imports: [forwardRef(() => PublicationsModule)],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository, PublicationsRepository]
})
export class MediasModule {}
