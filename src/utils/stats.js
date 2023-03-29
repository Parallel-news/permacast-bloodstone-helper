import { getPermacastState } from "./exm.js";

async function getTotalPermacastSize() {
  try {
    const podcasts = await getPermacastState();

    if (!podcasts.length) {
      return { total_byte_size: "pending" };
    }

    let totalSize = 0;

    for (let podcast of podcasts) {
      const episodes = podcast["episodes"];

      if (episodes.length === 0) {
        continue;
      }
      const sizeArray = episodes.map((ep) => ep.size);
      const podcastSize = sizeArray.reduce((a, b) => a + b, 0);
      totalSize += podcastSize;
    }

    const re = {
      total_byte_size: totalSize,
      state: podcasts,
    };
    return re;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function stats() {
  try {
    const size = await getTotalPermacastSize();
    if (size.total_byte_size === "pending") {
      return {
        total_byte_size: "pending",
        total_episodes_count: "pending",
        total_channels_count: "pending",
      };
    }

    const re = {
      total_byte_size: size.total_byte_size,
      total_episodes_count: size.state.map((pod) => pod.episodes).flat().length,
      total_channels_count: size.state.length,
    };

    return re;
  } catch (error) {
    console.log(error);
    return {};
  }
}
