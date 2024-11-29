import { PrismaClient } from "@prisma/client";
import { app } from "../app.js";
import { PORT } from "../configs/config.js";
import logger from "../utils/loggerUtils.js";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const db = new PrismaClient({});

const connectDB = async (): Promise<void> => {
  void (await db
    .$connect()
    .then(() =>
      app.listen(PORT, () => {
        logger.info(`Connected to the database successfully ✅
        Server is running on port http://localhost:${PORT} 🚀`);
      })
    )
    .catch((err) => {
      console.log("Error connecting to DB", err);
      return process.exit(1);
    }));
};
export { connectDB, db };
