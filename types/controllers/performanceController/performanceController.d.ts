import type { Request, Response } from "express";
export default class PerformanceController {
  static getPerformance: (req: Request, res: Response) => void;
}
