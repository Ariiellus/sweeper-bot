import { utils, Wallet } from "ethers";
import args from "./args";
import { gasPriceToGwei } from "./util";

const { formatEther } = utils;
const sweeperAddress = args.sweeperAddress;
const gasLimit = 21000;


const sweep = async (compromisedWallet: Wallet) => {
  const balance = await compromisedWallet.getBalance();

  if (balance.isZero()) {
    console.log(`Balance is zero`);
    return;
  }

  // Get current gas price
  const gasPrice = await compromisedWallet.provider.getGasPrice();
  const gasCost = gasPrice.mul(gasLimit);

  if (balance.lte(gasCost)) {
    console.log(`Balance too low to cover gas (balance=${formatEther(balance)} ETH, gasCost=${formatEther(gasCost)} ETH)`);
    return;
  }

  // Sweep the balance
  const amountToSweep = balance.sub(gasCost);
  console.log(`Funds detected: ${formatEther(balance)} ETH`);

  try {
    console.log(`Sending ${formatEther(amountToSweep)}`);
    const nonce = await compromisedWallet.provider.getTransactionCount(compromisedWallet.address);

    const tx = await compromisedWallet.sendTransaction({
      to: sweeperAddress,
      gasLimit: 21000,
      gasPrice,
      nonce,
      value: amountToSweep,
    });

    console.log(`Funds swept successfully at nonce ${tx.nonce}`);
  } catch (err: any) {
    console.log(`Error sending tx: ${err.message ?? err}`);
  }
}

export default sweep;

