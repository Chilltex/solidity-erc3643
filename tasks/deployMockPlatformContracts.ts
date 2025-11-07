// Deploy a token without the factory

import { task } from "hardhat/config";
import { getPrivateKey, getProviderURL, writeJsonFile } from "../src/utils";

task(
  "deployMockPlatformContracts",
  "Deploys contracts to be leverage for a mock token deployment",
  async (_, hre) => {
    console.log("=".repeat(60));
    console.log(`Initiating deployment on network: ${hre.network.name}`);
    console.log("=".repeat(60));

    // Load private key from environment variables
    let pk, provider, wallet;

    try {
      pk = getPrivateKey();
    } catch (error) {
      console.error("Failed to load private key:", error);
      throw error;
    }

    // Initialize provider and wallet connection
    try {
      const providerURL = getProviderURL(hre.network.name);
      provider = new hre.ethers.JsonRpcProvider(providerURL);

      // Test connection to the RPC provider
      console.log("\nTesting connection to RPC provider...");
      const network = await provider.getNetwork();
      console.log(
        `Successfully connected to network: ${network.name} (chainId: ${network.chainId})`
      );

      wallet = new hre.ethers.Wallet(pk.privateKey, provider);
      console.log(`Wallet address: ${wallet.address}`);

      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      console.log(
        `Current wallet balance: ${hre.ethers.formatEther(balance)} ETH`
      );

      if (balance === 0n) {
        console.warn(
          "WARNING: Wallet balance is 0 ETH. Deployment may fail due to insufficient funds."
        );
      }
    } catch (error) {
      console.error("Failed to establish connection to provider:", error);
      throw error;
    }

    console.log("\n" + "=".repeat(60));
    console.log("Beginning contract deployment...");
    console.log("=".repeat(60) + "\n");
    console.log("[1/5] Deploying TrustedIssuersRegistry...");
    const trustedIssuersRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("TrustedIssuersRegistry", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await trustedIssuersRegistry.waitForDeployment();
    const trustedIssuersRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await trustedIssuersRegistry.getAddress()
      );
    console.log(
      `    Proxy deployed at: ${await trustedIssuersRegistry.getAddress()}`
    );

    console.log("[2/5] Deploying ClaimTopicsRegistry...");
    const claimTopicsRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("ClaimTopicsRegistry", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await claimTopicsRegistry.waitForDeployment();
    const claimTopicsRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await claimTopicsRegistry.getAddress()
      );
    console.log(
      `    Proxy deployed at: ${await claimTopicsRegistry.getAddress()}`
    );

    console.log("[3/5] Deploying IdentityRegistryStorage...");
    const identityRegistryStorage = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("IdentityRegistryStorage", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await identityRegistryStorage.waitForDeployment();

    const identityRegistryStorageImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await identityRegistryStorage.getAddress()
      );
    console.log(
      `    Proxy deployed at: ${await identityRegistryStorage.getAddress()}`
    );

    console.log("[4/5] Deploying IdentityRegistry...");
    const identityRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("IdentityRegistry", wallet),
      [
        // Fixed: Use getAddress() method instead of .address property for ethers v6 compatibility
        await trustedIssuersRegistry.getAddress(),
        await claimTopicsRegistry.getAddress(),
        await identityRegistryStorage.getAddress(),
      ],
      {
        kind: "transparent",
      }
    );
    await identityRegistry.waitForDeployment();

    const identityRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await identityRegistry.getAddress()
      );
    console.log(
      `    Proxy deployed at: ${await identityRegistry.getAddress()}`
    );

    console.log("[5/5] Deploying ModularCompliance...");
    const modularCompliance = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("ModularCompliance", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await modularCompliance.waitForDeployment();
    const modularComplianceImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await modularCompliance.getAddress()
      );
    console.log(
      `    Proxy deployed at: ${await modularCompliance.getAddress()}`
    );

    console.log("\n" + "=".repeat(60));
    console.log("Deployment completed successfully");
    console.log("=".repeat(60));
    console.log(`
      TrustedIssuersRegistry Proxy: ${await trustedIssuersRegistry.getAddress()}
      TrustedIssuersRegistry Implementation: ${trustedIssuersRegistryImp}

      ClaimTopicsRegistry Proxy: ${await claimTopicsRegistry.getAddress()}
      ClaimTopicsRegistry Implementation: ${claimTopicsRegistryImp}

      IdentityRegistryStorage Proxy: ${await identityRegistryStorage.getAddress()}
      IdentityRegistryStorage Implementation: ${identityRegistryStorageImp}

      IdentityRegistry Proxy: ${await identityRegistry.getAddress()}
      IdentityRegistry Implementation: ${identityRegistryImp}

      ModularCompliance Proxy: ${await modularCompliance.getAddress()}
      ModularCompliance Implementation: ${modularComplianceImp}
`);
    console.log("=".repeat(60) + "\n");

    const filePath = `addresses/${hre.network.name}.json`;
    console.log(`Persisting deployment addresses to ${filePath}...\n`);
    writeJsonFile(
      {
        trustedIssuersRegistryProxy: await trustedIssuersRegistry.getAddress(),
        trustedIssuersRegistryImplementation: trustedIssuersRegistryImp,
        claimTopicsRegistryProxy: await claimTopicsRegistry.getAddress(),
        claimTopicsRegistryImplementation: claimTopicsRegistryImp,
        identityRegistryStorageProxy:
          await identityRegistryStorage.getAddress(),
        identityRegistryStorageImplementation: identityRegistryStorageImp,
        identityRegistryProxy: await identityRegistry.getAddress(),
        identityRegistryImplementation: identityRegistryImp,
        modularComplianceProxy: await modularCompliance.getAddress(),
        modularComplianceImplementation: modularComplianceImp,
      },
      filePath,
      "w"
    );
    console.log("Deployment process completed successfully.\n");
  }
);
