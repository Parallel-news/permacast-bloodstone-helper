import { getPermacastState, getGenericState } from "./exm.js";
import { PASOM_CONTRACT_ADDRESS, ANS_CONTRACT_ADDRESS } from "./constants.js";

export async function getPermacastUsers(address) {
  try {
    const pcState = await getPermacastState();
    const pasomState = await getGenericState(PASOM_CONTRACT_ADDRESS);
    const ansState = await getGenericState(ANS_CONTRACT_ADDRESS);
    const allPcUsers = [...new Set(pcState.map((podcast) => podcast.owner))];
    const res = [];

    for (const address of allPcUsers) {
      let profile = {};
      const ansDomain = ansState.balances.find(
        (domain) => domain.address === address
      )?.primary_domain;
      const createdPodcasts = pcState
        .filter((podcast) => podcast.owner === address)
        ?.map((podcast) => podcast?.pid);
      const episodesCount = pcState
        .map((podcast) => podcast.episodes)
        .flat()
        .filter((episode) => episode.uploader === address)?.length;
      const pasomProfile = pasomState.profiles.find(
        (user) => user.address === address
      );

      if (pasomProfile?.address) {
        profile = pasomProfile;
      } else {
        profile.address = address;
      }

      profile.extension = {
        ansDomain: ansDomain ? `${ansDomain}.ar` : null,
        createdPodcasts: createdPodcasts.length >= 0 ? createdPodcasts : [],
        episodesCount: episodesCount ? episodesCount : 0,
      };

      res.push(profile);
    }

    if (address) {
      return res?.find((user) => user.address === address);
    }

    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
}
