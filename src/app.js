import { generateRss } from "./utils/rss.js";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/feeds/rss/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  const rss = await generateRss(req.params.pid);
  res.send(rss);
});

app.listen(port, async () => {
  console.log(`listening at PORT:${port}`);
});
