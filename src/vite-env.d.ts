/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_RPC_URL?: string;
  readonly VITE_QAIN_SOLANA_PROGRAM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
