// scripts/deploy.js

const hre = require("hardhat");
const { default: NFTree } = require("../client/src/NFTree");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const TreeNFT = await hre.ethers.getContractFactory("NFTree");
  const treeNFT = await NFTree.deploy();

  await treeNFT.deployed();

  console.log("TreeNFT contract deployed to:", treeNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
