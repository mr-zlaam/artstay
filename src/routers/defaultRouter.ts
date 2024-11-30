import { Router } from "express";
import { performanceRouter } from "./performanceRouter/performanceRouter.js";
import { authRouter } from "./authRouter/authRouter.js";

const defaultRouter: Router = Router();
// ** Performance Routes **
defaultRouter.use("/getPerformance", performanceRouter);
// ** Auth Routes **
defaultRouter.use("/auth", authRouter);

export default defaultRouter;
