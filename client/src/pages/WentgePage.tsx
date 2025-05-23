/**
 * WENTGE NFT Page Component
 * 
 * Handles viewing and minting of WENTGE NFTs. Features:
 * - Free minting (one per wallet)
 * - Display of owned NFTs
 * - Contract information display
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gem, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { useToast } from "@/hooks/use-toast";
import WalletConnection from "@/components/WalletConnection";
import LoadingModal from "@/components/LoadingModal";
import NFTCard from "@/components/NFTCard";
import { CONTRACTS } from "@/lib/contracts";

export default function WentgePage() {
  const { isConnected, address, chainId } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [canMint, setCanMint] = useState(false);
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);
  
  const {
    contract: wentgeContract,
    loading: contractLoading
  } = useContract(CONTRACTS.WENTGE.address, CONTRACTS.WENTGE.abi);

  /**
   * Check if user can mint WENTGE NFT
   * WENTGE allows one NFT per wallet
   */
  const checkMintEligibility = async () => {
    if (!wentgeContract || !address) return;

    try {
      setIsLoading(true);
      const balance = await wentgeContract.balanceOf(address);
      setCanMint(balance.toString() === "0");
      setHasCheckedEligibility(true);
    } catch (error) {
      console.error("Error checking mint eligibility:", error);
      toast({
        title: "Error",
        description: "Failed to check mint eligibility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load user's WENTGE NFTs
   */
  const loadUserNFTs = async () => {
    if (!wentgeContract || !address) return;

    try {
      setIsLoading(true);
      const balance = await wentgeContract.balanceOf(address);
      const nfts = [];

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await wentgeContract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await wentgeContract.tokenURI(tokenId);
        const imageURI = await wentgeContract.imageURI();
        
        nfts.push({
          tokenId: tokenId.toString(),
          tokenURI,
          imageURI,
          name: `wen TGE #${tokenId.toString()}`,
        });
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error("Error loading NFTs:", error);
      toast({
        title: "Error",
        description: "Failed to load your NFTs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mint WENTGE NFT
   */
  const handleMint = async () => {
    if (!wentgeContract || !isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint",
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

    if (!canMint) {
      toast({
        title: "Already Minted",
        description: "You can only mint one WENTGE NFT per wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      toast({
        title: "Transaction Initiated",
        description: "Please confirm the transaction in your wallet",
      });

      const tx = await wentgeContract.mint();
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for blockchain confirmation...",
      });

      await tx.wait();

      toast({
        title: "Success!",
        description: "WENTGE NFT minted successfully!",
      });

      // Refresh data
      await checkMintEligibility();
      await loadUserNFTs();

    } catch (error: any) {
      console.error("Mint error:", error);
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the transaction",
          variant: "destructive",
        });
      } else if (error.message?.includes("Only one NFT per address")) {
        toast({
          title: "Already Minted",
          description: "You can only mint one WENTGE NFT per wallet",
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

  // Load data when wallet connects or contract is ready
  useEffect(() => {
    if (isConnected && wentgeContract && !contractLoading) {
      checkMintEligibility();
      loadUserNFTs();
    }
  }, [isConnected, wentgeContract, contractLoading, address]);

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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Gem className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">WENTGE NFT</h1>
                  <p className="text-xs text-muted-foreground">Free mint - One per wallet</p>
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
                href={`https://testnet.explorer.hemi.network/address/${CONTRACTS.WENTGE.address}`}
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
                <p className="font-mono text-primary break-all">{CONTRACTS.WENTGE.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Network:</span>
                <p className="text-foreground">Hemi (43111)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mint Section */}
        <Card>
          <CardHeader>
            <CardTitle>Mint WENTGE NFT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Mint Status */}
            {isConnected && hasCheckedEligibility && (
              <div className={`p-4 rounded-lg border ${
                canMint 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    canMint ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {canMint ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      canMint ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {canMint ? 'Ready to Mint' : 'Already Minted'}
                    </p>
                    <p className={`text-sm ${
                      canMint ? 'text-green-300' : 'text-yellow-300'
                    }`}>
                      {canMint 
                        ? 'You can mint your free WENTGE NFT' 
                        : 'You have already minted your WENTGE NFT'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mint Button */}
            <Button 
              onClick={handleMint}
              disabled={!isConnected || isLoading || contractLoading || !canMint}
              className="w-full glow-button text-white py-6 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : !isConnected ? (
                'Connect Wallet to Mint'
              ) : contractLoading ? (
                'Loading Contract...'
              ) : !canMint && hasCheckedEligibility ? (
                'Already Minted'
              ) : (
                'Mint Free WENTGE NFT'
              )}
            </Button>

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
          </CardContent>
        </Card>

        {/* Your WENTGE NFTs */}
        <Card>
          <CardHeader>
            <CardTitle>Your WENTGE NFTs</CardTitle>
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
                    contractAddress={CONTRACTS.WENTGE.address}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Gem className="w-16 h-16 mx-auto mb-4 text-muted/50" />
                <p className="text-lg">No WENTGE NFTs found</p>
                <p className="text-sm">
                  {isConnected 
                    ? 'Mint your free NFT above' 
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
