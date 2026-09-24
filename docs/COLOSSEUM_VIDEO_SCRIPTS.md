# QAIN Colosseum Video Scripts

## 2–3 minute presentation

**0:00–0:25 — Problem**
AI agents and edge systems increasingly need to buy services autonomously while protecting long-lived data and identities against future cryptographic threats. Existing API-key billing, payment rails, and security layers are usually separate.

**0:25–0:55 — Solution**
QAIN is a Web 4.0 edge platform combining Solana, x402 HTTP payments, post-quantum cryptography, DID identity, agentic AI orchestration, and Conway-inspired distributed coordination.

**0:55–1:35 — Product**
Show the live application, edge topology, PQC operations, and AI orchestration. Then show an unpaid request to the x402 premium endpoint returning HTTP 402. Retry with payment authorization and show the settlement receipt plus PQC service attestation.

**1:35–2:05 — Why now / wedge**
Autonomous agents need native machine payments and verifiable services. QAIN's first wedge is pay-per-request PQC security and orchestration for agents and crypto infrastructure, with x402 for metering and Solana for settlement.

**2:05–2:30 — Business / next step**
Describe the initial developer audience, integration strategy, any real traction collected during the hackathon, and the plan to evolve from paid API primitives into an agentic edge-security network.

## ≤3 minute product demo

1. Open QAIN and briefly identify the main edge/PQC/AI modules.
2. Show `/api/health`.
3. Demonstrate a PQC operation.
4. Call `POST /api/x402/pqc-insight` without a payment signature and show HTTP 402.
5. Show the `PAYMENT-REQUIRED` terms: exact scheme, Solana testnet, USDC, recipient, amount.
6. Retry with a valid x402 payment authorization.
7. Show `PAYMENT-RESPONSE`, the settlement transaction, and the ML-DSA-65 attestation.
8. Open the Solana Explorer link for the QAIN Program ID recorded in `deployments/solana-testnet.json`.
9. Close with the GitHub repository and the specific work completed during the hackathon window.
