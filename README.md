# ERC-3643 Token Implementation - Demo Issuance

Implementation of ERC-3643 standard (Security Token) for regulated digital asset issuances with compliance mechanisms.

## Demo Issuance Overview

| Specification | Value |
|---------------|-------|
| **Token Standard** | ERC-3643 (Security Token) |
| **Token Ticker** | $BRGHT |
| **Blockchain** | Ethereum-compatible (Polygon) |
| **Total Supply** | 5,000 tokens |
| **Unit Price** | USD $1,000.00 |
| **Total Issuance** | USD $5,000,000.00 |
| **Term** | 120 months (10 years) |
| **Returns** | Variable: 8% - 15% annual |
| **Rights** | Governance + Economic participation |

## Smart Contract Addresses (Sepolia Testnet)

### Platform Infrastructure Contracts

| Contract | Function | Proxy Address | Implementation |
|----------|----------|---------------|----------------|
| **TrustedIssuersRegistry** | Manages authorized claim issuers | `0x48E4792a59D536Ae5184aB045aF99F73C04FfE47` | `0x24116aabe0245688aAb2b0f279FcDc32E0E8652A` |
| **ClaimTopicsRegistry** | Defines required compliance topics | `0xf492091A0846976DAd7F19ab0A315CaB9C8fc470` | `0x24f081380fe967F29Ea05b4018d768C452047E3F` |
| **IdentityRegistryStorage** | Stores verified investor identities | `0xf0211f02502D451CF7C800A3266E8181F313fD1d` | `0xc339c0a366673d98Ef3e631D8150Bf7FB76F81db` |
| **IdentityRegistry** | Validates investor compliance | `0xFfafE273EC9C973C46Fa146F9Bb2b6C5c2Dff61B` | `0xb79E418910856A7FFe5C92cAeD01556159f18cd5` |
| **ModularCompliance** | Enforces transfer restrictions | `0x648431F39142fF3aB52dE54aD55c9D72e79B653c` | `0x53Fb5e9792B36638b5288b620AA833A707838E94` |

### Issuer Wallet Address

**Emission Wallet**: `0x648C148582008f34622AeF9D40050B78F303b8A1`

**Network**: Sepolia Testnet (Chain ID: 11155111)  
**Deployment Date**: November 7, 2025  
**Proxy Pattern**: OpenZeppelin Transparent Upgradeable Proxies

### Contract Verification

All contracts are publicly deployed and can be verified on Sepolia Etherscan:

```
https://sepolia.etherscan.io/address/{CONTRACT_ADDRESS}
```

## Technical Features

### Compliance Mechanisms

- **KYC/AML Integration**: Whitelist-based access control
- **Transfer Restrictions**: Compliance validation on every transfer
- **Identity Verification**: On-chain identity registry
- **Jurisdictional Controls**: Geography-based restrictions

### Security Features

**Smart Contract Covenants:**

1. **Token Minting Control**: Only authorized issuer can mint
2. **Burn Mechanism**: Multi-signature approval required
3. **Whitelist Enforcement**: Transfers only between approved addresses
4. **Multi-Signature Operations**: Critical actions require multiple approvals
5. **Transaction Reversibility**: Controlled clawback for regulatory compliance

### Governance System

- **Voting Rights**: 1 token = 1 vote
- **Decision Areas**: Budget approval, strategic investments, observer appointments
- **Voting Method**: Blockchain-based, auditable, immutable
- **Technology**: ERC-3643 with governance extensions

## Development Setup

```bash
# Install dependencies
npm install

# Configure environment (.env file required)
ALCHEMY_KEY=your_alchemy_api_key
WALLET_PK=your_private_key_without_0x

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat deployMockPlatformContracts --network sepolia

# Verify connection
npx hardhat console --network sepolia
```

## Contract Interaction

```javascript
// Load deployed contracts
const addresses = require('./addresses/sepolia.json');

// Connect to registry
const identityRegistry = await ethers.getContractAt(
  "IdentityRegistry",
  addresses.identityRegistryProxy
);

// Check compliance
const isVerified = await identityRegistry.isVerified(investorAddress);
```

## Compliance Events

Key events emitted for regulatory monitoring:

- `AddressApproved` - KYC/KYB validation passed
- `AddressRevoked` - Address frozen or blocked
- `TransferBlocked` - Non-compliant transfer attempt
- `TransferReverted` - Forced transaction reversal
- `TokenPausedWithMetadata` - Contract emergency pause

## Risk Factors

**Technology**: Smart contract vulnerabilities, blockchain dependencies  
**Regulatory**: Jurisdictional restrictions, compliance changes  
**Market**: Limited liquidity, variable returns, long-term commitment

## Documentation References

- [ERC-3643 Standard](https://erc3643.org/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/)
- [Hardhat Guide](https://hardhat.org/docs)

## Legal Disclaimer

**DEMO ENVIRONMENT**: Deployed on Sepolia testnet for testing purposes only. Not for production use. Test tokens have no monetary value. Conduct independent security audits before mainnet deployment.

---

**Status**: Demo/Testing  
**Version**: 1.0.0  
**Network**: Sepolia Testnet  
**Last Updated**: November 2025

## License

GPL-3.0
