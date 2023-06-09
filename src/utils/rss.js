import RSS from "rss";
import {
  getPodcastById,
  getArweaveTxData,
  getIndexingState,
  exmWriteIndex,
} from "./exm.js";
import axios from "axios";

export async function generateRss(pid) {
  try {
    const podcast = await getPodcastById(pid);
    const indexingContractState = await getIndexingState();

    if (JSON.stringify(podcast) === "{}") {
      const feed = new RSS();
      // return empty XML string
      return feed.xml({ indent: true });
    }

    const IMG = `https://arweave.net/${podcast.cover}`;
    const IMG_REDICRECT = await getTxRedirectUrl(podcast.cover);
    const categories = podcast.categories
      .toString()
      .replaceAll("&", "&amp;")
      .split(",")
      .map((category) => category.charAt(0).toUpperCase() + category.slice(1));

    const podcastDesc =
      podcast.description in indexingContractState
        ? indexingContractState[podcast.description]
        : await getArweaveTxData(podcast.description);

    if (!(podcast.description in indexingContractState)) {
      await exmWriteIndex(podcast.description);
    }

    const feed = new RSS({
      custom_namespaces: {
        itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
      },
      title: podcast.podcastName,
      description: podcastDesc,
      managingEditor: podcast.email,
      categories: categories,
      image_url: IMG_REDICRECT,
      site_url: `https://permacast.app/podcast/${podcast.pid}`,
      language: podcast.language,
      custom_elements: [
        { "itunes:image": { _attr: { href: IMG_REDICRECT } } },
        { "itunes:explicit": podcast.explicit },
        {
          "itunes:category": [
            {
              _attr: {
                text: categories,
              },
            },
          ],
        },
        { "itunes:author": podcast.author },
        {
          "itunes:owner": [
            { "itunes:email": podcast.email },
            { "itunes:name": podcast.podcastName },
          ],
        },
      ],
    });

    for (let episode of podcast.episodes) {
      const episodeDesc =
        episode.description in indexingContractState
          ? indexingContractState[episode.description]
          : await getArweaveTxData(episode.description);

      if (!(episode.description in indexingContractState)) {
        await exmWriteIndex(episode.description);
      }

      feed.item({
        title: episode.episodeName,
        description: episodeDesc,
        enclosure: {
          url: `https://arweave.net/${episode.contentTx}`,
          size: episode.contentTxByteSize,
          type: episode.type,
        },
        guid: episode.eid,
        date:
          episode.uploadedAt * 1000 < Date.now()
            ? episode.uploadedAt * 1000
            : episode.uploadedAt, // normalizing timestamp between Amber & Bloodstone
      });
    }

    return feed.xml({ indent: true });
  } catch (error) {
    const feed = new RSS();
    // return empty XML string
    return feed.xml({ indent: true });
  }
}

async function getTxRedirectUrl(txid) {
  try {
    const tx = await axios.get(`https://arweave.net/${txid}`);

    return tx?.request?.res?.responseUrl;
  } catch (error) {
    console.log(error);
    return `https://arweave.net/${txid}`;
  }
}
