import axios from "axios";
import { PERMACAST_CONTRACT_ADDRESS } from "./constants.js";

export async function cronjob() {
  try {
    const permacastState = (
      await axios.get(`https://api.exm.dev/read/${PERMACAST_CONTRACT_ADDRESS}`)
    )?.data;
    const episodes = permacastState?.podcasts
      .map((podcast) => podcast.episodes)
      .flat()
      .filter((episode) => !episode?.size);

    for (const episode of episodes) {
      const inputs = {
        function: "assignEpisodeSize",
        eid: episode.eid,
      };
      console.log(inputs);

      await exmWrite(inputs);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function sleep(min) {
  console.log(`sleeping for ${min} min`);
  return new Promise((resolve) => setTimeout(resolve, min * 60 * 1e3));
}


async function exmWrite(inputs) {
  try {
    const req = (
      await axios.post(`https://${PERMACAST_CONTRACT_ADDRESS}.exm.run`, inputs)
    )?.data;

    if (req?.status === "SUCCESS" && req?.data?.execution?.updated) {
      console.log({ id: req?.data?.execution?.result?.id, status: 200 });
    }
  } catch (error) {
    console.log(error);
    console.log({ id: null, status: 400 });
  }
}
