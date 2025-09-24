// Stylus Smart Contract for Freelance Escrow
// Updated for Stylus SDK 0.9.0

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageAddress, StorageU256, StorageString, StorageMap},
    block, call, evm, msg,
};
use alloy_sol_types::sol;

// Contract events
sol! {
    event EscrowCreated(uint256 indexed escrowId, address indexed client, address indexed freelancer, uint256 amount);
    event FundsDeposited(uint256 indexed escrowId, uint256 amount);
    event FundsReleased(uint256 indexed escrowId, address indexed freelancer, uint256 amount);
    event FundsRefunded(uint256 indexed escrowId, address indexed client, uint256 amount);
    event DisputeRaised(uint256 indexed escrowId, address indexed raiser);
}

// Error types (kept for ABI compatibility, though not used directly)
sol! {
    error ZeroAmount(string);
    error SameAddress(string);
    error InvalidDeadline(string);
    error EscrowNotFound(string);
    error Unauthorized(string);
    error InvalidState(string);
    error DeadlineNotPassed(string);
    error NoFeesToWithdraw(string);
    error TransferFailed(string);
}

// Escrow status enum
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum EscrowStatus {
    Created = 0,
    Funded = 1,
    Completed = 2,
    Disputed = 3,
    Refunded = 4,
}

// Escrow struct for storage
#[storage]
pub struct EscrowData {
    client: StorageAddress,
    freelancer: StorageAddress,
    amount: StorageU256,
    deadline: StorageU256,
    status: StorageU256,
    description: StorageString,
    created_at: StorageU256,
}

// Return struct for external calls (kept for ABI compatibility)
sol! {
    struct Escrow {
        address client;
        address freelancer;
        uint256 amount;
        uint256 deadline;
        uint8 status;
        string description;
        uint256 created_at;
    }
}

// Main contract storage
#[entrypoint]
#[storage]
pub struct FreelanceEscrow {
    owner: StorageAddress,
    escrow_counter: StorageU256,
    escrows: StorageMap<U256, EscrowData>,
    platform_fee: StorageU256,
    collected_fees: StorageU256,
}

#[public]
impl FreelanceEscrow {
    // Initialize the contract
    pub fn init(&mut self, platform_fee: U256) {
        self.owner.set(msg::sender());
        self.platform_fee.set(platform_fee);
        self.escrow_counter.set(U256::ZERO);
        self.collected_fees.set(U256::ZERO);
    }

    // Create a new escrow contract
    #[payable]
    pub fn create_escrow(
        &mut self,
        freelancer: Address,
        deadline: U256,
        description: String,
    ) -> U256 {
        let client = msg::sender();
        let amount = msg::value();
        
        // Validate inputs
        if amount == U256::ZERO {
            panic!("Amount cannot be zero");
        }
        
        if freelancer == client {
            panic!("Client and freelancer cannot be the same");
        }
        
        if deadline <= U256::from(block::timestamp()) {
            panic!("Invalid deadline");
        }

        // Increment escrow counter
        let escrow_id = self.escrow_counter.get() + U256::from(1);
        self.escrow_counter.set(escrow_id);

        // Create and store escrow
        let mut escrow_data = self.escrows.setter(escrow_id);
        escrow_data.client.set(client);
        escrow_data.freelancer.set(freelancer);
        escrow_data.amount.set(amount);
        escrow_data.deadline.set(deadline);
        escrow_data.status.set(U256::from(EscrowStatus::Funded as u8));
        escrow_data.description.set_str(&description);
        escrow_data.created_at.set(U256::from(block::timestamp()));

        // Emit event
        evm::log(EscrowCreated {
            escrowId: escrow_id,
            client,
            freelancer,
            amount,
        });

        escrow_id
    }

    // Release funds to freelancer (called by client)
    pub fn release_funds(&mut self, escrow_id: U256) {
        let caller = msg::sender();
        
        if !self.escrow_exists(escrow_id) {
            panic!("Escrow not found");
        }

        let escrow_getter = self.escrows.getter(escrow_id);

        // Validate caller is client
        if escrow_getter.client.get() != caller {
            panic!("Unauthorized");
        }

        // Validate escrow status
        let status = escrow_getter.status.get();
        if status != U256::from(EscrowStatus::Funded as u8) {
            panic!("Invalid escrow state");
        }

        let amount = escrow_getter.amount.get();
        let freelancer = escrow_getter.freelancer.get();

        // Calculate platform fee
        let fee = (amount * self.platform_fee.get()) / U256::from(10000);
        let freelancer_amount = amount - fee;

        // Update collected fees
        self.collected_fees.set(self.collected_fees.get() + fee);

        // Update escrow status
        self.escrows.setter(escrow_id).status.set(U256::from(EscrowStatus::Completed as u8));

        // Transfer funds to freelancer
        if call::transfer_eth(freelancer, freelancer_amount).is_err() {
            panic!("Transfer failed");
        }

        // Emit event
        evm::log(FundsReleased {
            escrowId: escrow_id,
            freelancer,
            amount: freelancer_amount,
        });
    }

