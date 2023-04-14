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
    const title = e?.title?.[0];
    const pubDate = e?.pubDate?.[0];
    const duration = e?.["itunes:duration"]?.[0];
    const description = stripHtml(e?.description?.[0])?.result;
    return { link, fileType, title, pubDate, duration, description };
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
  } catch (error) {
    console.log(error);
    return { error: "rss-import-error" };
  }
}

async function isValidUrl(url) {
  const isValid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  return isValid;
}

