/**
 * Token Balances Hook
 * 
 * Reusable hook for querying ERC20 token balances and allowances.
 * Handles HAIR and MAX token balance checking for Foom NFT minting.
 */

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import { useContract } from "./useContract";
import { CONTRACTS, ERC20_ABI } from "@/lib/contracts";

interface TokenBalance {
  balance: string;
  allowance: string;
  hasBalance: boolean;
  hasAllowance: boolean;
}

interface UseTokenBalancesReturn {
  hairBalance: TokenBalance;
  maxBalance: TokenBalance;
  checkBalances: () => Promise<void>;
  loading: boolean;
}

export function useTokenBalances(requiredHair: string, requiredMax: string): UseTokenBalancesReturn {
  const { address } = useWallet();
  
  const { contract: hairContract } = useContract(CONTRACTS.HAIR.address, ERC20_ABI);
  const { contract: maxContract } = useContract(CONTRACTS.MAX.address, ERC20_ABI);
  const { contract: foomContract } = useContract(CONTRACTS.FOOM.address, CONTRACTS.FOOM.abi);
  
  const [loading, setLoading] = useState(false);
  const [hairBalance, setHairBalance] = useState<TokenBalance>({
    balance: "0",
    allowance: "0",
    hasBalance: false,
    hasAllowance: false
  });
  const [maxBalance, setMaxBalance] = useState<TokenBalance>({
    balance: "0",
    allowance: "0",
    hasBalance: false,
    hasAllowance: false
  });

  const checkBalances = useCallback(async () => {
    if (!hairContract || !maxContract || !foomContract || !address) return;

    try {
      setLoading(true);

      // Get required amounts from contract
      const hairFee = await foomContract.HAIR_TKN_FEE();
      const maxFee = await foomContract.MAX_TKN_FEE();

      // Check HAIR balance and allowance
      const hairBal = await hairContract.balanceOf(address);
      const hairAllow = await hairContract.allowance(address, CONTRACTS.FOOM.address);
      
      setHairBalance({
        balance: ethers.utils.formatEther(hairBal),
        allowance: ethers.utils.formatEther(hairAllow),
        hasBalance: hairBal.gte(hairFee),
        hasAllowance: hairAllow.gte(hairFee)
      });

      // Check MAX balance and allowance
      const maxBal = await maxContract.balanceOf(address);
      const maxAllow = await maxContract.allowance(address, CONTRACTS.FOOM.address);
      
      setMaxBalance({
        balance: ethers.utils.formatEther(maxBal),
        allowance: ethers.utils.formatEther(maxAllow),
        hasBalance: maxBal.gte(maxFee),
        hasAllowance: maxAllow.gte(maxFee)
      });

    } catch (error) {
      console.error("Error checking token balances:", error);
    } finally {
      setLoading(false);
    }
  }, [hairContract, maxContract, foomContract, address]);

  return {
    hairBalance,
    maxBalance,
    checkBalances,
    loading
  };
}