# Cloakroom: Institutional Privacy for On-Chain Payroll & Treasury Operations

![Cloakroom Banner](https://img.shields.io/badge/Starknet-Mainnet_Live-blue?style=for-the-badge&logo=starknet) ![Cairo](https://img.shields.io/badge/Cairo-2.x-orange?style=for-the-badge) ![ZK-STARKs](https://img.shields.io/badge/ZK--STARKs-Stwo-purple?style=for-the-badge)

## 📌 Overview

**Cloakroom** provides institutional-grade privacy for on-chain payroll and treasury operations on Starknet. 

**Live Portal (Vercel):** [https://cloakroom-xi.vercel.app/portal](https://cloakroom-xi.vercel.app/portal)

Public block explorers inherently expose sensitive organizational data—salaries, bonuses, and vendor payments are visible to everyone. Cloakroom solves this by utilizing zero-knowledge cryptography (ZK-STARKs) to completely mask transaction amounts, sender-receiver linkages, and asset flows while maintaining verifiable accounting. Organizations can now run their on-chain payroll with the confidentiality they expect from traditional banking.

## 🚀 Verified Starknet Mainnet Deployment

Cloakroom is live on Starknet Mainnet. Our core anonymizer logic is deployed and actively verifying ZK proofs.

- **Contract Name**: `PayrollAnonymizer`
- **Deployed Address**: [`0x0307017665c243d4411aca77db2782e3e8a13c0a9260f5b8ec2956b373909af8`](https://voyager.online/contract/0x0307017665c243d4411aca77db2782e3e8a13c0a9260f5b8ec2956b373909af8)
- **Transaction Hash**: [`0x02a4f1731f701495d5c4456cc9a9bb6bcfecbe89dd201c3e0b7166aab9411d62`](https://voyager.online/tx/0x02a4f1731f701495d5c4456cc9a9bb6bcfecbe89dd201c3e0b7166aab9411d62)
- **Network Status**: Starknet Mainnet (`ACCEPTED_ON_L2`)

*Note: The official judging payload artifact containing the required pool event transactions can be found in `strk20.json` at the root of the repository.*

## 🏗️ Core Architecture & Technology Stack

Cloakroom is built on a modern, high-performance zero-knowledge stack:

- **Cairo 2.x Smart Contracts**: Highly optimized on-chain logic audited and tested using Starknet Foundry (`snforge`).
- **Client-Side Stwo ZK-STARK Prover**: Browser and local execution environments generate cryptographic proofs off-chain, ensuring user secrets are strictly isolated and never transmitted.
- **STRK20 Privacy SDK Integration**: Deep integration with Starknet.js and native Account Abstraction allows for gasless, seamless user experiences via Paymasters.
- **STRK20 Privacy Pool**: A unified shielded pool enabling the private transfer and vesting of STRK and other Starknet tokens.
- **Non-Interactive Stealth Addresses**: Receivers generate stealth meta-addresses, allowing dispatchers to send funds without the receiver needing to interact to generate new addresses.

## 💎 Key Value Pillars

1. **Universal Anonymity Sets**: By utilizing a shared shielded pool for multiple assets, Cloakroom maximizes the anonymity set, making traffic analysis computationally infeasible.
2. **Association Sets & "Proof of Innocence"**: Organizations can prove compliance without breaking privacy by generating proofs that their funds do not originate from sanctioned or malicious association sets.
3. **Scoped Compliance Viewing Keys**: Treasuries can issue read-only viewing keys to auditors and regulators, providing transparent access to specific transaction histories without compromising global privacy.
4. **Encrypted On-Chain Vesting**: Employee token vesting schedules are handled on-chain but encrypted, preventing competitors from scraping employee compensation data.
## 🔐 Privacy Model & Evidence Matrix

Cloakroom is built on strict data confidentiality boundaries. By separating public interaction from encrypted state and utilizing zero-knowledge proofs, we ensure that sensitive organizational data remains entirely private while still conforming to global verifiable accounting rules.

| Data Type | Visibility Tier |
|-----------|-----------------|
| **Pool Interaction & Timing** | Public (On-Chain) |
| **Commitment Roots & Nullifiers** | Public (Zero-Knowledge) |
| **Worker Identity & Payout Address** | Encrypted Ciphertext (Stealth) |
| **Salary & Compensation Amount** | Encrypted Ciphertext (Shielded Notes) |
| **Audit Receipts & Viewing Keys** | Holder/Auditor Choice Only |

## 📂 Repository Structure

The monorepo is divided into distinct, purpose-built workspaces:

```text
.
├── contracts/       # Cairo 2.x smart contracts (PayrollAnonymizer, etc.)
├── frontend/        # Next.js neo-brutalist web application
├── backend/         # TypeScript compiler pipeline, CLI, and SDK integration
└── strk20.json      # Verified Mainnet judging payload artifact
```

## 🛠️ Usage & Quickstart

### Frontend (Next.js)
The frontend is built with a striking neo-brutalist aesthetic using Next.js and Tailwind CSS.
You can view the live deployment here: [https://cloakroom-xi.vercel.app/portal](https://cloakroom-xi.vercel.app/portal)

```bash
cd frontend
npm install
npm run dev
```

### Backend (TypeScript Pipeline)
The backend handles the heavy lifting for compiling actions, generating client-side proofs, and preparing the transaction payload.

```bash
cd backend
npm install
# Run the TS compiler pipeline for payroll data
npm run lock -- --csv examples/payroll.csv
```

---
*Built for the STRK20 Hackathon on Starknet.*
