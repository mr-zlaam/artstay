import express, { type Application } from "express";

export const app: Application = express();
app.get("/", (_, res) => {
  res.status(200).json({ success: true, message: "Everything working fine" });
});
