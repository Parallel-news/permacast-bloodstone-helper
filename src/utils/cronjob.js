import axios from "axios";
import { Exm, ContractType } from "@execution-machine/sdk";
import { PERMACAST_CONTRACT_ADDRESS } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

const exm = new Exm({ token: process.env.EXM_TOKEN });

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

      const tx = await exm.functions.write(PERMACAST_CONTRACT_ADDRESS, inputs);
      console.log(tx);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sleep(min) {
  console.log(`sleeping for ${min} min`);
  return new Promise((resolve) => setTimeout(resolve, min * 60 * 1e3));
}
