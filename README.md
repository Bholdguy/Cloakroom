# Cloakroom

Cloakroom is a web application and Starknet smart contract designed to facilitate private payroll and vesting distributions on-chain.

## Architecture

Cloakroom's core architecture relies on the `PayrollAnonymizer.cairo` contract. This contract facilitates transactions by calling the `privacy_invoke` function on the live STRK20 privacy pool via an `InvokeExternal` action.

## Status

- **Smart Contracts:** The `PayrollAnonymizer.cairo` contract compiles successfully against `PRIVACY-0.14.3-RC.0` and Cairo `2.17.0`. 
- **Deployment:** The anonymizer contract has **not** been deployed to any network (testnet or mainnet). 
- **Transactions:** There are currently zero live transactions or execution hashes in the repository.
- **Testing:** There is no `snforge` test suite implemented at this time.
- **Features:** Gasless claim flow via paymasters is not yet implemented.

## Setup Instructions

### Frontend
1. Ensure you have Node.js (v20 or higher recommended) installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Contracts
1. Ensure you have Scarb `2.17.0` and Starknet Foundry `0.59.0` installed.
2. Navigate to the contracts directory:
   ```bash
   cd contracts
   ```
3. Build the contracts:
   ```bash
   scarb build
   ```

## Live Site
The frontend is deployed on Vercel. Ensure the Root Directory is left blank/empty in Vercel settings so it builds from the repository root.
