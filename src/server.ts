import express, { type Application } from "express";

const app: Application = express();
app.get("/", (_, res) => {
  res.status(200).json({ success: true, message: "Everything working fine" });
});
app.listen(8000, () => console.log(`Server is running on port 3000`));
