import { RateLimiterPrisma } from "rate-limiter-flexible";
import type { NextFunction, Request, Response } from "express";
import { db } from "../databases/database.js";
import { httpResponse } from "../utils/ apiResponseUtils.js";
import { ENV } from "../configs/config.js";
import { ERRMSG, INTERNALSERVERERRORCODE, TOOMANYREQUESTSCODE, TOOMANYREQUESTSMSG } from "../constants/constant.js";
import getMinutes from "../utils/ getMinutesUtils.js";

type ErrorLimiter = {
  remainingPoints: number;
  msBeforeNext: number; // Time remaining in milliseconds (optional, but useful for rate limit reset)
};

export class RateLimiterMiddleware {
  private rateLimiter: RateLimiterPrisma | null = null;
  private currentTotalPoints: number | null = null;
  private currentDuration: number | null = null;

  public async handle(req: Request, res: Response, next: NextFunction, consumptionPoints = 1, message?: string, totalPoints?: number, duration = 60) {
    try {
      if (ENV === "development") return next(); // TODO: replace ! with = for production

      // **  Initialize or reinitialize rate limiter only if totalPoints or duration have changed
      if (!this.rateLimiter || this.currentTotalPoints !== totalPoints || this.currentDuration !== duration) {
        this.rateLimiter = new RateLimiterPrisma({
          storeClient: db,
          points: totalPoints || 10, // Default points if none provided
          duration
        });
        this.currentTotalPoints = totalPoints || 10;
        this.currentDuration = duration;
      }

      // **  Consume points based on the request-specific consumptionPoints
      await this.rateLimiter.consume(req.ip as string, consumptionPoints);
      next();
    } catch (err: unknown) {
      const error = err as ErrorLimiter;
      if (error?.remainingPoints === 0) {
        const remainingSeconds = Math.ceil(error.msBeforeNext / 1000); // Convert ms to seconds
        const remainingDuration = getMinutes(remainingSeconds);
        httpResponse(req, res, TOOMANYREQUESTSCODE, message || `${TOOMANYREQUESTSMSG} ${remainingDuration}`, null).end();
      } else {
        httpResponse(req, res, INTERNALSERVERERRORCODE, `${ERRMSG} in rateLimiter middleware: ${err as string}`, null);
      }
    }
  }
}
const rateLimiterMiddleware = new RateLimiterMiddleware();
export default rateLimiterMiddleware;
