use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use sha2::{Digest, Sha256};
use solana_program::instruction::AccountMeta;
use solana_program::program::invoke;

pub const TXLINE_PROGRAM_ID: Pubkey = pubkey!("6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J");

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ProofNode {
    pub hash: [u8; 32],
    pub is_right_sibling: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ScoresUpdateStats {
    pub update_count: i32,
    pub min_timestamp: i64,
    pub max_timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ScoresBatchSummary {
    pub fixture_id: i64,
    pub update_stats: ScoresUpdateStats,
    pub events_sub_tree_root: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ScoreStat {
    pub key: u32,
    pub value: i32,
    pub period: i32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct StatTerm {
    pub stat_to_prove: ScoreStat,
    pub event_stat_root: [u8; 32],
    pub stat_proof: Vec<ProofNode>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq)]
pub enum Comparison {
    GreaterThan,
    LessThan,
    EqualTo,
}

impl Default for Comparison {
    fn default() -> Self {
        Comparison::EqualTo
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct TraderPredicate {
    pub threshold: i32,
    pub comparison: Comparison,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq)]
pub enum BinaryExpression {
    Add,
    Subtract,
}

impl Default for BinaryExpression {
    fn default() -> Self {
        BinaryExpression::Add
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ValidateStatArgs {
    pub ts: i64,
    pub fixture_summary: ScoresBatchSummary,
    pub fixture_proof: Vec<ProofNode>,
    pub main_tree_proof: Vec<ProofNode>,
    pub predicate: TraderPredicate,
    pub stat_a: StatTerm,
    pub stat_b: Option<StatTerm>,
    pub op: Option<BinaryExpression>,
}

declare_id!("11111111111111111111111111111111111111111111111111");

#[error_code]
pub enum MerkleValidatorError {
    #[msg("The supplied Merkle proof does not match the expected root.")]
    InvalidMerkleProof,
    #[msg("The TxLINE validate_stat CPI failed.")]
    TxlineValidationFailed,
}

#[program]
pub mod merkle_validator {
    use super::*;

    pub fn validate_and_transfer(
        ctx: Context<ValidateAndTransfer>,
        leaf_hash: [u8; 32],
        merkle_proof: Vec<[u8; 32]>,
        expected_root: [u8; 32],
        ts: i64,
        amount: u64,
    ) -> Result<()> {
        let computed_root = compute_merkle_root(leaf_hash, &merkle_proof);
        require!(computed_root == expected_root, MerkleValidatorError::InvalidMerkleProof);

        let txline_validate_ix = solana_program::instruction::Instruction {
            program_id: ctx.accounts.txline_program.key(),
            accounts: vec![AccountMeta::new_readonly(
                ctx.accounts.daily_scores_merkle_roots.key(),
                false,
            )],
            data: build_validate_stat_data(ts, expected_root)?,
        };

        // The TxLINE instruction expects the account set for the CPI; the program id is already
        // embedded in the instruction object above, so only the actual account infos need to be passed.
        invoke(&txline_validate_ix, &[ctx.accounts.daily_scores_merkle_roots.to_account_info()])
            .map_err(|_| error!(MerkleValidatorError::TxlineValidationFailed))?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.to_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ValidateAndTransfer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: This is the deployed TxLINE oracle program. The instruction will attempt a CPI into it.
    #[account(mut)]
    pub txline_program: UncheckedAccount<'info>,

    /// CHECK: The account expected by TxLINE's validate_stat instruction.
    #[account(mut)]
    pub daily_scores_merkle_roots: UncheckedAccount<'info>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

fn compute_merkle_root(leaf_hash: [u8; 32], proof: &[[u8; 32]]) -> [u8; 32] {
    let mut current = leaf_hash;
    for sibling in proof {
        let mut hasher = Sha256::new();
        hasher.update(current);
        hasher.update(sibling);
        let digest = hasher.finalize();
        let bytes: [u8; 32] = digest.into();
        current = bytes;
    }
    current
}

fn build_validate_stat_data(ts: i64, expected_root: [u8; 32]) -> Result<Vec<u8>> {
    let payload = ValidateStatArgs {
        ts,
        fixture_summary: ScoresBatchSummary {
            fixture_id: 0,
            update_stats: ScoresUpdateStats::default(),
            events_sub_tree_root: expected_root,
        },
        fixture_proof: vec![],
        main_tree_proof: vec![],
        predicate: TraderPredicate::default(),
        stat_a: StatTerm::default(),
        stat_b: None,
        op: None,
    };

    let mut data = Vec::new();
    data.extend_from_slice(&[107, 197, 232, 90, 191, 136, 105, 185]);
    data.extend_from_slice(&payload.try_to_vec()?);
    Ok(data)
}
