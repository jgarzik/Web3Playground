/**
 * Web3 Utilities
 * 
 * Helper functions for Web3 interactions, formatting, and blockchain operations.
 */

import { ethers } from "ethers";

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: string | number, 
  decimals = 18, 
  displayDecimals = 2
): string {
  try {
    const formatted = ethers.utils.formatUnits(amount.toString(), decimals);
    const number = parseFloat(formatted);
    return number.toFixed(displayDecimals);
  } catch (error) {
    return '0.00';
  }
}

/**
 * Parse token amount from display format to wei
 */
export function parseTokenAmount(amount: string, decimals = 18): string {
  try {
    return ethers.utils.parseUnits(amount, decimals).toString();
  } catch (error) {
    return '0';
  }
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    return false;
  }
}

/**
 * Get transaction explorer URL
 */
export function getTransactionUrl(txHash: string): string {
  return `https://testnet.explorer.hemi.network/tx/${txHash}`;
}

/**
 * Get address explorer URL
 */
export function getAddressUrl(address: string): string {
  return `https://testnet.explorer.hemi.network/address/${address}`;
}

/**
 * Get token explorer URL
 */
export function getTokenUrl(contractAddress: string, tokenId?: string): string {
  const baseUrl = `https://testnet.explorer.hemi.network/token/${contractAddress}`;
  return tokenId ? `${baseUrl}?a=${tokenId}` : baseUrl;
}

/**
 * Convert chain ID to hex format
 */
export function chainIdToHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

/**
 * Parse error messages from contract calls
 */
export function parseContractError(error: any): string {
  if (error.code === 4001) {
    return 'Transaction was cancelled by user';
  }
  
  if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  }
  
  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message?.includes('gas required exceeds allowance')) {
    return 'Transaction requires more gas than allowed';
  }
  
  if (error.message?.includes('nonce too low')) {
    return 'Transaction nonce too low';
  }
  
  if (error.reason) {
    return error.reason;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Unknown error occurred';
}

/**
 * Wait for transaction confirmation with timeout
 */
export async function waitForTransaction(
  provider: ethers.providers.Provider,
  txHash: string,
  confirmations = 1,
  timeout = 300000 // 5 minutes
): Promise<ethers.providers.TransactionReceipt> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Transaction confirmation timeout'));
    }, timeout);

    provider.waitForTransaction(txHash, confirmations)
      .then(receipt => {
        clearTimeout(timeoutId);
        resolve(receipt);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Estimate gas for contract transaction
 */
export async function estimateGas(
  contract: ethers.Contract,
  method: string,
  args: any[] = []
): Promise<ethers.BigNumber> {
  try {
    return await contract.estimateGas[method](...args);
  } catch (error) {
    // Return a default gas limit if estimation fails
    return ethers.BigNumber.from('200000');
  }
}
