// Smart Contract Integration for Stylus (Arbitrum)
// This file demonstrates how to connect to Stylus smart contracts

import { ethers } from "ethers"

// Example ABI for a Freelance Escrow Contract
export const ESCROW_CONTRACT_ABI = [
  // Contract creation and management
  {
    inputs: [
      { name: "_client", type: "address" },
      { name: "_freelancer", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_deadline", type: "uint256" },
      { name: "_description", type: "string" },
    ],
    name: "createEscrow",
    outputs: [{ name: "escrowId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },

  // Deposit funds
  {
    inputs: [{ name: "_escrowId", type: "uint256" }],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

  // Release funds to freelancer
  {
    inputs: [{ name: "_escrowId", type: "uint256" }],
    name: "releaseFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Refund to client
  {
    inputs: [{ name: "_escrowId", type: "uint256" }],
    name: "refundClient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Auto-release after deadline
  {
    inputs: [{ name: "_escrowId", type: "uint256" }],
    name: "autoRelease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Get escrow details
  {
    inputs: [{ name: "_escrowId", type: "uint256" }],
    name: "getEscrow",
    outputs: [
      { name: "client", type: "address" },
      { name: "freelancer", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "escrowId", type: "uint256" },
      { indexed: true, name: "client", type: "address" },
      { indexed: true, name: "freelancer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "EscrowCreated",
    type: "event",
  },

  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "escrowId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "FundsDeposited",
    type: "event",
  },

  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "escrowId", type: "uint256" },
      { indexed: true, name: "freelancer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "FundsReleased",
    type: "event",
  },
] as const

// Contract addresses (replace with your actual deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia (testnet)
  ESCROW_CONTRACT: "0x1234567890123456789012345678901234567890",
  // Arbitrum One (mainnet)
  ESCROW_CONTRACT_MAINNET: "0x0987654321098765432109876543210987654321",
}

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
}

// Smart Contract Service Class
export class EscrowContractService {
  private provider: ethers.providers.Web3Provider | null = null
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  constructor() {
    this.initializeProvider()
  }

  // Initialize Web3 provider (MetaMask, WalletConnect, etc.)
  async initializeProvider() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        await this.provider.send("eth_requestAccounts", [])
        this.signer = this.provider.getSigner()

        // Initialize contract instance
        this.contract = new ethers.Contract(CONTRACT_ADDRESSES.ESCROW_CONTRACT, ESCROW_CONTRACT_ABI, this.signer)

        console.log("[v0] Smart contract initialized successfully")
      } catch (error) {
        console.error("[v0] Failed to initialize provider:", error)
      }
    }
  }

  // Create a new escrow contract
  async createEscrow(freelancerAddress: string, amount: string, deadline: number, description: string) {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized")
    }

    try {
      const clientAddress = await this.signer.getAddress()
      const amountWei = ethers.utils.parseEther(amount)

      console.log("[v0] Creating escrow contract...", {
        client: clientAddress,
        freelancer: freelancerAddress,
        amount: amountWei.toString(),
        deadline,
        description,
      })

      const tx = await this.contract.createEscrow(
        clientAddress,
        freelancerAddress,
        amountWei,
        deadline,
        description,
        { value: amountWei }, // Send ETH with the transaction
      )

      const receipt = await tx.wait()
      console.log("[v0] Escrow created successfully:", receipt.transactionHash)

      // Extract escrow ID from events
      const escrowCreatedEvent = receipt.events?.find((event: any) => event.event === "EscrowCreated")

      return {
        escrowId: escrowCreatedEvent?.args?.escrowId?.toString(),
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      }
    } catch (error) {
      console.error("[v0] Failed to create escrow:", error)
      throw error
    }
  }

  // Release funds to freelancer
  async releaseFunds(escrowId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      console.log("[v0] Releasing funds for escrow:", escrowId)

      const tx = await this.contract.releaseFunds(escrowId)
      const receipt = await tx.wait()

      console.log("[v0] Funds released successfully:", receipt.transactionHash)
      return receipt
    } catch (error) {
      console.error("[v0] Failed to release funds:", error)
      throw error
    }
  }

  // Get escrow details
  async getEscrowDetails(escrowId: string) {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const escrowData = await this.contract.getEscrow(escrowId)

      return {
        client: escrowData.client,
        freelancer: escrowData.freelancer,
        amount: ethers.utils.formatEther(escrowData.amount),
        deadline: new Date(escrowData.deadline.toNumber() * 1000),
        status: escrowData.status,
        description: escrowData.description,
      }
    } catch (error) {
      console.error("[v0] Failed to get escrow details:", error)
      throw error
    }
  }

  // Listen to contract events
  setupEventListeners() {
    if (!this.contract) return

    // Listen for EscrowCreated events
    this.contract.on("EscrowCreated", (escrowId, client, freelancer, amount, event) => {
      console.log("[v0] New escrow created:", {
        escrowId: escrowId.toString(),
        client,
        freelancer,
        amount: ethers.utils.formatEther(amount),
        transactionHash: event.transactionHash,
      })
    })

    // Listen for FundsReleased events
    this.contract.on("FundsReleased", (escrowId, freelancer, amount, event) => {
      console.log("[v0] Funds released:", {
        escrowId: escrowId.toString(),
        freelancer,
        amount: ethers.utils.formatEther(amount),
        transactionHash: event.transactionHash,
      })
    })
  }

  // Get current network
  async getCurrentNetwork() {
    if (!this.provider) return null

    const network = await this.provider.getNetwork()
    return network
  }

  // Switch to Arbitrum network
  async switchToArbitrum() {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa4b1" }], // Arbitrum One
      })
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
          })
        } catch (addError) {
          console.error("[v0] Failed to add Arbitrum network:", addError)
        }
      }
    }
  }
}

// Export singleton instance
export const escrowService = new EscrowContractService()

// Utility functions for Web3 integration
export const web3Utils = {
  // Format address for display
  formatAddress: (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  // Format ETH amount
  formatEth: (amount: string) => {
    return `${Number.parseFloat(amount).toFixed(4)} ETH`
  },

  // Get transaction URL
  getTransactionUrl: (txHash: string, network: "mainnet" | "sepolia" = "mainnet") => {
    const baseUrl = network === "mainnet" ? "https://arbiscan.io/tx/" : "https://sepolia.arbiscan.io/tx/"
    return `${baseUrl}${txHash}`
  },

  // Validate Ethereum address
  isValidAddress: (address: string) => {
    return ethers.utils.isAddress(address)
  },
}
