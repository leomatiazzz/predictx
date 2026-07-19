# Merkle Validator Program Operation Guide

This guide outlines the minimum workflow to get the contract located at [programs/merkle_validator/src/lib.rs](programs/merkle_validator/src/lib.rs) up and running. The program implements three main steps:

1. validating a Merkle proof locally;
2. attempting a CPI to the TxLINE `validate_stat` instruction using the reference in [src/services/txline/txoracle.json](src/services/txline/txoracle.json);
3. executing an SPL Token transfer after validation.

> Important note: The current contract still relies on actual network values ​​and an account layout compatible with the deployed version of TxLINE. The guide below covers the complete workflow, but the final "actual CPI validation" step only works when the real TxLINE program is available and the correct accounts are present on the network.

---

## 0. Files involved

- [programs/merkle_validator/src/lib.rs](programs/merkle_validator/src/lib.rs): Anchor program implementation.
- [programs/merkle_validator/Cargo.toml](programs/merkle_validator/Cargo.toml): Rust and Anchor dependencies.
- [Anchor.toml](Anchor.toml): Anchor workspace configuration.
- [src/services/txline/txoracle.json](src/services/txline/txoracle.json): Official TxLINE IDL snapshot, used as a reference for the discriminator and the signature of the `validate_stat` instruction.

---

## 1. Installing Rust, Cargo, and Anchor

### Commands

Windows PowerShell:

```powershell
winget install Rustlang.Rustup
rustup default stable
rustc --version
cargo --version
```

On Linux/macOS or VS Code bash:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs |
``` sh
source "$HOME/.cargo/env"
rustup default stable
rustc --version
cargo --version
```

Install the Anchor CLI (use a version compatible with [programs/merkle_validator/Cargo.toml](programs/merkle_validator/Cargo.toml), e.g., 0.31.x):

```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.0 anchor-cli --locked
anchor --version
```

If you prefer managing versions with AVM:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.31.0
avm use 0.31.0
anchor --version
```

### Files involved

- [programs/merkle_validator/Cargo.toml](programs/merkle_validator/Cargo.toml)
- [Anchor.toml](Anchor.toml)

### Expected result

- `cargo --version` prints the Cargo version.
- `rustc --version` prints the Rust compiler version.
- `anchor --version` prints the Anchor CLI version.

### Common errors and how to resolve them

- `cargo: command not found`
- Close and reopen the terminal or add `~/.cargo/bin` to your `PATH`.
- `rustup: command not found`
- Reinstall Rustup and check if the `PATH` has been updated.
- `anchor: command not found`
- Reinstall the Anchor CLI using `cargo install ...` and verify the `PATH`.
- `failed to select a version` during build
- Use an Anchor CLI version compatible with `anchor-lang = 0.31.0` in [programs/merkle_validator/Cargo.toml](programs/merkle_validator/Cargo.toml). ---

## 2. Set up the Solana environment

### Commands

Install the Solana CLI:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version
```

Configure the cluster and create a local wallet:

```bash
solana config set --url localhost
solana-keygen new --outfile ~/.config/solana/id.json --force
solana address
```

If using devnet:

```bash
solana config set --url devnet
solana airdrop 2
```

If using localnet, start the validator in another terminal:

```bash
solana-test-validator --reset
```

### Files involved

- [Anchor.toml](Anchor.toml): the provider points to `~/.config/solana/id.json`.
- [programs/merkle_validator/src/lib.rs](programs/merkle_validator/src/lib.rs): the program authority depends on the current signer and the accounts passed in the context.

### Expected result

- `solana config get` shows the configured cluster.
- `solana address` prints the active keypair.
- The local validator responds on port 8899 when using `localhost`.

### Common errors and how to resolve them

- `Unable to connect to RPC` or `failed to get latest blockhash`
- The validator is not running. Start `solana-test-validator` or switch the cluster to `devnet`/`mainnet`.
- `No such file or directory ~/.config/solana/id.json`
- Generate the wallet using `solana-keygen new`.
- `Insufficient funds`
- Run `solana airdrop 2` on `devnet` or use a local cluster with funds.

---

## 3. Generate or configure the Program ID

The current contract contains a placeholder in [programs/merkle_validator/src/lib.rs](programs/merkle_validator/src/lib.rs):

```rust
declare_id!("11111111111111111111111111111111111111111111111111");
```

This value needs to be replaced with the actual Program ID before deployment.

### Commands

Generate a new keypair for the program:

```bash
mkdir -p target/deploy
solana-keygen new --outfile target/deploy/merkle_
```