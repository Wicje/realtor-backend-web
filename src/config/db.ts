const connectionString = process.env.DATABASE_URL;
const allowNoDbBoot = process.env.ALLOW_START_WITHOUT_DB === "true";

const connectionString = process.env.DATABASE_URL;
const allowNoDbBoot = process.env.ALLOW_START_WITHOUT_DB === "true";

const createPrismaClient = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaPg } = require("@prisma/adapter-pg");

const makeMissingDbProxy = () =>
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          "DATABASE_URL is not configured. Set DATABASE_URL or disable ALLOW_START_WITHOUT_DB."
        );
      },
    }
  );

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
};

export const prisma = connectionString
  ? createPrismaClient()
  : allowNoDbBoot
  ? makeMissingDbProxy()
  : (() => {
      throw new Error(
        "DATABASE_URL is required to initialize Prisma. If you want temporary boot without DB, set ALLOW_START_WITHOUT_DB=true."
      );
    })();

export const isDatabaseConfigured = Boolean(connectionString);


