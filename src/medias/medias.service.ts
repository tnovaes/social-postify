import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MediasRepository } from './medias.repository';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/uptdate-media.dto';
import { PublicationsRepository } from 'src/publications/publications.repository';

@Injectable()
export class MediasService {
    constructor(
        private readonly mediasRepository: MediasRepository,
        private readonly publicationsRepository: PublicationsRepository
    ) { }

    async create(createMediaDto: CreateMediaDto) {
        const existing = await this.mediasRepository.findExisting(createMediaDto.title, createMediaDto.username);
        if (existing) throw new ConflictException();

        return await this.mediasRepository.create(createMediaDto);
    }

    async findAll() {
        return await this.mediasRepository.findAll();
    }

    async findOne(id: number) {
        const media = await this.mediasRepository.findOne(id);
        if (!media) throw new NotFoundException();

        return media;
    }

    async update(id: number, updateMediaDto: UpdateMediaDto) {
        const media = await this.mediasRepository.findOne(id);
        if (!media) throw new NotFoundException();

        const existing = await this.mediasRepository.findExisting(updateMediaDto.title, updateMediaDto.username);
        if (existing) throw new ConflictException();

        return await this.mediasRepository.update(id, updateMediaDto);
    }

    async delete(id: number) {
        const media = await this.mediasRepository.findOne(id);
        if (!media) throw new NotFoundException();

        const publications = await this.publicationsRepository.countPublicationsByMediaId(id);
        if (publications > 0) throw new ForbiddenException();

        return await this.mediasRepository.delete(id);
    }
}
