import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-gas-reporter";

require("dotenv").config();

// ALCHEMY API KEY
const ALCHEMY_API_KEY: string = process.env.ALCHEMY_API_KEY;

const ALCHEMY_API_KEY_GOERLI: string = process.env.ALCHEMY_API_KEY;

const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY;

// GOERLI PRIVATE KEY
const PRIVATE_KEY: string = process.env.PRIVATE_KEY;

const REPORT_GAS = process.env.REPORT_GAS || false;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY_GOERLI}`,
      chainId: 5,
      accounts: [PRIVATE_KEY],
    },
    shibuya: {
      url: "https://rpc.shibuya.astar.network:8545",
      chainId: 81,
      accounts: [PRIVATE_KEY],
    },

    // Astar community faucet (please don't abuse): https://as-faucet.xyz/en/astar#
    astar: {
      url: "https://evm.astar.network",
      chainId: 592,
      accounts: [PRIVATE_KEY],
    },

    // Shiden community faucet (please don't abuse): https://as-faucet.xyz/en/shiden#
    shiden: {
      url: "https://evm.shiden.astar.network",
      chainId: 336,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    gasPrice: 21,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
