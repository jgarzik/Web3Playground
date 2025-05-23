// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Using OpenZeppelin 4.8.0 which has high compatibility
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.8.0/utils/Base64.sol";
import "@openzeppelin/contracts@4.8.0/utils/Strings.sol";

/**
 * @dev Interface for the ERC20 token standard
 */
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title Foom NFT
 * @notice A fully on-chain NFT contract deployed on the Hemi chain using inline JPEG images.
 *         Users mint a Foom NFT by burning 3,000 HAIR tokens and 100 MAX tokens.
 *         The NFT image is stored as base64-encoded JPEG data directly in the contract.
 *         Each NFT has unique attributes deterministically generated from its token ID.
 *
 * Features:
 * - Mint by burning 3,000 HAIR + 100 MAX tokens (approximately $0.50 total)
 * - Royalty-free NFT
 * - ERC-721 compliance with full transferability and enumeration
 * - Image is embedded directly in the metadata as base64-encoded JPEG
 * - Functional immutability - no owner, no fee updates, no image updates
 * - Token holders may burn their own NFTs
 * - Enhanced wallet and marketplace compatibility
 * - Fun attributes that are deterministically generated based on tokenId
 */
contract Foom is ERC721Enumerable, ERC721Burnable {
    using Strings for uint256;

    /// @notice Burn address for tokens
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    /// @notice HAIR token contract address on Hemi
    IERC20 public constant HAIR_TOKEN = IERC20(0x5B774f563C902FA7b203FB7029ed6eD4Ce274705);
    
    /// @notice MAX token contract address on Hemi
    IERC20 public constant MAX_TOKEN = IERC20(0xc8fc18299043e0C2D36C630fcD933db0c6f17042);
    
    /// @notice Amount of HAIR tokens required as minting fee (3,000)
    uint256 public constant HAIR_TKN_FEE = 3000 * 10**18; // Assuming 18 decimals
    
    /// @notice Amount of MAX tokens required as minting fee (100)
    uint256 public constant MAX_TKN_FEE = 100 * 10**18; // Assuming 18 decimals

    /// @notice Base64-encoded JPEG image data shared across all tokens (no MIME prefix)
    string public imageData;
    
    /// @notice Next token ID to be minted (starts from 1)
    uint256 private _nextTokenId = 1;

    /// @notice Emitted when a new token is minted
    event Minted(address indexed to, uint256 tokenId);

    /**
     * @notice Contract constructor
     * @param _initialImageData The base64-encoded JPEG data to be used for all NFTs (without MIME prefix)
     */
    constructor(
        string memory _initialImageData
    ) ERC721("Foom", "FOOM") {
        imageData = _initialImageData;
    }

    /**
     * @notice Allows any wallet to mint NFTs by burning HAIR and MAX tokens
     * @dev Implements check-effects-interactions pattern to prevent reentrancy attacks
     * @dev Users must first approve this contract to spend their HAIR and MAX tokens
     */
    function mint() external {
        // Effects: Update state before external calls
        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;
        
        // Interactions: Transfer tokens to burn address (these will revert if insufficient balance)
        require(
            HAIR_TOKEN.transferFrom(msg.sender, BURN_ADDRESS, HAIR_TKN_FEE),
            "HAIR token transfer failed"
        );
        require(
            MAX_TOKEN.transferFrom(msg.sender, BURN_ADDRESS, MAX_TKN_FEE),
            "MAX token transfer failed"
        );

        // Mint the NFT last
        _mint(msg.sender, tokenId);
        
        emit Minted(msg.sender, tokenId);
    }

    /**
     * @notice Generates attributes for a token based on its ID
     * @param tokenId The ID of the token
     * @return A JSON string containing the token's attributes formatted for marketplace compatibility
     */
    function _generateAttributes(uint256 tokenId) internal pure returns (string memory) {
        // Cosmic Energy Level (1-100) - Numeric value without quotes
        uint256 cosmicEnergy = (tokenId * 17) % 100 + 1;
        
        // Foom Mood (8 options) - String value with quotes
        string[8] memory moods = [
            "Contemplative", "Exuberant", "Mischievous", "Serene", 
            "Curious", "Playful", "Determined", "Whimsical"
        ];
        uint256 moodIndex = tokenId % 8;
        
        // Resonance Frequency (432-528 Hz) - Numeric value with unit display
        uint256 frequency = 432 + (tokenId % 97);
        
        // Paradox Resistance (0% to 99.9%) - Percentage with decimal display
        uint256 paradoxValue = (tokenId * 31 + 17) % 1000;
        uint256 paradoxWhole = paradoxValue / 10;
        uint256 paradoxDecimal = paradoxValue % 10;
        
        // Mineral Composition - Text value displaying primary and secondary minerals
        string[10] memory primaryMinerals = [
            "Quantum Quartz", "Dimensional Diamond", "Cosmic Copper", "Nebula Nickel",
            "Void Vibranium", "Paradox Platinum", "Multiverse Marble", "Tesseract Titanium",
            "Anomalous Amber", "Entropy Emerald"
        ];
        
        string[10] memory secondaryMinerals = [
            "Spectral Silver", "Graviton Gold", "Temporal Tin", "Wormhole Wolfram",
            "Singularity Sapphire", "Ethereal Emerald", "Black Hole Beryl", "Quantum Quasar",
            "Galactic Garnet", "Prism Peridot"
        ];
        
        uint256 primaryIndex = tokenId % 10;
        uint256 secondaryIndex = (tokenId / 10) % 10;
        uint256 primaryPercent = 60 + (tokenId % 21);
        uint256 secondaryPercent = 100 - primaryPercent;
        
        string memory mineralComposition = string(abi.encodePacked(
            primaryPercent.toString(), "% ", primaryMinerals[primaryIndex], 
            " / ", secondaryPercent.toString(), "% ", secondaryMinerals[secondaryIndex]
        ));
        
        // Combine all attributes into a single JSON array following metadata standards
        return string(abi.encodePacked(
            '[{"trait_type":"Cosmic Energy","value":', cosmicEnergy.toString(), 
            '},{"trait_type":"Mood","value":"', moods[moodIndex], 
            '"},{"trait_type":"Resonance Frequency","value":', frequency.toString(), 
            ',"display_type":"number","unit":"Hz',
            '"},{"trait_type":"Paradox Resistance","value":', paradoxWhole.toString(), 
            ',"display_type":"number","max_value":100,"decimals":', paradoxDecimal.toString(),
            '},{"trait_type":"Mineral Composition","value":"', mineralComposition, '"}]'
        ));
    }

    /**
     * @notice Returns token metadata including the embedded JPEG image and additional fields
     * @param tokenId The ID of the token to fetch metadata for
     * @return A base64-encoded JSON metadata string
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        // Construct full image URI with MIME type
        string memory fullImageUri = string(
            abi.encodePacked(
                "data:image/jpeg;base64,",
                imageData
            )
        );
        
        // Generate attributes JSON array
        string memory attributesJson = _generateAttributes(tokenId);
        
        // Construct the metadata JSON with additional fields for better compatibility
        string memory metadata = string(
            abi.encodePacked(
                '{"name":"Foom #',
                tokenId.toString(),
                '", "description":"Foom NFT - Minted by burning HAIR and MAX tokens", "image":"',
                fullImageUri,
                '", "attributes":',
                attributesJson,
                '}'
            )
        );

        // Return the base64-encoded metadata
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(metadata))
            )
        );
    }
    
    /**
     * @notice Returns a direct link to the image for all tokens
     * @return The full data URI for the image
     */
    function imageURI() public view returns (string memory) {
        return string(
            abi.encodePacked(
                "data:image/jpeg;base64,",
                imageData
            )
        );
    }
    
    /**
     * @notice Returns all token IDs owned by a specific address
     * @param _owner Address to get tokens for
     * @return Array of token IDs owned by the address
     */
    function tokensOfOwner(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @notice EIP-2981 NFT Royalty Standard - Returns zero royalties as this is a royalty-free NFT
     * @param _tokenId The NFT asset queried for royalty information
     * @return receiver Address of who should be sent the royalty payment (zero address)
     * @return royaltyAmount The royalty payment amount (always zero)
     */
    function royaltyInfo(uint256 _tokenId, uint256) external view returns (address receiver, uint256 royaltyAmount) {
        require(_exists(_tokenId), "Token does not exist");
        return (address(0), 0); // Explicitly zero royalties
    }
    
    /**
     * @notice Override for the _beforeTokenTransfer function to address the inheritance conflict
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    /**
     * @notice See {IERC165-supportsInterface}
     * @param interfaceId The interface identifier, as specified in ERC-165
     * @return bool True if the contract supports interfaceId
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        // EIP-2981 NFT Royalty Standard
        if (interfaceId == 0x2a55205a) {
            return true;
        }
        return super.supportsInterface(interfaceId);
    }
}
