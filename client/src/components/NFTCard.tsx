/**
 * NFT Card Component
 * 
 * Renders individual NFT cards with comprehensive metadata display.
 * Features include:
 * - Base64 encoded image rendering from on-chain data
 * - JSON metadata parsing from tokenURI (base64 or HTTP)
 * - Dynamic attribute display with proper formatting
 * - Collapsible attribute sections for better UX
 * - Direct links to Hemi blockchain explorer
 * - Error handling for missing images or metadata
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, EyeOff } from "lucide-react";

interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
}

interface NFTCardProps {
  tokenId: string;
  name: string;
  imageURI: string;
  tokenURI: string;
  contractAddress: string;
}

export default function NFTCard({
  tokenId,
  name,
  imageURI,
  tokenURI,
  contractAddress
}: NFTCardProps) {
  const [metadata, setMetadata] = useState<any>(null);
  const [attributes, setAttributes] = useState<NFTAttribute[]>([]);
  const [showAttributes, setShowAttributes] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Parse NFT metadata from tokenURI
   */
  useEffect(() => {
    const parseMetadata = async () => {
      try {
        if (tokenURI.startsWith('data:application/json;base64,')) {
          // Decode base64 JSON metadata
          const base64Data = tokenURI.replace('data:application/json;base64,', '');
          const jsonData = atob(base64Data);
          const parsed = JSON.parse(jsonData);
          
          setMetadata(parsed);
          if (parsed.attributes && Array.isArray(parsed.attributes)) {
            setAttributes(parsed.attributes);
          }
        } else if (tokenURI.startsWith('http')) {
          // Fetch from HTTP URL
          const response = await fetch(tokenURI);
          const parsed = await response.json();
          
          setMetadata(parsed);
          if (parsed.attributes && Array.isArray(parsed.attributes)) {
            setAttributes(parsed.attributes);
          }
        }
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    };

    if (tokenURI) {
      parseMetadata();
    }
  }, [tokenURI]);

  /**
   * Format attribute value for display
   */
  const formatAttributeValue = (attr: NFTAttribute) => {
    if (attr.display_type === 'number' && typeof attr.value === 'number') {
      return `${attr.value}${attr.max_value ? `/${attr.max_value}` : ''}`;
    }
    return attr.value.toString();
  };

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-0">
        {/* NFT Image */}
        <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-secondary/10">
          {!imageError ? (
            <img
              src={imageURI}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🖼️</span>
                </div>
                <p className="text-sm text-muted-foreground">Image not available</p>
              </div>
            </div>
          )}
        </div>

        {/* NFT Info */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Token ID:</span>
              <Badge variant="secondary" className="font-mono">#{tokenId}</Badge>
            </div>
          </div>

          {/* Description */}
          {metadata?.description && (
            <p className="text-sm text-muted-foreground">
              {metadata.description}
            </p>
          )}

          {/* Attributes Toggle */}
          {attributes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAttributes(!showAttributes)}
              className="w-full"
            >
              {showAttributes ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Attributes
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  View Attributes ({attributes.length})
                </>
              )}
            </Button>
          )}

          {/* Attributes */}
          {showAttributes && attributes.length > 0 && (
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
              {attributes.map((attr, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{attr.trait_type}:</span>
                  <span className="font-medium text-foreground">
                    {formatAttributeValue(attr)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* External Links */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a
                href={`https://explorer.hemi.xyz/token/${contractAddress}/instance/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Explorer
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
