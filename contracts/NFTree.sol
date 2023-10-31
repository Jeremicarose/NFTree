// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract NFTree is Initializable,  ERC721URIStorageUpgradeable  {
    struct Tree {
        string species;
        uint256 age;
        string location;
    }

    mapping(uint256 => Tree) private _treeInfo;

    
    uint256 private _totalSupply;

    event TreeMinted(uint256 indexed tokenId, string species, uint256 age, string location);
    event TreeAgeUpdated(address indexed owner, uint256 indexed tokenId, uint256 newAge);

    function initialize() public initializer {
        __ERC721_init("TreeNFT", "TNFT");
    }

    function _setTreeInfo(uint256 tokenId, Tree memory tree) internal {
        _treeInfo[tokenId] = tree;
    }

    function mint(
        address to,
        uint256 tokenId,
        string calldata species,
        uint256 age,
        string calldata location,
        string calldata url
    ) public returns (uint256) { 
        _mint(to, tokenId);
        _totalSupply += 1;
        _setTreeInfo(tokenId, Tree(species, age, location));
        _setTokenURI(tokenId, url);
        emit TreeMinted(tokenId, species, age, location);
        return tokenId;
    }

    function getTreeInfo(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256,
            string memory
        )
    {
        Tree memory tree = _treeInfo[tokenId];
        return (
            tree.species,
            tree.age,
            tree.location
        );
    }

    function getTreeUrl(uint256 tokenId) public view returns (string memory) {
        require(tokenId < totalSupply(), "Token ID does not exist");
        return tokenURI(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

  
}
