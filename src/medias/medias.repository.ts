import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/uptdate-media.dto";

@Injectable()
export class MediasRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMediaDto: CreateMediaDto) {
        return await this.prisma.medias.create({
            data: createMediaDto,
        });
    }

    async findAll() {
        return await this.prisma.medias.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.medias.findUnique({
            where: { id }
        });
    }

    async update(id: number, updateMediaDto: UpdateMediaDto) {
        return await this.prisma.medias.update({
            where: { id },
            data: updateMediaDto,
        });
    }

    async delete(id: number) {
        return await this.prisma.medias.delete({
            where: { id }
        })
    }

    async findExisting(title: string, username: string) {
        return await this.prisma.medias.findFirst({
            where: {
                title,
                AND: {
                    username,
                },
            },
        });
    }
}