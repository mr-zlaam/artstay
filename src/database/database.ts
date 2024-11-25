import { PrismaClient } from "@prisma/client";
import { app } from "../app.js";
import { PORT } from "../config/config.js";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const db = new PrismaClient({});
const connectDB = async (): Promise<void> => {
  void (await db
    .$connect()
    .then(() =>
      app.listen(PORT, () => {
        console.log(`Connected to the database successfully✅ \n Server is running on port http://localhost:${PORT}`);
      })
    )
    .catch((err) => {
      console.log("Error connecting to DB", err);
      return process.exit(1);
    }));
};
export { connectDB, db };
