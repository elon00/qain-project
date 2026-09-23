export type SolanaWalletProvider = {
  publicKey?: { toString(): string } | null;
  isConnected?: boolean;
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect?(): Promise<void>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
  signAllTransactions?: (transactions: unknown[]) => Promise<unknown[]>;
  signMessage?: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
};

type WalletWindow = Window & {
  solana?: SolanaWalletProvider & {
    isPhantom?: boolean;
    isSolflare?: boolean;
  };
  backpack?: SolanaWalletProvider;
};

export type DetectedSolanaWallet = {
  name: string;
  provider: SolanaWalletProvider;
};

export function detectSolanaWallets(): DetectedSolanaWallet[] {
  if (typeof window === 'undefined') return [];

  const browser = window as WalletWindow;
  const wallets: DetectedSolanaWallet[] = [];

  if (browser.solana) {
    const name = browser.solana.isPhantom
      ? 'Phantom'
      : browser.solana.isSolflare
        ? 'Solflare'
        : 'Injected Solana Wallet';
    wallets.push({ name, provider: browser.solana });
  }

  if (browser.backpack && browser.backpack !== browser.solana) {
    wallets.push({ name: 'Backpack', provider: browser.backpack });
  }

  return wallets;
}

export async function connectSolanaWallet(
  provider: SolanaWalletProvider,
): Promise<string> {
  const result = await provider.connect();
  return result.publicKey.toString();
}

export async function disconnectSolanaWallet(
  provider: SolanaWalletProvider,
): Promise<void> {
  await provider.disconnect?.();
}
