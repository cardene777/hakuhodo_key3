import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-gas-reporter";

require("dotenv").config();

// ALCHEMY API KEY
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

// GOERLI PRIVATE KEY
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

const REPORT_GAS = process.env.REPORT_GAS || true;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 5,
      accounts: [GOERLI_PRIVATE_KEY],
    },
    gasReporter: {
      enabled: REPORT_GAS ? true : false,
      currency: "USD",
      gasPrice: 21,
    },
  },
  // etherscan: {
  //   apiKey: etherscanApiKey,
  // },
};

export default config;
