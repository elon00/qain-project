use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

const AGENT_SEED: &[u8] = b"agent";

/// QAIN on-chain program.
///
/// Instruction 0: health/proof invocation.
/// Instruction 1: verify that account[0] is the canonical agent PDA derived from
///                ["agent", authority], where account[1] is the authority.
///
/// The PDA instruction gives QAIN deterministic, program-owned addressing without
/// pretending that an off-chain database entry is on-chain state.
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let tag = instruction_data.first().copied().unwrap_or(0);

    match tag {
        0 => {
            msg!("QAIN Solana program invoked");
            msg!("Program ID: {}", program_id);
            msg!("Instruction bytes: {}", instruction_data.len());
            Ok(())
        }
        1 => verify_agent_pda(program_id, accounts),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

fn verify_agent_pda(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let [agent_pda, authority, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    let (expected, bump) =
        Pubkey::find_program_address(&[AGENT_SEED, authority.key.as_ref()], program_id);

    if expected != *agent_pda.key {
        msg!("Invalid QAIN agent PDA");
        return Err(ProgramError::InvalidSeeds);
    }

    msg!("Verified QAIN agent PDA with bump {}", bump);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn agent_pda_is_deterministic() {
        let program_id = Pubkey::new_unique();
        let authority = Pubkey::new_unique();
        let (a, bump_a) =
            Pubkey::find_program_address(&[AGENT_SEED, authority.as_ref()], &program_id);
        let (b, bump_b) =
            Pubkey::find_program_address(&[AGENT_SEED, authority.as_ref()], &program_id);
        assert_eq!(a, b);
        assert_eq!(bump_a, bump_b);
    }
}
