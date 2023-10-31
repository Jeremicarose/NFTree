const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTree Contract", function () {
  let NFTree;
  let nftree;
  let owner;
  let user1;

  beforeEach(async function () {
    NFTree = await ethers.getContractFactory("NFTree");
    [owner, user1] = await ethers.getSigners();
    nftree = await NFTree.deploy();
    await nftree.deployTransaction.wait(); // wait for the transaction to be mined
  });
  

  describe("Minting a tree", function () {
    it("should mint a tree with valid parameters", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 5;
      const location = "Kenya";
      const url = "http://example.com/tree.jpg";

      await nftree.connect(owner).mint(user1.address, tokenId, species, age, location, url);

      const treeInfo = await nftree.getTreeInfo(tokenId);
      expect(treeInfo[0]).to.equal(species);
      expect(treeInfo[1]).to.equal(age);
      expect(treeInfo[2]).to.equal(location);

      const treeUrl = await nftree.getTreeUrl(tokenId);
      expect(treeUrl).to.equal(url);
    });
  });

  describe("Fetching total supply", function () {
    it("should return correct total supply after minting a tree", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 5;
      const location = "Kenya";
      const url = "http://example.com/tree.jpg";

      await nftree.connect(owner).mint(user1.address, tokenId, species, age, location, url);

      const totalSupply = await nftree.totalSupply();
      expect(totalSupply).to.equal(1);
    });
  });
});
