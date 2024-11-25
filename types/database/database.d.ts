import { PrismaClient } from "@prisma/client";
declare const db: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
declare const connectDB: () => Promise<void>;
export { connectDB, db };
