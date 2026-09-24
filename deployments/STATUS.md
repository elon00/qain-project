# QAIN Deployment Status

Last verified: 2026-09-24

## Application

- GitHub Pages deployment workflow: configured.
- Application CI: passing on the x402/Colosseum integration merge.
- x402 v2 protocol tests: passing.
- Rust program check: passing.
- Solana SBF build in deployment workflow: passing.

## Solana testnet

**On-chain deployment: not complete yet.**

Deployment run `35945406683` successfully installed the pinned Solana toolchain and built the QAIN SBF program, then stopped before signer configuration because the protected GitHub environment did not provide:

`SOLANA_TESTNET_DEPLOYER_KEYPAIR`

The workflow also requires:

`QAIN_SOLANA_PROGRAM_KEYPAIR`

No Program ID or deployment transaction signature should be claimed until the deployment workflow completes and `deployments/solana-testnet.json` is committed by the verification step.

## Safe completion path

1. Add the two JSON keypair values as protected secrets in the GitHub `solana-testnet` environment.
2. Ensure the deployer has enough Solana testnet SOL for program deployment.
3. Run **Actions → QAIN Testnet Deploy → Run workflow**.
4. The workflow builds, deploys, verifies the executable account, queries transaction evidence, and writes `deployments/solana-testnet.json`.

Private keys and seed phrases must never be committed to this repository.
