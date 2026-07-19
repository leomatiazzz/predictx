# Merkle Validator Anchor Program

This package contains a small, isolated Anchor contract that:

1. Accepts a Merkle proof and recomputes a root locally.
2. Builds a payload for a TxLINE-style `validate_stat` instruction using the official IDL snapshot in [src/services/txline/txoracle.json](../../src/services/txline/txoracle.json).
3. Attempts a CPI into the TxLINE program and, when the CPI succeeds, performs an SPL token transfer between two token accounts.

## What is currently supported by code inspection

- The contract is decoupled from the frontend and lives under the dedicated Anchor workspace.
- The Merkle proof verification path is implemented locally.
- The SPL token transfer path uses Anchor SPL helpers.
- The TxLINE CPI path is explicitly marked as a runtime integration point rather than a fully verified on-chain call.

## Important limitations

The workspace does not include a working Rust/Anchor toolchain, so this contract has not been built or tested in this environment.

The TxLINE integration is intentionally conservative and does not pretend to be fully compatible with the live oracle without external validation. The following information is still missing and cannot be inferred from the local repository alone:

- the exact on-chain account layout expected by the real `validate_stat` instruction in the deployed TxLINE program;
- the exact instruction discriminator and account metadata for the deployed TxLINE program version;
- the real program ID used in production for the TxLINE oracle; and
- the actual SPL token mint / PDA / authority setup required by the deployment environment.

## Notes

- The frontend remains unchanged.
- The contract is isolated under the `programs/merkle_validator` directory so it stays decoupled from the app.
- Production integration should be completed only after the real TxLINE program is deployed and its CPI interface is validated against the exact on-chain account set.
