// scripts/deploy.js

  const { ethers, upgrades } = require("hardhat");

  async function main() {
     const gas = await ethers.provider.getGasPrice()
     const TreeNFT = await hre.ethers.getContractFactory("NFTree");
     console.log("Deploying NFTree contract...");
  
     const treeNFT = await upgrades.deployProxy(TreeNFT,  {
        gasPrice: gas, 
        initializer: "initialize",
     });
     await treeNFT.deployed();
     console.log("NFTree contract deployed to:", treeNFT.address);
  }
  
  main().catch((error) => {
     console.error(error);
     process.exitCode = 1;

  });
 