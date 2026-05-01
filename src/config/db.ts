// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require("@prisma/client");

// Prisma v7 with engine type "client" requires a DB adapter.
// Render should provide DATABASE_URL and install @prisma/adapter-pg + pg.
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
