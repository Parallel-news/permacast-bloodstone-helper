import axios from "axios";
import Arweave from "arweave";
import {
  PERMACAST_CONTRACT_ADDRESS,
  INDEXING_CONTRACT_ADDRESS,
} from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

const PK = JSON.parse(process.env.ADMIN_JWK);

const arweave = Arweave.init({
  host: "arweave.net",
  port: 449,
  protocol: "https",
  timeout: 60000,
  logging: false,
});

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

export async function getIndexingState() {
  try {
    const state = (
      await axios.get(`https://api.exm.dev/read/${INDEXING_CONTRACT_ADDRESS}`)
    )?.data;
    return state?.cache;
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

export async function getGenericState(contract_address) {
  try {
    const state = (
      await axios.get(`https://api.exm.dev/read/${contract_address}`)
    )?.data;
    return state;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getArweaveTxData(txid) {
  try {
    const tx = (await axios.get(`https://arseed.web3infra.dev/${txid}`))?.data;
    return tx;
  } catch (error) {
    return "";
  }
}

export async function exmWriteIndex(txid) {
  try {
    const signature = await generateSig();
    const payload = {
      function: "indexTransaction",
      jwk_n: PK.n,
      sig: signature,
      txid: txid,
    };
    const req = (
      await axios.post(
        `https://57eyndihc95lpb8fhhaazqpatgfu9bplwzmk5cnohzk.exm.run`,
        payload
      )
    )?.data;
    console.log(req);
    if (req?.status === "SUCCESS" && req?.data?.execution?.updated) {
      return { id: req?.data?.execution?.result?.id, status: 200 };
    }
    return { id: null, status: 400 };
  } catch (error) {
    console.log(error);
    return { id: null, status: 400 };
  }
}

async function generateSig() {
  const data = new TextEncoder().encode(`permacast-index-data-bloodstone`);
  const sign = await arweave.crypto.sign(PK, data);

  return sign.toString("base64");
}
