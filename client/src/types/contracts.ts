/**
 * Contract Type Definitions
 * 
 * TypeScript interfaces and types for smart contract interactions,
 * NFT metadata, and blockchain data structures.
 */

import { ethers } from "ethers";

// Basic contract types
export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// NFT-related types
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: NFTAttribute[];
  external_url?: string;
  background_color?: string;
  animation_url?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  max_value?: number;
  decimals?: number;
  unit?: string;
}

export interface NFTToken {
  tokenId: string;
  name: string;
  description?: string;
  image: string;
  imageURI: string;
  tokenURI: string;
  metadata?: NFTMetadata;
  attributes?: NFTAttribute[];
  contractAddress: string;
}

// Token-related types
export interface TokenBalance {
  balance: ethers.BigNumber;
  balanceFormatted: string;
  decimals: number;
  symbol: string;
  name: string;
}

export interface TokenAllowance {
  allowance: ethers.BigNumber;
  allowanceFormatted: string;
  spender: string;
  owner: string;
}

// Transaction types
export interface TransactionRequest {
  to: string;
  value?: ethers.BigNumber;
  data?: string;
  gasLimit?: ethers.BigNumber;
  gasPrice?: ethers.BigNumber;
  nonce?: number;
}

export interface TransactionResponse {
  hash: string;
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;
  confirmations: number;
  from: string;
  to?: string;
  value: ethers.BigNumber;
  gasUsed?: ethers.BigNumber;
  gasPrice?: ethers.BigNumber;
  status?: number;
}

// Contract-specific types
export interface WENTGEContractData {
  totalSupply: ethers.BigNumber;
  mintingEnabled: boolean;
  userBalance: ethers.BigNumber;
  userTokens: NFTToken[];
}

export interface FoomContractData {
  totalSupply: ethers.BigNumber;
  hairFee: ethers.BigNumber;
  maxFee: ethers.BigNumber;
  userBalance: ethers.BigNumber;
  userTokens: NFTToken[];
  userHairBalance: TokenBalance;
  userMaxBalance: TokenBalance;
  hairAllowance: TokenAllowance;
  maxAllowance: TokenAllowance;
}

// Wallet types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: ethers.BigNumber | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

export interface WalletError {
  code: number;
  message: string;
  data?: any;
}

// Event types
export interface ContractEvent {
  event: string;
  args: any[];
  address: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
}

export interface MintEvent extends ContractEvent {
  event: 'Minted';
  args: [string, ethers.BigNumber] & {
    to: string;
    tokenId: ethers.BigNumber;
  };
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

// Form types
export interface MintFormData {
  quantity?: number;
  recipient?: string;
}

export interface ApprovalFormData {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
}
