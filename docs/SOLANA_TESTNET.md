# QAIN Solana Testnet Deployment

## What is implemented

- Native Rust Solana program in `program/src/lib.rs`.
- SBF build via `cargo build-sbf`.
- GitHub Actions build gate on pull requests.
- Manual testnet deployment workflow.
- RPC verification that the deployed account exists and is executable.
- Explorer URL generation for the resulting Program ID.
- Browser-side testnet RPC utilities in `src/utils/solana.ts`.

## One-time credentials

Generate a payer/deployer keypair and a separate program keypair. The program keypair determines the stable QAIN Program ID.

Store their complete JSON arrays as protected GitHub environment secrets:

- `SOLANA_TESTNET_DEPLOYER_KEYPAIR`
- `QAIN_SOLANA_PROGRAM_KEYPAIR`

The deployer needs enough testnet SOL to pay deployment rent and transaction fees.

## Deploy

Open **Actions → Solana Testnet → Run workflow**, set **deploy=true**, and run it.

The workflow will:

1. install the stable Agave/Solana toolchain;
2. compile the QAIN program to SBF;
3. restore the protected signer files in the runner's temporary directory;
4. configure `https://api.testnet.solana.com`;
5. deploy with the dedicated program keypair;
6. call `scripts/verify-solana-testnet.mjs`;
7. print the Program ID and Solana Explorer testnet link in the job summary.

## Application configuration

After a successful deployment, set:

```bash
VITE_SOLANA_RPC_URL=https://api.testnet.solana.com
VITE_QAIN_SOLANA_PROGRAM_ID=<program-id>
```

Do not claim testnet deployment until the verification script confirms that the account exists and has `executable: true`.
