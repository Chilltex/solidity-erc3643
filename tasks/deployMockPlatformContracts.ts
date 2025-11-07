// Deploy a token without the factory

import { task } from "hardhat/config";
import { getPrivateKey, getProviderURL, writeJsonFile } from "../src/utils";

task(
  "deployMockPlatformContracts",
  "Deploys contracts to be leverage for a mock token deployment",
  async (_, hre) => {
    const pk = getPrivateKey();
    const provider = new hre.ethers.JsonRpcProvider(
      getProviderURL(hre.network.name)
    );
    const wallet = new hre.ethers.Wallet(pk.privateKey, provider);

    console.log("Deploying contracts...\n\n");
    console.log("- TrustedIssuersRegistry");
    const trustedIssuersRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("TrustedIssuersRegistry", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await trustedIssuersRegistry.deployed();
    const trustedIssuersRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await trustedIssuersRegistry.getAddress()
      );

    console.log("- ClaimTopicsRegistry");
    const claimTopicsRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("ClaimTopicsRegistry", wallet),
      [],
      {
        kind: "transparent",
      }
    );
    await claimTopicsRegistry.deployed();
    const claimTopicsRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await claimTopicsRegistry.getAddress()
      );

    console.log('- IdentityRegistryStorage');
    const identityRegistryStorage = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory(
        "IdentityRegistryStorage",
        wallet
      ),
      [],
      {
        kind: "transparent",
      }
    );
    await identityRegistryStorage.deployed();

    const identityRegistryStorageImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await identityRegistryStorage.getAddress()
      );

    console.log("- IdentityRegistry");
    const identityRegistry = await hre.upgrades.deployProxy(
      await hre.ethers.getContractFactory("IdentityRegistry", wallet),
      [
        trustedIssuersRegistry.address,
        claimTopicsRegistry.address,
        identityRegistryStorage.address
      ],
      {
        kind: "transparent",
      }
    );
    await identityRegistry.deployed();

    const identityRegistryImp =
      await hre.upgrades.erc1967.getImplementationAddress(
        await identityRegistry.getAddress()
      );
    
    console.log('- ModularCompliance');
    const modularCompliance = await hre.upgrades.deployProxy(
        await hre.ethers.getContractFactory(
            "ModularCompliance",
            wallet
        ),
        [],
        {
            kind: "transparent",
        }
    );
    await modularCompliance.deployed();
    const modularComplianceImp =
        await hre.upgrades.erc1967.getImplementationAddress(
            await modularCompliance.getAddress()
        );

    console.log(`\
        ============================================================\n\
        Contracts deployed: \n\n\
        TrustedIssuersRegistry Proxy: ${await trustedIssuersRegistry.getAddress()}\n\
        TrustedIssuersRegistry Implementation: ${trustedIssuersRegistryImp}\n\
        ClaimTopicsRegistry Proxy: ${await claimTopicsRegistry.getAddress()}\n\
        ClaimTopicsRegistry Implementation: ${claimTopicsRegistryImp}\n\
        IdentityRegistryStorage Proxy: ${await identityRegistryStorage.getAddress()}\n\
        IdentityRegistryStorage Implementation: ${identityRegistryStorageImp}\n\
        IdentityRegistry Proxy: ${await identityRegistry.getAddress()}\n\
        IdentityRegistry Implementation: ${identityRegistryImp}\n\
        ModularCompliance Proxy: ${await modularCompliance.getAddress()}\n\
        ModularCompliance Implementation: ${modularComplianceImp}\n\
        ============================================================\n`);

    const filePath = `addresses/${hre.network.name}.json`;
    console.log(`Saving addresses to ${filePath}...\n`);
    writeJsonFile(
      {
        trustedIssuersRegistryProxy: await trustedIssuersRegistry.getAddress(),
        trustedIssuersRegistryImplementation: trustedIssuersRegistryImp,
        claimTopicsRegistryProxy: await claimTopicsRegistry.getAddress(),
        claimTopicsRegistryImplementation: claimTopicsRegistryImp,
        identityRegistryStorageProxy: await identityRegistryStorage.getAddress(),
        identityRegistryStorageImplementation: identityRegistryStorageImp,
        identityRegistryProxy: await identityRegistry.getAddress(),
        identityRegistryImplementation: identityRegistryImp,
        modularComplianceProxy: await modularCompliance.getAddress(),
        modularComplianceImplementation: modularComplianceImp
      } as any,
      filePath,
      "w"
    );
    console.log("Done with deployment!\n");
  }
);
