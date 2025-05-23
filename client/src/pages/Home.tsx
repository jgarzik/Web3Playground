/**
 * Home Page Component
 * 
 * Main landing page featuring navigation cards for WENTGE and Foom NFT contracts.
 * Displays hero section, project cards, getting started guide, and network information.
 */

import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnection from "@/components/WalletConnection";
import { useWallet } from "@/hooks/useWallet";
import { Gem, Flame, Wallet, Palette, Star, Shield, Database, Coins } from "lucide-react";

export default function Home() {
  const { isConnected, chainId } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-900">
      {/* Navigation Header */}
      <header className="bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-sm"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Jeff's Hacker Haven</h1>
                <p className="text-xs text-muted-foreground">Web3 Development Playground</p>
              </div>
            </div>
            
            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              {isConnected && chainId === 43111 && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                  <span className="text-sm font-mono">Hemi Network</span>
                </div>
              )}
              
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Jeff's Hacker Haven</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A cutting-edge Web3 development playground for exploring smart contracts, minting NFTs, and experimenting with blockchain technologies across multiple networks.
          </p>
          
          {/* Network Indicator */}
          <div className="mt-8 inline-flex items-center space-x-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-2xl border border-border">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Connected to Hemi Network</span>
            <Badge variant="secondary" className="font-mono text-sm">43111</Badge>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* WENTGE Card */}
          <Link href="/wentge">
            <Card className="gradient-card group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Gem className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Free Mint</div>
                    <div className="text-lg font-bold text-green-400">1 per wallet</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  WENTGE NFT
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Commemorative NFT celebrating the Hemi blockchain ecosystem. Each wallet can mint one free WENTGE NFT with unique metadata stored entirely on-chain.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Contract</div>
                      <div className="font-mono text-xs text-primary">0x005E...F791</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-primary group-hover:text-white transition-colors">
                    <span className="font-medium">Explore</span>
                    <div className="group-hover:translate-x-1 transition-transform">→</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Foom Card */}
          <Link href="/foom">
            <Card className="gradient-card group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-secondary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Flame className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Token Burn</div>
                    <div className="text-lg font-bold text-yellow-400">HAIR + MAX</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                  Foom NFT
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Premium NFT requiring HAIR and MAX token burns. Features dynamic attributes including cosmic energy, mood states, and mineral compositions generated deterministically.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Cost</div>
                      <div className="font-mono text-xs text-secondary">3K HAIR + 100 MAX</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-secondary group-hover:text-white transition-colors">
                    <span className="font-medium">Explore</span>
                    <div className="group-hover:translate-x-1 transition-transform">→</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Getting Started Section */}
        <Card className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border-border mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-primary text-xl" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Connect Wallet</h4>
                <p className="text-muted-foreground">Connect your MetaMask or WalletConnect V2 compatible wallet to the Hemi network.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="text-secondary text-xl" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Choose NFT</h4>
                <p className="text-muted-foreground">Select either WENTGE for free minting or Foom for token-burn minting experience.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="text-green-400 text-xl" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Mint & Collect</h4>
                <p className="text-muted-foreground">Complete the minting process and view your NFTs in your connected wallet.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-primary text-xl" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Secure & Transparent</h4>
              <p className="text-muted-foreground">All contracts are open-source and deployed on the Hemi blockchain with full transparency and security audits.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <Database className="text-secondary text-xl" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Fully On-Chain</h4>
              <p className="text-muted-foreground">NFT metadata and images are stored entirely on-chain using base64 encoding for maximum decentralization.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mb-4">
                <Coins className="text-green-400 text-xl" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Royalty-Free</h4>
              <p className="text-muted-foreground">All NFTs in the playground are completely royalty-free, ensuring full ownership and transfer freedom.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/30 backdrop-blur-sm border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                </div>
              </div>
              <span className="text-muted-foreground">Built on Hemi Network</span>
            </div>
            <div className="text-center mt-6 pt-6 border-t border-border md:border-t-0 md:mt-0 md:pt-0">
              <p className="text-muted-foreground text-sm">© 2025 Garzik Group LLC</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
