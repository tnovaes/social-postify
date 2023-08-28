import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { TestHelper } from '../helpers';
import { faker } from '@faker-js/faker';
import { PostsFactory } from '../factories/posts.factory';
import { Posts } from '@prisma/client';

describe('PostsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();
    let server: request.SuperTest<request.Test>;
    let postsFactory: PostsFactory;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        postsFactory = new PostsFactory();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        server = request(app.getHttpServer());

        const { cleanDB } = new TestHelper();
        await cleanDB(prisma);
    });

    describe('/posts (POST)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                await server.post('/posts').send({
                    title: '',
                    text: '',
                })
                    .expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 201 and created post', async () => {
                const response = await server.post('/posts').send({
                    title: faker.lorem.words(),
                    text: faker.lorem.text(),
                    image: faker.internet.avatar(),
                });

                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining<Posts>({
                        id: expect.any(Number),
                        title: expect.any(String),
                        text: expect.any(String),
                        image: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('/posts (GET)', () => {
        it('should respond with status 200 and empty array when there are no posts', async () => {
            const response = await server.get('/posts');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should respond with status 200 and array of size 5 when there are 5 posts', async () =>{
            for(let i = 0; i < 5; i++) await postsFactory.createPost(prisma);
            const response = await server.get('/posts');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(5);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining<Posts>({
                        id: expect.any(Number),
                        title: expect.any(String),
                        text: expect.any(String),
                        image: expect.any(String),
                    }),
                ]),
            );
        });
    });

    describe('/posts/:id (GET)', () => {
        it('should respond with status 404 when post with given id does not exists', async () => {
            const post = await postsFactory.createPost(prisma)
            const id = post.id + 1;
            const response = await server.get(`/posts/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 200 and post with given id when it exists', async () => {
            const post = await postsFactory.createPost(prisma);
            const response = await server.get(`/posts/${post.id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining<Posts>({
                    id: expect.any(Number),
                    title: expect.any(String),
                    text: expect.any(String),
                    image: expect.any(String),
                }),
            );
        });
    });

    describe('/posts/:id (PUT)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                const post = await postsFactory.createPost(prisma);
                await server.put(`/posts/${post.id}`).send({
                    title: '',
                    text: '',
                });
                expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 404 when post with given id does not exists', async () => {
                const post = await postsFactory.createPost(prisma)
                const id = post.id + 1;
                const response = await server.put(`/posts/${id}`);
    
                expect(response.statusCode).toBe(404);
            });

            it('should respond with status 204 and post with given id when it exists', async () => {
                const post = await postsFactory.createPost(prisma);
                const title = faker.lorem.words();
                const text = faker.lorem.text();
                const image = faker.internet.avatar();

                const response = await server.put(`/posts/${post.id}`).send({
                    title,
                    text,
                    image
                });

                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe('/posts/:id (DELETE)', () => {
        it('should respond with status 404 when post with given id does not exists', async () => {
            const post = await postsFactory.createPost(prisma)
            const id = post.id + 1;
            const response = await server.delete(`/posts/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 204', async () => {
            const post = await postsFactory.createPost(prisma);
            const response = await server.delete(`/posts/${post.id}`);

            expect(response.statusCode).toBe(204);
        })
    });
});