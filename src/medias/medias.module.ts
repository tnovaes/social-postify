import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediaRepository } from './medias.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MediasController],
  providers: [MediasService, PrismaService, MediaRepository]
})
export class MediasModule {}
