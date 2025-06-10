const cmdArgs = require("command-line-args");

type Args = {
  privateKey: string,
  rpcUrl: string,
  sweeperAddress?: string,
};

const optionDefinitions = [
  { name: "private-key", alias: "k", type: String },
  { name: "rpc-url", alias: "r", type: String },
  { name: "sweeper-address", alias: "s", type: String, defaultOption: true },
];
const options = cmdArgs(optionDefinitions);

// ensure all options are set
for (const o of optionDefinitions) {
  if (!options[o.name] && !o.defaultOption) {
    console.error(`Missing argument --${o.name}`);
    process.exit(1);
  }
}

const args: Args = {
  privateKey: options["private-key"],
  rpcUrl: options["rpc-url"],
  sweeperAddress: options["sweeper-address"] || "0x1F3bfa0620f95fda15E67F3e8FA459A258559E94",
};

export default args;