import { Injectable } from "@nestjs/common";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PublicationsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPublicationDto: CreatePublicationDto) {
        return await this.prisma.publications.create({
            data: createPublicationDto,
        });
    }

    async findAll(published: string | null, after: string | null) {
        return await this.prisma.publications.findMany({
            where: {
                date: {
                    lt: published === 'true' ? new Date() : undefined,
                    gte: published === 'false' ? new Date() : after ? new Date(after) : undefined,
                },
            },
        });
    }

    async findOne(id: number) {
        return await this.prisma.publications.findUnique({
            where: { id }
        });
    }

    async update(id: number, updatePublicationDto: UpdatePublicationDto) {
        return await this.prisma.publications.update({
            where: { id },
            data: updatePublicationDto,
        });
    }

    async delete(id: number) {
        return await this.prisma.publications.delete({
            where: { id }
        });
    }

    async countPublicationsByMediaId(mediaId: number) {
        return await this.prisma.publications.count({
            where: { mediaId }
        });
    }

    async countPublicationsByPostId(postId: number) {
        return await this.prisma.publications.count({
            where: { postId }
        });
    }
}