import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export class PublicationsFactory {
    async createPublication(
        prisma: PrismaService,
        mediaId: number,
        postId: number,
    ) {
        return await prisma.publications.create({
            data: {
                mediaId,
                postId,
                date: faker.date.future(),
            }
        });
    }
}