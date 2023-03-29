import { getPermacastState } from "./exm.js";

async function episodesCountSorting() {
  try {
    const permacastState = await getPermacastState()

    if (!permacastState?.length) {
      return {};
    }

    
    const sortedState = permacastState.sort(
      (a, b) => b.episodes.length - a.episodes.length
    );

    return { res: sortedState };
  } catch (error) {
    console.log(error);
    return {}
  }
}

async function podcastsActivitySorting() {
  try {
    const permacastState = await getPermacastState()

    if (!permacastState?.length) {
      return {};
    }

    for (const podcast of permacastState) {
      const uploadsTimestamp = podcast.episodes.map(
        (episode) => episode?.uploadedAt
      );
      podcast.latestUpload = Math.max(...uploadsTimestamp);
    }

    const sortedState = permacastState.sort(
      (a, b) => b.latestUpload - a.latestUpload
    );
    return { res: sortedState };
  } catch (error) {
    console.log(error);
    return {}
  }
}

async function nonEmptypodcastsActivitySorting() {
  try {
    const permacastState = (await podcastsActivitySorting())?.res;

    if (JSON.stringify(permacastState) === "{}") {
      return {};
    }


    const filteredState = permacastState.filter(
      (pod) => pod.episodes.length > 0
    );

    return { res: filteredState };
  } catch (error) {
    console.log(error);
    return {}
  }
}

async function nonEmptyepisodesCountSorting() {
  try {
    const permacastState = (await episodesCountSorting())?.res

    if (JSON.stringify(permacastState) === "{}") {
      return {};
    }

    const filteredState = permacastState.filter(
      (pod) => pod.episodes.length > 0
    );

    return { res: filteredState };
  } catch (error) {
    console.log(error);
    return {}
  }
}

export async function sort(type) {
  try {
    switch (type) {
      case "episodescount":
        return await episodesCountSorting();
      case "channelsactivity":
        return await podcastsActivitySorting();
      case "episodescount1":
        return await nonEmptyepisodesCountSorting();
      case "channelsactivity1":
        return nonEmptypodcastsActivitySorting();
      default:
        return await getPermacastState();
    }
  } catch (error) {
    console.log(error);
    return {}
  }
}
