/**
 * Wallet Connection Component
 * 
 * Handles wallet connection UI and functionality including:
 * - Connect/disconnect wallet
 * - Display connection status
 * - Network switching for Hemi chain
 * - MetaMask and WalletConnect V2 support
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Wallet, ChevronDown, ExternalLink, Copy, CheckCircle, AlertTriangle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnection() {
  const { 
    isConnected, 
    address, 
    chainId, 
    connect, 
    disconnect, 
    switchToHemi 
  } = useWallet();
  const { toast } = useToast();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Handle wallet connection
   */
  const handleConnect = async (walletType: 'metamask' | 'walletconnect') => {
    try {
      setIsConnecting(true);
      await connect(walletType);
      setShowConnectModal(false);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle wallet disconnection
   */
  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Failed", 
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  /**
   * Copy address to clipboard
   */
  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  /**
   * Switch to Hemi network
   */
  const handleSwitchNetwork = async () => {
    try {
      await switchToHemi();
      toast({
        title: "Network Switched",
        description: "Successfully switched to Hemi Network",
      });
    } catch (error: any) {
      console.error("Network switch error:", error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Failed to switch to Hemi Network",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isCorrectNetwork = chainId === 43111;

  if (!isConnected) {
    return (
      <>
        <Button 
          onClick={() => setShowConnectModal(true)}
          className="glow-button text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </Button>

        {/* Connection Modal */}
        <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose a wallet to connect to Jeff's Hacker Haven
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* MetaMask */}
              <Button
                onClick={() => handleConnect('metamask')}
                disabled={isConnecting}
                className="w-full flex items-center space-x-4 p-4 bg-card hover:bg-card/80 text-foreground border border-border rounded-xl transition-all"
                variant="outline"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🦊</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">MetaMask</div>
                  <div className="text-sm text-muted-foreground">Connect using browser extension</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>

              {/* WalletConnect */}
              <Button
                onClick={() => handleConnect('walletconnect')}
                disabled={isConnecting}
                className="w-full flex items-center space-x-4 p-4 bg-card hover:bg-card/80 text-foreground border border-border rounded-xl transition-all"
                variant="outline"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📱</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">WalletConnect</div>
                  <div className="text-sm text-muted-foreground">Scan with mobile wallet</div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Network Notice */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-400">Hemi Network Only</div>
                  <div className="text-yellow-300 mt-1">
                    This application works exclusively with Hemi chain (43111). 
                    Make sure to switch networks after connecting.
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Network Status */}
      {!isCorrectNetwork && (
        <Button
          onClick={handleSwitchNetwork}
          variant="outline"
          size="sm"
          className="px-3 py-1.5 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
        >
          <AlertTriangle className="w-3 h-3 mr-2" />
          Wrong Network
        </Button>
      )}

      {/* Connected Wallet */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-3 px-4 py-2.5 bg-card border-border hover:bg-card/80"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="font-mono text-sm">{formatAddress(address!)}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          {/* Address */}
          <div className="px-3 py-2">
            <div className="text-sm text-muted-foreground">Connected Address</div>
            <div className="font-mono text-sm text-foreground break-all">{address}</div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Network Status */}
          <div className="px-3 py-2">
            <div className="text-sm text-muted-foreground">Network</div>
            <div className="flex items-center space-x-2">
              <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
                {isCorrectNetwork ? "Hemi Network" : `Chain ${chainId}`}
              </Badge>
              {!isCorrectNetwork && (
                <Button
                  onClick={handleSwitchNetwork}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                >
                  Switch
                </Button>
              )}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Actions */}
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <a
              href={`https://explorer.hemi.network/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDisconnect}
            className="cursor-pointer text-red-400 focus:text-red-400"
          >
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
