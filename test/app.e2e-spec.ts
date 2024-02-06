import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const randomUsername = faker.internet.userName();
  const randomEmail = faker.internet.email();
  const randomPassword = faker.internet.password();
  let accessToken: string;
  beforeEach(async () => {
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule      
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: randomUsername, email: randomEmail, password: randomPassword })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: randomEmail, password: randomPassword })
      .expect(201);
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: randomEmail, password: randomPassword })
    
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${response.body.result.accessToken}`)
      .send({ username: randomUsername })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
