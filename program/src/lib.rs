use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

/// Minimal QAIN on-chain entrypoint.
///
/// Instruction payloads are intentionally versioned at the application layer.
/// This first deployable program proves an on-chain QAIN program exists and
/// provides a stable target for future stateful instructions.
pub fn process_instruction(
    program_id: &Pubkey,
    _accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("QAIN Solana program invoked");
    msg!("Program ID: {}", program_id);
    msg!("Instruction bytes: {}", instruction_data.len());
    Ok(())
}
