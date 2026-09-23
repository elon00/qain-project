# Colosseum Copilot

QAIN includes a bootstrap script for Colosseum Copilot, a crypto product-research skill for coding agents.

## Required environment

```bash
export COLOSSEUM_COPILOT_API_BASE="https://copilot.colosseum.com/api/v1"
export COLOSSEUM_COPILOT_PAT="<your active token>"
```

Never commit the PAT.

## Install + verify

```bash
bash scripts/setup-colosseum-copilot.sh
```

The script first calls the authenticated `/status` endpoint and then runs:

```bash
npx skills add ColosseumOrg/colosseum-copilot
```

## QAIN research prompt

After installation, use a prompt such as:

> Research QAIN as a Solana post-quantum AI/agentic platform. Compare it against hackathon projects, AI-agent infrastructure, wallet/multisig products, decentralized compute/DePIN, post-quantum cryptography projects, and on-chain automation. Identify direct competitors, adjacent products, defensible gaps, and the narrowest high-value wedge QAIN can ship first. Cite the underlying Colosseum sources and distinguish shipped products from prototypes.

## Security

Keep `COLOSSEUM_COPILOT_PAT` only in your local shell secret store or a GitHub Actions secret. Regenerating the token invalidates the previous token.
