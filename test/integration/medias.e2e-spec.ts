import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MediasFactory } from '../factories/medias.factory';
import { AppModule } from '../../src/app.module';
import { TestHelper } from '../helpers';
import { Medias } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('MediasController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService = new PrismaService();
    let server: request.SuperTest<request.Test>;
    let mediasFactory: MediasFactory;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        mediasFactory = new MediasFactory();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        server = request(app.getHttpServer());

        const { cleanDB } = new TestHelper();
        await cleanDB(prisma);
    });

    describe('/medias (POST)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                await server.post('/medias').send({
                    title: '',
                    username: '',
                })
                    .expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 201 and created media', async () => {
                const response = await server.post('/medias').send({
                    title: faker.company.name(),
                    username: faker.internet.userName(),
                });

                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining<Medias>({
                        id: expect.any(Number),
                        title: expect.any(String),
                        username: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('/medias (GET)', () => {
        it('should respond with status 200 and empty array when there are no media', async () => {
            const response = await server.get('/medias');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should respond with status 200 and array of size 5 when there are 5 medias', async () =>{
            for(let i = 0; i < 5; i++) await mediasFactory.createMedia(prisma);
            const response = await server.get('/medias');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(5);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining<Medias>({
                        id: expect.any(Number),
                        title: expect.any(String),
                        username: expect.any(String),
                    }),
                ]),
            );
        });
    });

    describe('/medias/:id (GET)', () => {
        it('should respond with status 404 when media with given id does not exists', async () => {
            const media = await mediasFactory.createMedia(prisma)
            const id = media.id + 1;
            const response = await server.get(`/medias/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 200 and media with given id when it exists', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const response = await server.get(`/medias/${media.id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining<Medias>({
                    id: expect.any(Number),
                    title: expect.any(String),
                    username: expect.any(String),
                }),
            );
        });
    });

    describe('/medias/:id (PUT)', () => {
        describe('when body is invalid', () => {
            it('should respond with status 400', async () => {
                const media = await mediasFactory.createMedia(prisma);
                await server.put(`/medias/${media.id}`).send({
                    title: '',
                    username: '',
                });
                expect(400);
            });
        });

        describe('when body is valid', () => {
            it('should respond with status 404 when media with given id does not exists', async () => {
                const media = await mediasFactory.createMedia(prisma)
                const id = media.id + 1;
                const response = await server.put(`/medias/${id}`);
    
                expect(response.statusCode).toBe(404);
            });

            it('should respond with status 204 and media with given id when it exists', async () => {
                const media = await mediasFactory.createMedia(prisma);
                const title = faker.company.name();
                const username = faker.internet.userName();

                const response = await server.put(`/medias/${media.id}`).send({
                    title,
                    username,
                });

                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe('/medias/:id (DELETE)', () => {
        it('should respond with status 404 when media with given id does not exists', async () => {
            const media = await mediasFactory.createMedia(prisma)
            const id = media.id + 1;
            const response = await server.delete(`/medias/${id}`);

            expect(response.statusCode).toBe(404);
        });

        it('should respond with status 204', async () => {
            const media = await mediasFactory.createMedia(prisma);
            const response = await server.delete(`/medias/${media.id}`);

            expect(response.statusCode).toBe(204);
        })
    });
});