/**
 * Contract Hook
 * 
 * Provides contract instance creation and management for smart contract interactions.
 * Handles contract loading, error states, and signer management.
 */

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";

interface UseContractReturn {
  contract: ethers.Contract | null;
  loading: boolean;
  error: string | null;
}

export function useContract(
  address: string, 
  abi: any[]
): UseContractReturn {
  const { signer, provider, isConnected } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createContract = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!address || !abi) {
          throw new Error('Contract address and ABI are required');
        }

        if (!provider) {
          throw new Error('No provider available');
        }

        // Create contract instance with signer if available, otherwise use provider for read-only
        const contractInstance = new ethers.Contract(
          address,
          abi,
          signer || provider
        );

        setContract(contractInstance);
      } catch (err: any) {
        console.error('Error creating contract:', err);
        setError(err.message || 'Failed to create contract instance');
        setContract(null);
      } finally {
        setLoading(false);
      }
    };

    createContract();
  }, [address, abi, signer, provider, isConnected]);

  return {
    contract,
    loading,
    error
  };
}
