import { Router } from "express";
import { performanceRouter } from "./performanceRouter/performanceRouter.js";
import { authRouter } from "./authRouter/authRouter.js";

const defaultRouter: Router = Router();
defaultRouter.use("/getPerformance", performanceRouter);
defaultRouter.use("/auth", authRouter);

export default defaultRouter;
