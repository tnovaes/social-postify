import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export class PostsFactory{    
    async createPost(prisma: PrismaService) {
        return await prisma.posts.create({
            data: {
                title: faker.lorem.words(),
                text: faker.lorem.text(),
                image: faker.internet.avatar(),    
            }
        });
    }
}