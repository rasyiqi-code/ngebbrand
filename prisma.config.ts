import 'dotenv/config';

export default {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'bun ./prisma/seed.ts',
  }
};
