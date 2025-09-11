import { PrismaClient } from "@prisma/client";

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is missing. Please check your .env.local file."
  );
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Performance optimizations for MongoDB Atlas
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Enable connection pooling and optimize for MongoDB Atlas
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Optimize connection handling for MongoDB Atlas
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Enhanced graceful shutdown with error handling
if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    try {
      await prisma.$disconnect();
      console.log("Database connection closed gracefully");
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
  });

  process.on("SIGINT", async () => {
    try {
      await prisma.$disconnect();
      console.log("Database connection closed due to SIGINT");
      process.exit(0);
    } catch (error) {
      console.error("Error closing database connection on SIGINT:", error);
      process.exit(1);
    }
  });

  process.on("SIGTERM", async () => {
    try {
      await prisma.$disconnect();
      console.log("Database connection closed due to SIGTERM");
      process.exit(0);
    } catch (error) {
      console.error("Error closing database connection on SIGTERM:", error);
      process.exit(1);
    }
  });
}
