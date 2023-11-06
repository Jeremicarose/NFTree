const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTree Contract", function () {
  let NFTree;
  let nftree;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    NFTree = await ethers.getContractFactory("NFTree");
    [owner, user1, user2] = await ethers.getSigners();
    nftree = await upgrades.deployProxy(NFTree, { initializer: "initialize" });
    await nftree.deployTransaction.wait(); // wait for the transaction to be mined
  });

  describe("Minting a tree", function () {
    it("should mint a tree with valid parameters", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 5;
      const location = "Kenya";
      const url = "http://example.com/tree.jpg";

      await nftree
        .connect(owner)
        .mint(user1.address, tokenId, species, age, location, url);

      const treeInfo = await nftree.getTreeInfo(tokenId);
      expect(treeInfo[0]).to.equal(species);
      expect(treeInfo[1]).to.equal(age);
      expect(treeInfo[2]).to.equal(location);

      const treeUrl = await nftree.getTreeUrl(tokenId);
      expect(treeUrl).to.equal(url);
    });

    it("should fail to mint a tree with an already used tokenId", async function () {
      const tokenId = 1;

      await nftree
        .connect(owner)
        .mint(
          user1.address,
          tokenId,
          "Oak",
          10,
          "USA",
          "http://example.com/tree.jpg"
        );

      await expect(
        nftree
          .connect(owner)
          .mint(
            user1.address,
            tokenId,
            "Pine",
            5,
            "Kenya",
            "http://example.com/tree2.jpg"
          )
      ).to.be.reverted;
    });

    it("should fail to mint a tree by a non-owner", async function () {
      const tokenId = 2;
      const species = "Pine";
      const age = 10;
      const location = "Canada";
      const url = "http://example.com/tree2.jpg";

      await expect(
        nftree
          .connect(user1)
          .mint(user2.address, tokenId, species, age, location, url)
      ).to.be.revertedWith("OwnableUnauthorizedAccount");
    });

    it("should return correct owner of a minted tree", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 10;
      const location = "USA";
      const url = "http://example.com/tree.jpg";

      await nftree
        .connect(owner)
        .mint(user1.address, tokenId, species, age, location, url);

      const ownerOfToken = await nftree.ownerOf(tokenId);
      expect(ownerOfToken).to.equal(user1.address);
    });
  });

  describe("Fetching tree info", function () {
    it("should fail to get tree info with an invalid tokenId", async function () {
      const invalidTokenId = 999;

      await expect(nftree.getTreeInfo(invalidTokenId)).to.be.reverted;
    });

    it("should transfer a tree from one user to another", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 10;
      const location = "USA";
      const url = "http://example.com/tree.jpg";

      await nftree
        .connect(owner)
        .mint(user1.address, tokenId, species, age, location, url);
      await nftree
        .connect(user1)
        .transferFrom(user1.address, owner.address, tokenId);

      const newOwnerOfToken = await nftree.ownerOf(tokenId);
      expect(newOwnerOfToken).to.equal(owner.address);
    });
  });

  describe("Fetching tree URL", function () {
    it("should fail to get tree URL with an invalid tokenId", async function () {
      const invalidTokenId = 999;

      await expect(nftree.getTreeUrl(invalidTokenId)).to.be.reverted;
    });

    
  });

  describe("Fetching total supply", function () {
    it("should return correct total supply after minting a tree", async function () {
      const tokenId = 1;
      const species = "Oak";
      const age = 5;
      const location = "Kenya";
      const url = "http://example.com/tree.jpg";

      await nftree
        .connect(owner)
        .mint(user1.address, tokenId, species, age, location, url);

      const totalSupply = await nftree.totalSupply();
      expect(totalSupply).to.equal(1);
    });

    it("should return correct total supply after minting multiple trees", async function () {
      await nftree
        .connect(owner)
        .mint(
          user1.address,
          1,
          "Oak",
          5,
          "Kenya",
          "http://example.com/tree1.jpg"
        );
      await nftree
        .connect(owner)
        .mint(
          user1.address,
          2,
          "Pine",
          10,
          "USA",
          "http://example.com/tree2.jpg"
        );

      const totalSupply = await nftree.totalSupply();
      expect(totalSupply).to.equal(2);
    });
  });
});
