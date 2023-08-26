import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { CreatePublicationDto } from "./dto/create-publication.dto";

@Injectable()
export class PublicationsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPublicationDto: CreatePublicationDto) {
        return await this.prisma.publications.create({
            data: createPublicationDto,
        });
    }

    async findAll() {
        return await this.prisma.publications.findMany();
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