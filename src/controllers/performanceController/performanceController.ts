import { httpResponse } from "../../utils/apiResponseUtils.js";
import QuickerUtils from "../../utils/quickerUtils.js";
import type { Request, Response } from "express";
import { INTERNALSERVERERRORMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants/constant.js";
export default class PerformanceController {
  static getPerformance = (req: Request, res: Response) => {
    try {
      const healthData = {
        applicationHealth: QuickerUtils.getApplicationHealth(),
        systemHealth: QuickerUtils.getSystemHealth()
      };
      httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, healthData);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message || INTERNALSERVERERRORMSG
        };
      }
    }
  };
}
