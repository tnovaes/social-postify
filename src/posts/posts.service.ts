import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly publicationRepository: PublicationsRepository 
    ) {}

    async create(createPostDto: CreatePostDto) {
        return this.postsRepository.create(createPostDto);
    }

    async findAll() {
        return this.postsRepository.findAll();
    }

    async findOne(id: number) {
        const post = await this.postsRepository.findOne(id);
        if(!post) throw new NotFoundException();

        return post;
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const post = await this.postsRepository.findOne(id);
        if(!post) throw new NotFoundException();

        return await this.postsRepository.update(id, updatePostDto);
    }

    async delete(id: number){
        const post = await this.postsRepository.findOne(id);
        if(!post) throw new NotFoundException();

        const publications = await this.publicationRepository.countPublicationsByPostId(id);
        if(publications > 0) throw new ForbiddenException();

        return await this.postsRepository.delete(id);
    }
}
