/**
 * Contract Definitions
 * 
 * Contains contract addresses, ABIs, and network configuration for smart contracts
 * deployed on Hemi mainnet (Chain ID 43111). Includes WENTGE NFT, Foom NFT,
 * and ERC20 token contracts (HAIR, MAX).
 */

// Contract addresses and ABIs on Hemi mainnet (Chain ID 43111)
export const CONTRACTS = {
  WENTGE: {
    address: "0x005E2c2a327cEBE03409221cb37Abf4911AFF791",
    abi: [
      // WENTGE NFT contract ABI - free mint (one per wallet)
      "function mint() external",
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function imageURI() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function tokensOfOwner(address owner) view returns (uint256[])",
      "function mintingEnabled() view returns (bool)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "event Minted(address indexed to, uint256 tokenId)"
    ]
  },
  FOOM: {
    address: "0xc519C8bf8952325340e29415FfFa3F675e14bcD3",
    abi: [
      // Foom NFT contract ABI - requires burning HAIR + MAX tokens
      "function mint() external",
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function imageURI() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function tokensOfOwner(address owner) view returns (uint256[])",
      "function HAIR_TKN_FEE() view returns (uint256)",
      "function MAX_TKN_FEE() view returns (uint256)",
      "function supportsInterface(bytes4 interfaceId) view returns (bool)",
      "event Minted(address indexed to, uint256 tokenId)"
    ]
  },
  // ERC20 token contracts required for Foom NFT minting
  HAIR: {
    address: "0x5B774f563C902FA7b203FB7029ed6eD4Ce274705"  // HAIR token (3,000 required)
  },
  MAX: {
    address: "0xc8fc18299043e0C2D36C630fcD933db0c6f17042"   // MAX token (100 required)
  }
};

// Standard ERC20 ABI for token interactions
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Hemi mainnet configuration (Chain ID 43111)
export const HEMI_NETWORK = {
  chainId: 43111,
  name: "Hemi Network",
  rpcUrl: "https://rpc.hemi.network/rpc",
  blockExplorer: "https://explorer.hemi.xyz",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  }
};
