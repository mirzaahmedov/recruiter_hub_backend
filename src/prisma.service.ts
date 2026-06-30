import { PrismaClient } from '@/generated/prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        ca: fs
          .readFileSync(path.resolve(process.cwd(), 'certs', 'ca.pem'))
          .toString(),
      },
    });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
