/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
