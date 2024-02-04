import { DataSource } from "typeorm"
import { Logger } from '@nestjs/common';
const logger = new Logger('Bootstrap');
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: true,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
  migrationsRun: false,
});

AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
