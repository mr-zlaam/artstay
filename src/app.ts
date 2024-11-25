import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/ errorMiddleware.js";
import { performanceRouter } from "./routers/performanceRouter/performanceRouter.js";
import { DEFAULTENDPOINT } from "./constants/constant.js";
export const app: Application = express();

//  * Default Middlewares
app.use(express.json());
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../public"));
// * Custom Middlewares
app.use(DEFAULTENDPOINT, performanceRouter);
// * Error handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);
