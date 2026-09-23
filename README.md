# QAIN Web 4.0 Post-Quantum Edge Platform

QAIN combines a React/TypeScript application, post-quantum cryptography, DID authentication, Conway-based orchestration, AI assistance, and a Solana on-chain program target.

## Local application

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `GEMINI_API_KEY` in your local environment before using Gemini-backed features.

## Solana testnet

The repository now contains a native Rust Solana program under `program/`, a testnet verification script, and a GitHub Actions workflow that can build and deploy the program.

Build locally after installing the current Solana/Agave toolchain:

```bash
cd program
cargo build-sbf
```

Verify a deployed program:

```bash
export QAIN_SOLANA_PROGRAM_ID="<program-id>"
export SOLANA_RPC_URL="https://api.testnet.solana.com"
npm run solana:verify:testnet
```

The deployment workflow is `.github/workflows/solana-testnet.yml`. Actual deployment requires two repository/environment secrets:

- `SOLANA_TESTNET_DEPLOYER_KEYPAIR`: funded testnet payer/deployer keypair JSON.
- `QAIN_SOLANA_PROGRAM_KEYPAIR`: dedicated program keypair JSON that fixes the QAIN Program ID.

The workflow never prints either private key.

## Colosseum Copilot

Set your active token outside source control:

```bash
export COLOSSEUM_COPILOT_API_BASE="https://copilot.colosseum.com/api/v1"
export COLOSSEUM_COPILOT_PAT="<your-token>"
npm run colosseum:setup
```

See `docs/COLOSSEUM_COPILOT.md` for the QAIN-specific research prompt and security notes.

## Quality gates

```bash
npm run lint
npm run build
npm run qmoosa:finish
```

Solana program builds are also checked by GitHub Actions when `program/**` or the testnet workflow changes.

## Security

Do not commit Gemini keys, Solana keypairs, wallet seed phrases, or the Colosseum PAT. Keep deploy credentials in a local secret store or protected GitHub environment.
