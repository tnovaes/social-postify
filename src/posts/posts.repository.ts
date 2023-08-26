import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPostDto: CreatePostDto) {
        return await this.prisma.posts.create({
            data: createPostDto,
        });
    }

    async findAll() {
        return await this.prisma.posts.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.posts.findUnique({
            where: { id }
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        return await this.prisma.posts.update({
            where: { id },
            data: updatePostDto,
        });
    }

    async delete(id: number) {
        return await this.prisma.posts.delete({
            where: { id }
        })
    }
}