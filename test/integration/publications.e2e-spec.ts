import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { TestHelper } from '../helpers';
import { faker } from '@faker-js/faker';
import { PublicationsFactory } from '../factories/publications.factory';
import { Publications } from '@prisma/client';
import { MediasFactory } from '../factories/medias.factory';
import { PostsFactory } from '../factories/posts.factory';

describe('PublicationsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();
    let server: request.SuperTest<request.Test>;
    let mediasFactory: MediasFactory;
    let postsFactory: PostsFactory;
    let publicationsFactory: PublicationsFactory;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        mediasFactory = new MediasFactory();
        postsFactory = new PostsFactory();
        publicationsFactory = new PublicationsFactory();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        server = request(app.getHttpServer());

        const { cleanDB } = new TestHelper();
        await cleanDB(prisma);
    });

    describe('/publications (POST)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                await server.post('/publications').send({
                    mediaId: '',
                    postId: '',
                    date: '',
                })
                    .expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 201 and created post', async () => {
                const media = await mediasFactory.createMedia(prisma);
                const post = await postsFactory.createPost(prisma);
                const date = faker.date.future();

                const response = await server.post('/publications').send({
                    mediaId: media.id,
                    postId: post.id,
                    date,
                });

                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining<Publications>({
                        id: expect.any(Number),
                        mediaId: expect.any(Number),
                        postId: expect.any(Number),
                        date: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('/publications (GET)', () => {
        it('should respond with status 200 and empty array when there are no publications', async () => {
            const response = await server.get('/publications');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should respond with status 200 and array of size 5 when there are 5 publications', async () => {
            for (let i = 0; i < 5; i++) {
                const media = await mediasFactory.createMedia(prisma);
                const post = await postsFactory.createPost(prisma);
                await publicationsFactory.createPublication(
                    prisma,
                    media.id,
                    post.id,
                );
            }

            const response = await server.get('/publications');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(5);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining<Publications>({
                        id: expect.any(Number),
                        mediaId: expect.any(Number),
                        postId: expect.any(Number),
                        date: expect.any(String),
                    }),
                ]),
            );
        });
    });

    describe('/publications/:id (GET)', () => {
        it('should respond with status 404 when publication with given id does not exists', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const post = await postsFactory.createPost(prisma);
            const publication = await publicationsFactory.createPublication(
                prisma,
                media.id,
                post.id,
            );
            const id = publication.id + 1;
            const response = await server.get(`/publications/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 200 and publication with given id when it exists', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const post = await postsFactory.createPost(prisma);
            const publication = await publicationsFactory.createPublication(
                prisma,
                media.id,
                post.id,
            );
            const response = await server.get(`/publications/${publication.id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining<Publications>({
                    id: expect.any(Number),
                    mediaId: expect.any(Number),
                    postId: expect.any(Number),
                    date: expect.any(String),
                }),
            );
        });
    });

    describe('/publications/:id (PUT)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                const media = await mediasFactory.createMedia(prisma);
                const post = await postsFactory.createPost(prisma);
                const publication = await publicationsFactory.createPublication(
                    prisma,
                    media.id,
                    post.id,
                );
                await server.put(`/publications/${publication.id}`).send({
                    mediaId: '',
                    postId: '',
                    date: ''
                });
                expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 404 when publication with given id does not exists', async () => {
                const media = await mediasFactory.createMedia(prisma);
                const post = await postsFactory.createPost(prisma);
                const publication = await publicationsFactory.createPublication(
                    prisma,
                    media.id,
                    post.id,
                );
                const id = publication.id + 1;
                const response = await server.put(`/publications/${id}`);

                expect(response.statusCode).toBe(404);
            });

            it('should respond with status 204 and publication with given id when it exists', async () => {
                const media = await mediasFactory.createMedia(prisma);
                const post = await postsFactory.createPost(prisma);
                const publication = await publicationsFactory.createPublication(
                    prisma,
                    media.id,
                    post.id,
                );
                const media2 = await mediasFactory.createMedia(prisma);
                const post2 = await postsFactory.createPost(prisma);

                const response = await server.put(`/publications/${publication.id}`).send({
                    mediaId: media2.id,
                    postId: post2.id,
                    date: faker.date.future()
                });

                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe('/publications/:id (DELETE)', () => {
        it('should respond with status 404 when publication with given id does not exists', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const post = await postsFactory.createPost(prisma);
            const publication = await publicationsFactory.createPublication(
                prisma,
                media.id,
                post.id,
            );
            const id = publication.id + 1;
            const response = await server.delete(`/publications/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 204', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const post = await postsFactory.createPost(prisma);
            const publication = await publicationsFactory.createPublication(
                prisma,
                media.id,
                post.id,
            );
            const response = await server.delete(`/publications/${publication.id}`);

            expect(response.statusCode).toBe(204);
        })
    });
});