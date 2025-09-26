// Smart Contract Integration for Stylus (Arbitrum)
// This file demonstrates how to connect to Stylus smart contracts

import { ethers } from "ethers";

// Example ABI for a Freelance Escrow Contract
export const ESCROW_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "job_id", type: "uint256" }],
    name: "autoRelease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "freelancer", type: "address" },
      { internalType: "uint64", name: "duration", type: "uint64" },
    ],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "job_id", type: "uint256" }],
    name: "emergencyRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveJobs",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "job_id", type: "uint256" }],
    name: "getJob",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint64", name: "", type: "uint64" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "bool", name: "", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalJobs",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isPaused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "job_id", type: "uint256" }],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "job_id", type: "uint256" }],
    name: "release",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "state", type: "bool" }],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "new_admin", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Contract addresses (replace with your actual deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia (testnet)
  ESCROW_CONTRACT: "0x0ffaf51ae181a3d20715c4f59d71e3faf6d7a522",
  // Arbitrum One (mainnet)
  ESCROW_CONTRACT_MAINNET: "0x0987654321098765432109876543210987654321",
};

// Network configurations for Stylus (Arbitrum)
export const NETWORK_CONFIG = {
  arbitrumSepolia: {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    blockExplorer: "https://sepolia.arbiscan.io",
  },
  arbitrumOne: {
    chainId: 42161,
    name: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
  },
};

