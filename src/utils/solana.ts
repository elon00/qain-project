export const SOLANA_TESTNET_RPC =
  import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.testnet.solana.com';

export const QAIN_SOLANA_PROGRAM_ID =
  import.meta.env.VITE_QAIN_SOLANA_PROGRAM_ID || '';

type JsonRpcResponse<T> = {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: { code: number; message: string };
};

async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(SOLANA_TESTNET_RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC HTTP ${response.status}`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;
  if (payload.error) {
    throw new Error(`Solana RPC ${payload.error.code}: ${payload.error.message}`);
  }
  if (payload.result === undefined) {
    throw new Error('Solana RPC returned no result');
  }
  return payload.result;
}

export async function getSolanaTestnetHealth(): Promise<string> {
  return rpc<string>('getHealth');
}

export async function getQainProgramAccount(): Promise<unknown | null> {
  if (!QAIN_SOLANA_PROGRAM_ID) return null;
  const result = await rpc<{ value: unknown | null }>('getAccountInfo', [
    QAIN_SOLANA_PROGRAM_ID,
    { encoding: 'base64', commitment: 'confirmed' },
  ]);
  return result.value;
}

export function solanaExplorerProgramUrl(): string | null {
  if (!QAIN_SOLANA_PROGRAM_ID) return null;
  return `https://explorer.solana.com/address/${QAIN_SOLANA_PROGRAM_ID}?cluster=testnet`;
}
