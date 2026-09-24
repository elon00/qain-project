import assert from "node:assert/strict";
import test from "node:test";
import {
  SOLANA_TESTNET_CAIP2,
  SOLANA_TESTNET_USDC,
  decodeX402Header,
  encodeX402Header,
  loadX402Config,
} from "../src/utils/x402";

test("x402 defaults to Solana testnet and test USDC", () => {
  const config = loadX402Config({
    X402_FACILITATOR_URL: "https://facilitator.example",
    X402_PAY_TO: "11111111111111111111111111111111",
  });

  assert.ok(config);
  assert.equal(config.network, SOLANA_TESTNET_CAIP2);
  assert.equal(config.asset, SOLANA_TESTNET_USDC);
  assert.equal(config.amount, "1000");
  assert.equal(config.maxTimeoutSeconds, 60);
});

test("x402 header round-trip preserves v2 payload", () => {
  const payload = {
    x402Version: 2,
    scheme: "exact",
    network: SOLANA_TESTNET_CAIP2,
  };
  const encoded = encodeX402Header(payload);
  assert.deepEqual(decodeX402Header(encoded), payload);
});

test("x402 fails closed when required server configuration is absent", () => {
  assert.equal(loadX402Config({}), null);
});

test("x402 rejects unsafe non-HTTPS facilitator URLs", () => {
  assert.throws(
    () =>
      loadX402Config({
        X402_FACILITATOR_URL: "http://facilitator.example",
        X402_PAY_TO: "11111111111111111111111111111111",
      }),
    /HTTPS/,
  );
});

test("x402 rejects invalid atomic prices", () => {
  assert.throws(
    () =>
      loadX402Config({
        X402_FACILITATOR_URL: "https://facilitator.example",
        X402_PAY_TO: "11111111111111111111111111111111",
        X402_PRICE_ATOMIC: "0",
      }),
    /positive integer/,
  );
});
