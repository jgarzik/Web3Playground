/**
 * Wallet Hook
 * 
 * Provides wallet connection state and functions for the entire application.
 * Handles MetaMask and WalletConnect V2 integration with Hemi network.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connect: (walletType: 'metamask' | 'walletconnect') => Promise<void>;
  disconnect: () => Promise<void>;
  switchToHemi: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const HEMI_CHAIN_ID = 43111;
const HEMI_CHAIN_CONFIG = {
  chainId: '0xA867', // 43111 in hex
  chainName: 'Hemi Network',
  rpcUrls: ['https://rpc.hemi.network/rpc'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://explorer.hemi.network/']
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  /**
   * Initialize wallet connection on page load
   */
  useEffect(() => {
    checkExistingConnection();
    setupEventListeners();
  }, []);

  /**
   * Check if wallet is already connected
   */
  const checkExistingConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          await initializeWallet();
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    }
  };

  /**
   * Setup event listeners for wallet events
   */
  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  };

  /**
   * Handle account changes
   */
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      resetWalletState();
    } else {
      // User switched accounts
      await initializeWallet();
    }
  };

  /**
   * Handle chain changes
   */
  const handleChainChanged = async (chainId: string) => {
    const newChainId = parseInt(chainId, 16);
    setChainId(newChainId);
    
    if (isConnected) {
      await initializeWallet();
    }
  };

  /**
   * Handle wallet disconnect
   */
  const handleDisconnect = () => {
    resetWalletState();
  };

  /**
   * Reset wallet state
   */
  const resetWalletState = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
  };

  /**
   * Initialize wallet connection
   */
  const initializeWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('No wallet detected');
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await web3Provider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const network = await web3Provider.getNetwork();
      const walletSigner = web3Provider.getSigner();

      setProvider(web3Provider);
      setSigner(walletSigner);
      setAddress(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);

    } catch (error) {
      console.error('Error initializing wallet:', error);
      resetWalletState();
      throw error;
    }
  };

  /**
   * Connect wallet
   */
  const connect = async (walletType: 'metamask' | 'walletconnect') => {
    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed');
        }

        // Request account access
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        await initializeWallet();

        // Switch to Hemi network after connection
        try {
          await switchToHemi();
        } catch (switchError) {
          // Continue even if network switch fails
          console.warn('Failed to switch to Hemi network:', switchError);
        }

      } else if (walletType === 'walletconnect') {
        // WalletConnect V2 integration would go here
        // For now, throw an error indicating it's not implemented
        throw new Error('WalletConnect integration coming soon');
      }
    } catch (error) {
      resetWalletState();
      throw error;
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnect = async () => {
    resetWalletState();
  };

  /**
   * Switch to Hemi network
   */
  const switchToHemi = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No wallet detected');
    }

    try {
      // Try to switch to Hemi network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HEMI_CHAIN_CONFIG.chainId }]
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [HEMI_CHAIN_CONFIG]
          });
        } catch (addError) {
          throw new Error('Failed to add Hemi network to wallet');
        }
      } else {
        throw new Error('Failed to switch to Hemi network');
      }
    }
  };

  const contextValue: WalletContextType = {
    isConnected,
    address,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    switchToHemi
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
