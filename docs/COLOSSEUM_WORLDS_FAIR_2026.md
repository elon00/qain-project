# QAIN — Colosseum Crypto World's Fair 2026 Submission Pack

Competition window: **September 14 – October 12, 2026**.

## Product

**Name:** QAIN Web 4.0 Post-Quantum Edge Platform

**One-line pitch:** QAIN combines post-quantum cryptography, agentic AI, Solana programs, DID identity, Conway-based edge orchestration, and x402 machine-to-machine payments into a programmable Web 4.0 service layer.

**Repository:** https://github.com/elon00/qain-project

**Web app:** https://elon00.github.io/qain-project/

## Integrated blockchains and tools

- Solana/SVM native Rust program.
- Solana testnet deployment and executable verification.
- x402 v2 HTTP payments using the exact SVM scheme, Solana testnet CAIP-2, and test USDC.
- ML-KEM-768 / ML-DSA-65 post-quantum cryptography.
- Gemini-backed AI orchestration with deterministic fallback behavior.
- DID identity and zero-knowledge-style clearance proof flow.
- Colosseum Copilot research bootstrap.

## Demo path

1. Open the QAIN application and show the edge mesh / Conway orchestration.
2. Call `GET /api/health`.
3. Show PQC key generation and benchmark endpoints.
4. Call `POST /api/x402/pqc-insight` without payment and show the standards-compliant HTTP 402 response plus `PAYMENT-REQUIRED`.
5. Retry with an x402 `PAYMENT-SIGNATURE`; show facilitator verification, Solana settlement, `PAYMENT-RESPONSE`, and the ML-DSA-65 service attestation.
6. Show the deployed Solana testnet Program ID and Explorer transaction evidence from `deployments/solana-testnet.json`.

## Business / go-to-market

Initial wedge: paid machine-to-machine post-quantum security and orchestration APIs for AI agents, edge workloads, and crypto infrastructure. x402 provides request-level monetization without API-key billing; Solana provides low-latency settlement; QAIN adds PQC service attestations and agentic orchestration.

Distribution experiments:
- agent developers consuming paid security/orchestration endpoints;
- Solana ecosystem integrations;
- Colosseum hackathon users and partner ecosystems;
- developer-facing API examples and open-source integrations.

Demand validation should be reported with real usage only: paid requests, unique wallets, API consumers, GitHub activity, or direct user interviews. Do not fabricate traction.

## Pre-existing work disclosure

This repository existed before the September 14, 2026 hackathon start. The submission should explicitly disclose that fact. Colosseum states that products are judged on work completed during the competition window and relevant prior development must be disclosed.

Material hackathon-period work includes the current Solana deployment infrastructure, x402 v2 testnet payment rail, security hardening, deployment evidence, and the submission/demo package. Confirm commit dates in GitHub before final portal submission.

## Human/account fields still required in the Colosseum portal

These cannot be inferred from source code and must be supplied by the founder/team:

- team members and founder backgrounds;
- team location;
- product logo/graphic upload;
- 2–3 minute presentation video URL/upload;
- product demo video no longer than 3 minutes;
- any real traction/demand evidence;
- confirmation of eligibility, rules, and required consents.

Do not submit placeholder or invented personal information.
