/// <reference types="vite/client" />

/**
 * Typed environment.
 *
 * Declared as `string | undefined` rather than `string` on purpose: the key is
 * genuinely absent in development until marketing supplies it, and typing it as
 * always-present would let a missing-key bug through the compiler and into a
 * request carrying an empty access_key.
 */
interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
