import "log-timestamp";
import { providers, Wallet } from "ethers";

import args from "./args";
import sweep from "./sweep";

// pulls args from cmd line
const RPC_URL = args.rpcUrl;
const COMPROMISED_KEY = args.privateKey;

async function main() {
  console.log(`Connected to ${RPC_URL}`);
  const provider = new providers.JsonRpcProvider(RPC_URL);
  const compromisedWallet = new Wallet(COMPROMISED_KEY, provider);
  await provider.ready;
  console.log("Sweeper address: ", args.sweeperAddress);

  provider.on("block", async blockNumber => {
    console.log(`[BLOCK ${blockNumber}]`);
    await sweep(compromisedWallet);
  });
}

main();

export default {};