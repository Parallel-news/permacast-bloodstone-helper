import axios from "axios";
import { PERMACAST_CONTRACT_ADDRESS } from "./constants.js";

export async function getPermacastState() {
  try {
    const state = (
      await axios.get(`https://api.exm.dev/read/${PERMACAST_CONTRACT_ADDRESS}`)
    )?.data;
    return state?.podcasts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPodcastById(pid) {
  try {
    const podcasts = await getPermacastState();
    const podcast = podcasts.find((obj) => obj.pid === pid);
    return podcast;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function getArweaveTxData(txid) {
  try {
    const tx = (await axios.get(`https://arweave.net/${txid}`))?.data;
    return tx;
  } catch (error) {
    throw error;
  }
}