// Smart Contract Service Class
export class EscrowContractService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  // Initialize Web3 provider (MetaMask, WalletConnect, etc.)
  async initializeProvider() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        await this.provider.send("eth_requestAccounts", []);
        this.signer = await this.provider.getSigner();

        // Initialize contract instance
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESSES.ESCROW_CONTRACT,
          ESCROW_CONTRACT_ABI,
          this.signer
        );

        console.log("[v0] Smart contract initialized successfully");
      } catch (error) {
        console.error("[v0] Failed to initialize provider:", error);
      }
    }
  }

  // Deposit funds for a new job (matches ABI: deposit function)
  async deposit(freelancerAddress: string, duration: number, amount: string) {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized");
    }

    // Validate inputs
    if (!freelancerAddress || freelancerAddress.trim() === "") {
      throw new Error("Freelancer address is required");
    }

    if (!ethers.isAddress(freelancerAddress)) {
      throw new Error("Invalid freelancer address format");
    }

    if (duration <= 0) {
      throw new Error("Duration must be greater than 0");
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    try {
      const amountWei = ethers.parseEther(amount);

      console.log("[v0] Creating deposit for job...", {
        freelancer: freelancerAddress,
        duration,
        amount: amountWei.toString(),
      });

      const tx = await this.contract.deposit(freelancerAddress, duration, {
        value: amountWei,
      });

      const receipt = await tx.wait();
      console.log(
        "[v0] Deposit created successfully:",
        receipt.transactionHash
      );

      return {
        jobId: receipt.logs?.[0]?.topics?.[1], // Extract job ID from logs
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("[v0] Failed to create deposit:", error);
      throw error;
    }
  }

  // Release funds to freelancer (matches ABI: release function)
  async release(jobId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Releasing funds for job:", jobId);

      const tx = await this.contract.release(jobId);
      const receipt = await tx.wait();

      console.log("[v0] Funds released successfully:", receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to release funds:", error);
      throw error;
    }
  }

  // Auto-release funds (matches ABI: autoRelease function)
  async autoRelease(jobId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Auto-releasing funds for job:", jobId);

      const tx = await this.contract.autoRelease(jobId);
      const receipt = await tx.wait();

      console.log(
        "[v0] Funds auto-released successfully:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to auto-release funds:", error);
      throw error;
    }
  }

  // Refund to client (matches ABI: refund function)
  async refund(jobId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Processing refund for job:", jobId);

      const tx = await this.contract.refund(jobId);
      const receipt = await tx.wait();

      console.log(
        "[v0] Refund processed successfully:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to process refund:", error);
      throw error;
    }
  }

  // Emergency refund (matches ABI: emergencyRefund function)
  async emergencyRefund(jobId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Processing emergency refund for job:", jobId);

      const tx = await this.contract.emergencyRefund(jobId);
      const receipt = await tx.wait();

      console.log(
        "[v0] Emergency refund processed successfully:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to process emergency refund:", error);
      throw error;
    }
  }

  // Get job details (matches ABI: getJob function)
  async getJob(jobId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const jobData = await this.contract.getJob(jobId);

      return {
        jobId: jobData[0].toString(),
        client: jobData[1],
        freelancer: jobData[2],
        amount: ethers.formatEther(jobData[3]),
        duration: jobData[4].toString(),
        isCompleted: jobData[5],
        isRefunded: jobData[6],
      };
    } catch (error) {
      console.error("[v0] Failed to get job details:", error);
      throw error;
    }
  }

  // Get active jobs (matches ABI: getActiveJobs function)
  async getActiveJobs() {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const activeJobIds = await this.contract.getActiveJobs();
      return activeJobIds.map((id: any) => id.toString());
    } catch (error) {
      console.error("[v0] Failed to get active jobs:", error);
      throw error;
    }
  }

  // Get total jobs count (matches ABI: getTotalJobs function)
  async getTotalJobs() {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const totalJobs = await this.contract.getTotalJobs();
      return totalJobs.toString();
    } catch (error) {
      console.error("[v0] Failed to get total jobs:", error);
      throw error;
    }
  }

  // Check if contract is paused (matches ABI: isPaused function)
  async isPaused() {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const paused = await this.contract.isPaused();
      return paused;
    } catch (error) {
      console.error("[v0] Failed to check pause status:", error);
      throw error;
    }
  }

  // Set contract pause state (matches ABI: setPaused function) - Admin only
  async setPaused(state: boolean) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Setting contract pause state:", state);

      const tx = await this.contract.setPaused(state);
      const receipt = await tx.wait();

      console.log(
        "[v0] Contract pause state updated:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to set pause state:", error);
      throw error;
    }
  }

  // Transfer contract ownership (matches ABI: transferOwnership function) - Admin only
  async transferOwnership(newAdmin: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Transferring ownership to:", newAdmin);

      const tx = await this.contract.transferOwnership(newAdmin);
      const receipt = await tx.wait();

      console.log(
        "[v0] Ownership transferred successfully:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to transfer ownership:", error);
      throw error;
    }
  }

  // Initialize contract (matches ABI: initialize function) - Admin only
  async initialize() {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      console.log("[v0] Initializing contract...");

      const tx = await this.contract.initialize();
      const receipt = await tx.wait();

      console.log(
        "[v0] Contract initialized successfully:",
        receipt.transactionHash
      );
      return receipt;
    } catch (error) {
      console.error("[v0] Failed to initialize contract:", error);
      throw error;
    }
  }

  // Get multiple job details efficiently
  async getMultipleJobs(jobIds: string[]) {
    const jobs = [];
    for (const jobId of jobIds) {
      try {
        const job = await this.getJob(jobId);
        jobs.push(job);
      } catch (error) {
        console.error(`[v0] Failed to get job ${jobId}:`, error);
      }
    }
    return jobs;
  }

  // Get all jobs for a specific user (client or freelancer)
  async getUserJobs(userAddress: string) {
    try {
      const totalJobs = await this.getTotalJobs();
      const allJobs = [];

      for (let i = 1; i <= parseInt(totalJobs); i++) {
        try {
          const job = await this.getJob(i.toString());
          if (
            job.client.toLowerCase() === userAddress.toLowerCase() ||
            job.freelancer.toLowerCase() === userAddress.toLowerCase()
          ) {
            allJobs.push({ ...job, jobId: i.toString() });
          }
        } catch (error) {
          // Job might not exist or be accessible
          continue;
        }
      }

      return allJobs;
    } catch (error) {
      console.error("[v0] Failed to get user jobs:", error);
      throw error;
    }
  }

  // Listen to contract events
  setupEventListeners() {
    if (!this.contract) return;

    // Listen for EscrowCreated events
    this.contract.on(
      "EscrowCreated",
      (escrowId, client, freelancer, amount, event) => {
        console.log("[v0] New escrow created:", {
          escrowId: escrowId.toString(),
          client,
          freelancer,
          amount: ethers.formatEther(amount),
          transactionHash: event.transactionHash,
        });
      }
    );

    // Listen for FundsReleased events
    this.contract.on("FundsReleased", (escrowId, freelancer, amount, event) => {
      console.log("[v0] Funds released:", {
        escrowId: escrowId.toString(),
        freelancer,
        amount: ethers.formatEther(amount),
        transactionHash: event.transactionHash,
      });
    });
  }

  // Get current network
  async getCurrentNetwork() {
    if (!this.provider) return null;

    const network = await this.provider.getNetwork();
    return network;
  }

  // Switch to Arbitrum network
  async switchToArbitrum() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa4b1" }], // Arbitrum One
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xa4b1",
                chainName: "Arbitrum One",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://arb1.arbitrum.io/rpc"],
                blockExplorerUrls: ["https://arbiscan.io/"],
              },
            ],
          });
        } catch (addError) {
          console.error("[v0] Failed to add Arbitrum network:", addError);
        }
      }
    }
  }
}

// Export singleton instance
export const escrowService = new EscrowContractService();

// Utility functions for Web3 integration
export const web3Utils = {
  // Format address for display
  formatAddress: (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Format ETH amount
  formatEth: (amount: string) => {
    return `${Number.parseFloat(amount).toFixed(4)} ETH`;
  },

  // Get transaction URL
  getTransactionUrl: (
    txHash: string,
    network: "mainnet" | "sepolia" = "mainnet"
  ) => {
    const baseUrl =
      network === "mainnet"
        ? "https://arbiscan.io/tx/"
        : "https://sepolia.arbiscan.io/tx/";
    return `${baseUrl}${txHash}`;
  },

  // Validate Ethereum address
  isValidAddress: (address: string) => {
    return ethers.isAddress(address);
  },
};
