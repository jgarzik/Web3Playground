// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Using OpenZeppelin 4.8.0 which has high compatibility
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@4.8.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.0/utils/Base64.sol";
import "@openzeppelin/contracts@4.8.0/utils/Strings.sol";

/**
 * @title Hemi wen-TGE NFT
 * @notice An enhanced, fully on-chain NFT contract deployed on the Hemi chain using inline JPEG images.
 *         Each wallet may mint one WENTGE NFT for free while minting is enabled.
 *         The NFT image is stored as base64-encoded JPEG data directly in the contract.
 *         This contract supports enumeration for better wallet compatibility and
 *         event emission for minting, JPEG updates, and disabling/enabling minting.
 *
 * Features:
 * - Free public mint (one per wallet)
 * - Royalty-free NFT
 * - ERC-721 compliance with full transferability and enumeration
 * - Image is embedded directly in the metadata as base64-encoded JPEG
 * - Owner may update the image data at any time
 * - Owner may disable or re-enable minting
 * - Token holders may burn their own NFTs
 * - Enhanced wallet and marketplace compatibility
 */
contract WenTGE is ERC721Enumerable, ERC721Burnable, Ownable {
    using Strings for uint256;

    /// @notice Base64-encoded JPEG image data shared across all tokens (no MIME prefix)
    string public imageData;
    
    /// @notice Flag indicating whether minting is currently enabled
    bool public mintingEnabled = true;

    /// @notice Next token ID to be minted (starts from 1)
    uint256 private _nextTokenId = 1;

    /// @notice Emitted when a new token is minted
    event Minted(address indexed to, uint256 tokenId);

    /// @notice Emitted when minting is disabled
    event MintingDisabled();

    /// @notice Emitted when minting is re-enabled
    event MintingEnabled();

    /// @notice Emitted when the image data is updated by the owner
    event ImageDataUpdated(string newImageData);

    /**
     * @notice Contract constructor
     * @param _initialImageData The initial base64-encoded JPEG data to be used for all minted NFTs (without MIME prefix)
     */
    constructor(string memory _initialImageData) ERC721("wen TGE", "WENTGE") {
        imageData = _initialImageData;
    }

    /**
     * @notice Allows any wallet to mint one NFT, if minting is enabled
     * @dev Each address may only mint once
     */
    function mint() external {
        require(mintingEnabled, "Minting is disabled");
        require(balanceOf(msg.sender) == 0, "Only one NFT per address");
        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;
        _mint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId);
    }

    /**
     * @notice Permanently disables public minting
     * @dev Can only be called by the contract owner
     */
    function disableMinting() external onlyOwner {
        mintingEnabled = false;
        emit MintingDisabled();
    }

    /**
     * @notice Re-enables public minting after it has been disabled
     * @dev Can only be called by the contract owner
     */
    function enableMinting() external onlyOwner {
        mintingEnabled = true;
        emit MintingEnabled();
    }

    /**
     * @notice Updates the global image data
     * @param _newImageData The new base64-encoded JPEG data (without MIME prefix)
     * @dev Can only be called by the contract owner
     */
    function updateImageData(string memory _newImageData) external onlyOwner {
        imageData = _newImageData;
        emit ImageDataUpdated(_newImageData);
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
        
        // Construct the metadata JSON with additional fields for better compatibility
        string memory metadata = string(
            abi.encodePacked(
                '{"name":"wen TGE #',
                tokenId.toString(),
                '", "description":"Hemi wen-TGE NFT", "image":"',
                fullImageUri,
                '", "attributes":[]}'
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
     * @notice Returns a direct link to the image for a token
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
