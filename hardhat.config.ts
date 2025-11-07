import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
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
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      chainId: 11155111,
      // Ensure private key is properly formatted with 0x prefix
      accounts: process.env.WALLET_PK 
        ? [process.env.WALLET_PK.startsWith('0x') ? process.env.WALLET_PK : `0x${process.env.WALLET_PK}`]
        : [],
      // Increased timeout to handle Sepolia network congestion
      timeout: 600000, // 10 minutes (increased from default 40 seconds)
      // Configure gas settings for more reliable transactions
      gas: "auto",
      gasPrice: "auto",
    },
    ethereum: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      chainId: 1,
      // Ensure private key is properly formatted with 0x prefix
      accounts: process.env.WALLET_PK 
        ? [process.env.WALLET_PK.startsWith('0x') ? process.env.WALLET_PK : `0x${process.env.WALLET_PK}`]
        : [],
      // Increased timeout to handle network congestion
      timeout: 600000, // 10 minutes
      gas: "auto",
      gasPrice: "auto",
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
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  },
  sourcify: {
    enabled: true,
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
  }
};

export default config;