    // Auto-release funds after deadline
    pub fn auto_release(&mut self, escrow_id: U256) {
        if !self.escrow_exists(escrow_id) {
            panic!("Escrow not found");
        }

        let escrow_getter = self.escrows.getter(escrow_id);

        // Validate escrow status
        let status = escrow_getter.status.get();
        if status != U256::from(EscrowStatus::Funded as u8) {
            panic!("Invalid escrow state");
        }

        // Check if deadline has passed
        let current_time = U256::from(block::timestamp());
        if current_time <= escrow_getter.deadline.get() {
            panic!("Deadline not passed");
        }

        let amount = escrow_getter.amount.get();
        let freelancer = escrow_getter.freelancer.get();

        // Calculate platform fee
        let fee = (amount * self.platform_fee.get()) / U256::from(10000);
        let freelancer_amount = amount - fee;

        // Update collected fees
        self.collected_fees.set(self.collected_fees.get() + fee);

        // Update escrow status
        self.escrows.setter(escrow_id).status.set(U256::from(EscrowStatus::Completed as u8));

        // Transfer funds to freelancer
        if call::transfer_eth(freelancer, freelancer_amount).is_err() {
            panic!("Transfer failed");
        }

        // Emit event
        evm::log(FundsReleased {
            escrowId: escrow_id,
            freelancer,
            amount: freelancer_amount,
        });
    }

    // Refund to client (in case of dispute resolution)
    pub fn refund_client(&mut self, escrow_id: U256) {
        let caller = msg::sender();
        
        // Only owner can refund
        if caller != self.owner.get() {
            panic!("Unauthorized");
        }

        if !self.escrow_exists(escrow_id) {
            panic!("Escrow not found");
        }

        let escrow_getter = self.escrows.getter(escrow_id);

        // Validate escrow status
        let status = escrow_getter.status.get();
        if status != U256::from(EscrowStatus::Disputed as u8) {
            panic!("Invalid escrow state");
        }

        let amount = escrow_getter.amount.get();
        let client = escrow_getter.client.get();

        // Update escrow status
        self.escrows.setter(escrow_id).status.set(U256::from(EscrowStatus::Refunded as u8));

        // Refund to client (minus a small processing fee)
        let processing_fee = amount / U256::from(100); // 1% processing fee
        let refund_amount = amount - processing_fee;
        
        self.collected_fees.set(self.collected_fees.get() + processing_fee);

        // Transfer refund to client
        if call::transfer_eth(client, refund_amount).is_err() {
            panic!("Transfer failed");
        }

        // Emit event
        evm::log(FundsRefunded {
            escrowId: escrow_id,
            client,
            amount: refund_amount,
        });
    }

    // Raise a dispute
    pub fn raise_dispute(&mut self, escrow_id: U256) {
        let caller = msg::sender();
        
        if !self.escrow_exists(escrow_id) {
            panic!("Escrow not found");
        }

        let escrow_getter = self.escrows.getter(escrow_id);
        let client = escrow_getter.client.get();
        let freelancer = escrow_getter.freelancer.get();

        // Validate caller is either client or freelancer
        if caller != client && caller != freelancer {
            panic!("Unauthorized");
        }

        // Validate escrow status
        let status = escrow_getter.status.get();
        if status != U256::from(EscrowStatus::Funded as u8) {
            panic!("Invalid escrow state");
        }

        // Update escrow status
        self.escrows.setter(escrow_id).status.set(U256::from(EscrowStatus::Disputed as u8));

        // Emit event
        evm::log(DisputeRaised {
            escrowId: escrow_id,
            raiser: caller,
        });
    }

    // Get escrow details
    pub fn get_escrow(&self, escrow_id: U256) -> (Address, Address, U256, U256, u8, String, U256) {
        if !self.escrow_exists(escrow_id) {
            panic!("Escrow not found");
        }

        let escrow_getter = self.escrows.getter(escrow_id);
        
        (
            escrow_getter.client.get(),
            escrow_getter.freelancer.get(),
            escrow_getter.amount.get(),
            escrow_getter.deadline.get(),
            u8::try_from(escrow_getter.status.get()).unwrap_or(0),
            escrow_getter.description.get_string(),
            escrow_getter.created_at.get(),
        )
    }

    // Get platform fee
    pub fn get_platform_fee(&self) -> U256 {
        self.platform_fee.get()
    }

    // Get collected fees (owner only)
    pub fn get_collected_fees(&self) -> U256 {
        if msg::sender() != self.owner.get() {
            panic!("Unauthorized");
        }
        self.collected_fees.get()
    }

    // Withdraw collected fees (owner only)
    pub fn withdraw_fees(&mut self) {
        if msg::sender() != self.owner.get() {
            panic!("Unauthorized");
        }

        let fees = self.collected_fees.get();
        if fees == U256::ZERO {
            panic!("No fees to withdraw");
        }

        self.collected_fees.set(U256::ZERO);

        // Transfer fees to owner
        if call::transfer_eth(self.owner.get(), fees).is_err() {
            panic!("Transfer failed");
        }
    }

    // Get contract owner
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }

    // Get total number of escrows
    pub fn get_total_escrows(&self) -> U256 {
        self.escrow_counter.get()
    }

    // Check if escrow exists
    fn escrow_exists(&self, escrow_id: U256) -> bool {
        escrow_id > U256::ZERO && escrow_id <= self.escrow_counter.get()
    }
}