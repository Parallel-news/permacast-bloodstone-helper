import { generateRss } from "./utils/rss.js";
import { sort } from "./utils/sorting.js";
import { stats } from "./utils/stats.js";
import { cronjob, sleep } from "./utils/cronjob.js";
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

app.get("/feeds/channels/sort/:type", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const jsonRes = await sort(req.params.type);
  res.send(jsonRes);
});

app.get("/protocol/stats", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const jsonRes = await stats();
  res.send(jsonRes);
});

app.listen(port, async () => {
  await cronjob();
  await sleep(15);
  console.log(`listening at PORT:${port}`);
});
