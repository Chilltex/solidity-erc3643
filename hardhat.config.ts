import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";

dotenv.config();

import "./tasks";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {},
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2${process.env.ALCHEMY_KEY}`,
      chainId: 11155111,
      accounts: [process.env.WALLET_PK || ""],
    },
    ethereum: {
      url: `https://eth-mainnet.g.alchemy.com/v2${process.env.ALCHEMY_KEY}`,
      chainId: 1,
      accounts: [process.env.WALLET_PK || ""],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./tests",
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v6",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
    ],
  },
};

export default config;
