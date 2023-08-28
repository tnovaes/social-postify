import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasRepository } from '../medias/medias.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class PublicationsService {
    constructor(
        private readonly publicationRepository: PublicationsRepository,
        private readonly mediasRepository: MediasRepository,
        private readonly postsRepository: PostsRepository,
    ) {}

    async create(createPublicationDto: CreatePublicationDto) {
        const media = await this.mediasRepository.findOne(createPublicationDto.mediaId);
        if(!media) throw new NotFoundException('Media not found');

        const post = await this.postsRepository.findOne(createPublicationDto.postId);
        if(!post) throw new NotFoundException('Post not found');

        return await this.publicationRepository.create(createPublicationDto);
    }

    async findAll(published: string | null, after: string | null) {
        return await this.publicationRepository.findAll(published, after);
    }

    async findOne(id: number) {
        const publication = await this.publicationRepository.findOne(id);
        if (!publication) throw new NotFoundException();
    
        return publication;
    }

    async update(id: number, updatePublicationDto: UpdatePublicationDto) {
        const publication = await this.publicationRepository.findOne(id);
        if(!publication) throw new NotFoundException('Publication not found');

        const media = await this.mediasRepository.findOne(updatePublicationDto.mediaId);
        if(!media) throw new NotFoundException('Media not found');

        const post = await this.postsRepository.findOne(updatePublicationDto.postId);
        if(!post) throw new NotFoundException('Post not found');

        const alreadyPublished = new Date() > new Date(publication.date);
        if(alreadyPublished) throw new ForbiddenException();

        return await this.publicationRepository.update(id, updatePublicationDto);
    }

    async delete(id: number) {
        const publication = await this.publicationRepository.findOne(id);
        if(!publication) throw new NotFoundException();

        return await this.publicationRepository.delete(id);
    }
}
