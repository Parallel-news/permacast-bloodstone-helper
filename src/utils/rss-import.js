import axios from "axios";
import parseString from "xml2js";
import bufferToArrayBuffer from "buffer-to-arraybuffer";
import { stripHtml } from "string-strip-html";
import { getPodcastById } from "./exm.js";
import assert from "node:assert";

async function getEpisodeObject(e) {
  try {
    // episode metadata from the RSS
    const link = e.enclosure?.[0]?.["$"].url;
    const fileType = e.enclosure?.[0]?.["$"]?.type;
    const length = e.enclosure?.[0]?.["$"]?.length;
    const isExplicit = e?.["itunes:explicit"]?.[0] === "true" ? "yes" : "no"; // compatible with Permacast contract spec
    const title = e?.title?.[0];
    const pubDate = e?.pubDate?.[0];
    const duration = e?.["itunes:duration"]?.[0];
    const description = stripHtml(e?.description?.[0])?.result;
    return {
      link,
      fileType,
      isExplicit,
      title,
      length,
      pubDate,
      duration,
      description,

    };
  } catch (error) {
    throw error;
  }
}

export async function importRssFeed(encodedRssUrl, pid) {
  try {
    let rssJson;
    const rssUrl = atob(encodedRssUrl);
    await isValidUrl(rssUrl);
    const res = [];

    if (pid) { // provide PID to sync an existing imported RSS feed
      const podcast = await getPodcastById(pid);
      assert.equal(podcast.pid === pid, true);
      const uploadedEpisodes = podcast.episodes.map(
        (episode) => episode.episodeName
      );

      const rssXml = (await axios.get(rssUrl)).data;
      const json = parseString.parseString(
        rssXml,
        (err, result) => (rssJson = result.rss)
      );

      const cover = rssJson.channel[0]["itunes:image"];
      const rssEpisodes = rssJson.channel[0].item;

      for (const episode of rssEpisodes.reverse()) {
        if (!uploadedEpisodes.includes(episode?.title?.[0])) {
          res.push(await getEpisodeObject(episode));
        }
      }

      return res;
    }

    const rssXml = (await axios.get(rssUrl)).data;
    const json = parseString.parseString(
      rssXml,
      (err, result) => (rssJson = result.rss)
    );

    const cover = rssJson.channel[0]["itunes:image"];
    const rssEpisodes = rssJson.channel[0].item;

    for (const episode of rssEpisodes.reverse()) {
      res.push(await getEpisodeObject(episode));
    }

    return res;
  } catch (error) {
    console.log(error);
    return { error: "rss-import-error" };
  }
}

export async function getPodcastMetadata(encodedRssUrl) {
  try {
    let rssJson;
    const rssUrl = atob(encodedRssUrl);
    await isValidUrl(rssUrl);
    const res = [];

    const rssXml = (await axios.get(rssUrl)).data;
    const json = parseString.parseString(
      rssXml,
      (err, result) => (rssJson = result.rss)
    );

    const cover = rssJson.channel?.[0]?.["itunes:image"]?.[0]?.["$"]?.["href"];
    const language = rssJson.channel?.[0]?.language?.[0];
    const title = rssJson.channel?.[0]?.title?.[0];
    const categories =
      rssJson.channel?.[0]?.["itunes:category"]?.[0]?.["$"]?.["text"];
    const isExplicit = rssJson.channel?.[0]?.["itunes:explicit"]?.[0];
    const description = rssJson.channel?.[0]?.["description"]?.[0];
    const author = rssJson.channel?.[0]?.["itunes:author"]?.[0];
    const email = rssJson.channel[0]?.["itunes:owner"]?.[0]?.["itunes:email"]?.[0];

    return {
      cover,
      language,
      title,
      categories,
      isExplicit,
      description,
      author,
      email,
    };
  } catch (error) {
    console.log(error);
    return { error: "rss-metadata-error" };
  }
}

async function isValidUrl(url) {
  const isValid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  return isValid;
}
