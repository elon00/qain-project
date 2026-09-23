const RPC = process.env.SOLANA_RPC_URL || "https://api.testnet.solana.com";
const programId = process.env.QAIN_SOLANA_PROGRAM_ID;

if (!programId) {
  console.error("QAIN_SOLANA_PROGRAM_ID is required.");
  process.exit(2);
}

async function rpc(method, params = []) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

const version = await rpc("getVersion");
const account = await rpc("getAccountInfo", [
  programId,
  { encoding: "base64", commitment: "confirmed" },
]);

if (!account?.value) {
  console.error(`Program ${programId} was not found on ${RPC}`);
  process.exit(1);
}

const executable = Boolean(account.value.executable);
console.log(JSON.stringify({
  clusterRpc: RPC,
  programId,
  executable,
  owner: account.value.owner,
  lamports: account.value.lamports,
  solanaCore: version["solana-core"] ?? version["feature-set"] ?? "unknown",
}, null, 2));

if (!executable) {
  console.error("Account exists but is not executable.");
  process.exit(1);
}
