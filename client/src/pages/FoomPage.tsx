/**
 * Foom NFT Page Component
 * 
 * Handles complex multi-step minting process for Foom NFTs including:
 * - Token balance checking (HAIR and MAX)
 * - Token approval flow
 * - NFT minting with token burn
 * - Display of owned NFTs
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Flame, ExternalLink, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import WalletConnection from "@/components/WalletConnection";
import LoadingModal from "@/components/LoadingModal";
import NFTCard from "@/components/NFTCard";
import { CONTRACTS, ERC20_ABI } from "@/lib/contracts";

interface TokenBalance {
  balance: string;
  allowance: string;
  hasBalance: boolean;
  hasAllowance: boolean;
}

interface MintStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  action?: () => Promise<void>;
}

export default function FoomPage() {
  const { isConnected, address, chainId, signer } = useWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [hairBalance, setHairBalance] = useState<TokenBalance>({
    balance: '0',
    allowance: '0',
    hasBalance: false,
    hasAllowance: false
  });
  const [maxBalance, setMaxBalance] = useState<TokenBalance>({
    balance: '0',
    allowance: '0',
    hasBalance: false,
    hasAllowance: false
  });
  const [mintSteps, setMintSteps] = useState<MintStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [requiredHair, setRequiredHair] = useState<string>('0');
  const [requiredMax, setRequiredMax] = useState<string>('0');

  // Contract hooks
  const { contract: foomContract, loading: foomLoading } = useContract(
    CONTRACTS.FOOM.address, 
    CONTRACTS.FOOM.abi
  );
  const { contract: hairContract } = useContract(CONTRACTS.HAIR.address, ERC20_ABI);
  const { contract: maxContract } = useContract(CONTRACTS.MAX.address, ERC20_ABI);

  /**
   * Initialize mint steps
   */
  const initializeMintSteps = () => {
    const steps: MintStep[] = [
      {
        id: 1,
        title: "Check Token Balances",
        description: "Verify you have sufficient HAIR and MAX tokens",
        status: 'pending'
      },
      {
        id: 2,
        title: "Approve HAIR Token",
        description: "Allow the contract to spend your HAIR tokens",
        status: 'pending',
        action: approveHair
      },
      {
        id: 3,
        title: "Approve MAX Token", 
        description: "Allow the contract to spend your MAX tokens",
        status: 'pending',
        action: approveMax
      },
      {
        id: 4,
        title: "Mint NFT",
        description: "Burn tokens and mint your Foom NFT",
        status: 'pending',
        action: executeMinnt
      }
    ];
    setMintSteps(steps);
  };

  /**
   * Load required token amounts from contract
   */
  const loadRequiredAmounts = async () => {
    if (!foomContract) return;

    try {
      const hairFee = await foomContract.HAIR_TKN_FEE();
      const maxFee = await foomContract.MAX_TKN_FEE();
      
      setRequiredHair(ethers.utils.formatEther(hairFee));
      setRequiredMax(ethers.utils.formatEther(maxFee));
    } catch (error) {
      console.error("Error loading required amounts:", error);
    }
  };

  /**
   * Check token balances and allowances
   */
  const checkTokenBalances = async () => {
    if (!hairContract || !maxContract || !address || !foomContract) return;

    try {
      setIsLoading(true);
      updateStepStatus(1, 'active');

      // Get required amounts
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

      updateStepStatus(1, 'complete');
      
      // Check if we need approvals
      if (!hairAllow.gte(hairFee)) {
        updateStepStatus(2, 'pending');
        setCurrentStep(1);
      } else if (!maxAllow.gte(maxFee)) {
        updateStepStatus(2, 'complete');
        updateStepStatus(3, 'pending');
        setCurrentStep(2);
      } else {
        updateStepStatus(2, 'complete');
        updateStepStatus(3, 'complete');
        updateStepStatus(4, 'pending');
        setCurrentStep(3);
      }

    } catch (error) {
      console.error("Error checking balances:", error);
      updateStepStatus(1, 'error');
      toast({
        title: "Error",
        description: "Failed to check token balances",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Approve HAIR token spending
   */
  const approveHair = async () => {
    if (!hairContract || !foomContract) return;

    try {
      setIsLoading(true);
      updateStepStatus(2, 'active');

      const hairFee = await foomContract.HAIR_TKN_FEE();
      
      toast({
        title: "Approval Required",
        description: "Please approve HAIR token spending in your wallet",
      });

      const tx = await hairContract.approve(CONTRACTS.FOOM.address, hairFee);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for approval confirmation...",
      });

      await tx.wait();

      updateStepStatus(2, 'complete');
      
      // Move to next step
      if (!maxBalance.hasAllowance) {
        updateStepStatus(3, 'pending');
        setCurrentStep(2);
      } else {
        updateStepStatus(3, 'complete');
        updateStepStatus(4, 'pending');
        setCurrentStep(3);
      }

      toast({
        title: "Success",
        description: "HAIR token approval confirmed",
      });

    } catch (error: any) {
      console.error("HAIR approval error:", error);
      updateStepStatus(2, 'error');
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the approval",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Approval Failed",
          description: error.message || "Failed to approve HAIR tokens",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Approve MAX token spending
   */
  const approveMax = async () => {
    if (!maxContract || !foomContract) return;

    try {
      setIsLoading(true);
      updateStepStatus(3, 'active');

      const maxFee = await foomContract.MAX_TKN_FEE();
      
      toast({
        title: "Approval Required",
        description: "Please approve MAX token spending in your wallet",
      });

      const tx = await maxContract.approve(CONTRACTS.FOOM.address, maxFee);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for approval confirmation...",
      });

      await tx.wait();

      updateStepStatus(3, 'complete');
      updateStepStatus(4, 'pending');
      setCurrentStep(3);

      toast({
        title: "Success",
        description: "MAX token approval confirmed",
      });

    } catch (error: any) {
      console.error("MAX approval error:", error);
      updateStepStatus(3, 'error');
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the approval",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Approval Failed",
          description: error.message || "Failed to approve MAX tokens",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Execute the final mint transaction
   */
  const executeMinnt = async () => {
    if (!foomContract) return;

    try {
      setIsLoading(true);
      updateStepStatus(4, 'active');

      toast({
        title: "Minting NFT",
        description: "Please confirm the mint transaction in your wallet",
      });

      const tx = await foomContract.mint();
      
      toast({
        title: "Transaction Submitted",
        description: "Burning tokens and minting NFT...",
      });

      await tx.wait();

      updateStepStatus(4, 'complete');

      toast({
        title: "Success!",
        description: "Foom NFT minted successfully!",
      });

      // Refresh data
      await loadUserNFTs();
      await checkTokenBalances();

    } catch (error: any) {
      console.error("Mint error:", error);
      updateStepStatus(4, 'error');
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the mint transaction",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Minting Failed",
          description: error.message || "Failed to mint NFT",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update step status
   */
  const updateStepStatus = (stepId: number, status: MintStep['status']) => {
    setMintSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  /**
   * Load user's Foom NFTs
   */
  const loadUserNFTs = async () => {
    if (!foomContract || !address) return;

    try {
      const balance = await foomContract.balanceOf(address);
      const nfts = [];

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await foomContract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await foomContract.tokenURI(tokenId);
        const imageURI = await foomContract.imageURI();
        
        nfts.push({
          tokenId: tokenId.toString(),
          tokenURI,
          imageURI,
          name: `Foom #${tokenId.toString()}`,
        });
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
  };

  /**
   * Start the minting process
   */
  const startMintProcess = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to start minting",
        variant: "destructive",
      });
      return;
    }

    if (chainId !== 43111) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Hemi Network (43111)",
        variant: "destructive",
      });
      return;
    }

    initializeMintSteps();
    await checkTokenBalances();
  };

  // Load data when wallet connects
  useEffect(() => {
    if (isConnected && foomContract && !foomLoading) {
      loadRequiredAmounts();
      loadUserNFTs();
    }
  }, [isConnected, foomContract, foomLoading, address]);

  // Initialize steps on mount
  useEffect(() => {
    initializeMintSteps();
  }, []);

  const canStartMinting = isConnected && chainId === 43111 && !isLoading;
  const hasStartedMinting = mintSteps.some(step => step.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-900">
      {/* Navigation Header */}
      <header className="bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-xl flex items-center justify-center">
                  <Flame className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Foom NFT</h1>
                  <p className="text-xs text-muted-foreground">Burn tokens to mint unique NFTs</p>
                </div>
              </div>
            </div>
            
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Contract Information</span>
              <a 
                href={`https://explorer.hemi.network/address/${CONTRACTS.FOOM.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Contract Address:</span>
                <p className="font-mono text-primary break-all">{CONTRACTS.FOOM.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Network:</span>
                <p className="text-foreground">Hemi (43111)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Balances */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* HAIR Token Balance */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">HAIR Token</h3>
                  <p className="text-sm text-muted-foreground">Required: {requiredHair} HAIR</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className={`font-semibold ${
                    hairBalance.hasBalance ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(hairBalance.balance).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Allowance:</span>
                  <span className={`font-semibold ${
                    hairBalance.hasAllowance ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {parseFloat(hairBalance.allowance).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MAX Token Balance */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">MAX Token</h3>
                  <p className="text-sm text-muted-foreground">Required: {requiredMax} MAX</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className={`font-semibold ${
                    maxBalance.hasBalance ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(maxBalance.balance).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Allowance:</span>
                  <span className={`font-semibold ${
                    maxBalance.hasAllowance ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {parseFloat(maxBalance.allowance).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mint Section */}
        <Card>
          <CardHeader>
            <CardTitle>Mint Foom NFT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Minting Steps */}
            {hasStartedMinting && (
              <div className="space-y-4">
                {mintSteps.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 border rounded-lg transition-all ${
                      step.status === 'active' ? 'border-primary bg-primary/5' :
                      step.status === 'complete' ? 'border-green-500 bg-green-500/5' :
                      step.status === 'error' ? 'border-red-500 bg-red-500/5' :
                      'border-border bg-card'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'complete' ? 'bg-green-500' :
                      step.status === 'active' ? 'bg-primary' :
                      step.status === 'error' ? 'bg-red-500' :
                      'bg-muted'
                    }`}>
                      {step.status === 'complete' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="step-status">
                      {step.status === 'pending' && currentStep === step.id - 1 && step.action && (
                        <Button 
                          onClick={step.action}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm font-medium"
                        >
                          {step.id === 2 ? 'Approve HAIR' : 
                           step.id === 3 ? 'Approve MAX' : 
                           'Mint NFT'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Start/Continue Button */}
            {!hasStartedMinting ? (
              <Button 
                onClick={startMintProcess}
                disabled={!canStartMinting}
                className="w-full glow-button text-white py-6 text-lg font-semibold"
              >
                {!isConnected ? 'Connect Wallet to Start' :
                 chainId !== 43111 ? 'Switch to Hemi Network' :
                 isLoading ? 'Loading...' :
                 'Start Minting Process'}
              </Button>
            ) : (
              <div className="text-center py-4">
                <Progress 
                  value={(mintSteps.filter(s => s.status === 'complete').length / mintSteps.length) * 100} 
                  className="w-full mb-4" 
                />
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {mintSteps.length}
                </p>
              </div>
            )}

            {/* Network Warning */}
            {isConnected && chainId !== 43111 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-400">Wrong Network</p>
                    <p className="text-sm text-red-300">Please switch to Hemi Network (43111) to continue.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {isConnected && (!hairBalance.hasBalance || !maxBalance.hasBalance) && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-400">Insufficient Token Balance</p>
                    <p className="text-sm text-yellow-300">
                      You need {requiredHair} HAIR and {requiredMax} MAX tokens to mint.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Foom NFTs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Foom NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            {userNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNFTs.map((nft) => (
                  <NFTCard
                    key={nft.tokenId}
                    tokenId={nft.tokenId}
                    name={nft.name}
                    imageURI={nft.imageURI}
                    tokenURI={nft.tokenURI}
                    contractAddress={CONTRACTS.FOOM.address}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Flame className="w-16 h-16 mx-auto mb-4 text-muted/50" />
                <p className="text-lg">No Foom NFTs found</p>
                <p className="text-sm">
                  {isConnected 
                    ? 'Burn HAIR and MAX tokens to mint your first Foom NFT' 
                    : 'Connect your wallet to view your NFTs'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Loading Modal */}
      {isLoading && (
        <LoadingModal 
          title="Processing Transaction"
          message="Please confirm the transaction in your wallet and wait for blockchain confirmation..."
        />
      )}
    </div>
  );
}
