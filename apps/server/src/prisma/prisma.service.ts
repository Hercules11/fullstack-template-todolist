import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Sets up logging for database operations, capturing
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  // Runs when the NestJS application starts
  async onModuleInit() {
    await this.$connect();
  }
  // Runs when the NestJS application shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'development') {
      const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    //   The remaining keys are your model names (like todo)
      return Promise.all(
        models.map((modelKey) => {
          return this[modelKey].deleteMany();
        }),
      );
    }
  }
}
