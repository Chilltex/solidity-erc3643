// Utilities related with objects and instances to interact with an EVM network.

import { isHexString, SigningKey } from "ethers";

/**
 * Gets the Private Key from the `.env` file.
 *
 * @returns A SigningKey instance with the PK provided.
 */
export function getPrivateKey() {
  require("dotenv").config();
  const inputKey = process.env["WALLET_PK"] ? process.env["WALLET_PK"] : null;
  
  if (!inputKey) {
    console.error("ERROR: WALLET_PK environment variable not found");
    console.error("Please ensure WALLET_PK is set in your .env file");
    throw Error(`There is no Private Key available. Check your .env configuration.`);
  }
  
  // Log successful key loading for debugging purposes
  console.log(`Private Key loaded successfully (length: ${inputKey.length} characters)`);
  
  let privateKey;
  // Ensure the private key has the 0x prefix required by ethers.js
  privateKey = isHexString(inputKey) ? inputKey : "0x" + inputKey;
  return new SigningKey(privateKey);
}

/**
 * Returns the provider URL from `.env` file.
 *
 * @param network The name of network to get the provider url from.
 *
 * @returns The URL for the indicated provider.
 */
export function getProviderURL(network: string) {
  require("dotenv").config();
  const alchemyKey = process.env['ALCHEMY_KEY'];
  
  // Validate that Alchemy API key is available
  if (!alchemyKey) {
    console.error("ERROR: ALCHEMY_KEY environment variable not found");
    console.error("Please ensure ALCHEMY_KEY is set in your .env file");
    throw Error(`ALCHEMY_KEY not found. Check your .env configuration.`);
  }
  
  // Log the first 8 characters of the API key for verification
  console.log(`Alchemy Key loaded: ${alchemyKey.substring(0, 8)}...`);
  
  let providerURL: string;
  
  if (network === 'sepolia') {
    providerURL = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;
  } else if (network === 'ethereum') {
    providerURL = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
  } else if (network === 'hardhat' || network === 'localhost') {
    // Support for local Hardhat node
    providerURL = 'http://127.0.0.1:8545';
  } else {
    console.error(`ERROR: Unsupported network: ${network}`);
    throw Error(`No provider URL configuration for network: ${network}`);
  }
  
  console.log(`Provider URL: ${providerURL}`);
  return providerURL;
}
