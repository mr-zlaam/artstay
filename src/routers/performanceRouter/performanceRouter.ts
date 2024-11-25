import PerformanceController from "../../controllers/performanceController/performanceController.js";
import { Router } from "express";
export const performanceRouter: Router = Router();
performanceRouter.route(`/getPerformance`).get(PerformanceController.getPerformance);
